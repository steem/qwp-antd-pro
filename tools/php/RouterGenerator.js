const fs = require('fs');
const path = require('path');

const serviceOps = {};

function isPublicModule(routers, key) {
  for (const r in routers) {
    if (r.indexOf(key) === 0 && routers[r][3]) return true;
  }
  return false;
}
function generatePHPPredefinedAcls(projectBasePath, routers, routersIcon) {
  const tmplCodeFile = path.join(path.join(__dirname, 'predefined_acls.php'));
  let tmplCode = fs.readFileSync(tmplCodeFile, {encoding: 'utf-8'});
  let newCode = '';
  const newRoutersTag = {};
  let routerPath;

  for (routerPath in routers) {
    const key = routerPath.split('/');
    key.pop();
    const tmpRouters = [];
    while (key.length > 1) {
      const name = key[key.length - 1];
      const p = key.join('/');
      if (!newRoutersTag[p] && !routers[p]) {
        tmpRouters.push({
          path: p,
          /* eslint-disable object-shorthand */
          name: name,
          /* eslint-enable object-shorthand */
        });
        newRoutersTag[p] = true;
      }
      key.pop();
    }
    for (let i = tmpRouters.length - 1; i >= 0; i--) {
      const r = tmpRouters[i];
      const icon = routersIcon[r.path] || '';
      const isPublic = isPublicModule(routers, r.path) ? 'true' : 'false';
      newCode += `        '${r.path}' => array('name' => '${r.name}', 'icon' => '${icon}', 'public' => ${isPublic}),\r\n`;
    }
  }
  for (routerPath in routers) {
    const r = routers[routerPath]
    const page = r[2] ? 'true' : 'false';
    const isPublic = r[3] ? 'true' : 'false';
    const icon = r[1] || routersIcon[routerPath];
    newCode += `        '${routerPath}' => array('name' => '${r[0]}', 'icon' => '${icon}', 'page' => ${page}, 'public' => ${isPublic}),\r\n`;
  }
  tmplCode = tmplCode.replace('/* AUTO */', newCode);
  fs.writeFileSync(path.join(projectBasePath, 'src', 'services', 'php', 'security', 'predefined_acls.php'), tmplCode);
}
function findOpsCode(dir, level, parent) {
  const files = fs.readdirSync(dir);
  for (let fileName of files) {
    const newPath = path.join(dir, fileName);
    const s = fs.statSync(newPath);
    if (s.isDirectory()) {
        if (level === 0 && fileName === 'passport') continue;
        findOpsCode(newPath, level + 1, `${parent}${fileName}/`);
    } else if (level !== 0) {
        if (!fileName.endsWith('.php') || fileName.startsWith('home') ||
        fileName.startsWith('form_') || fileName.startsWith('common.')) continue;
        if (!fileName.startsWith('ops_')) continue;
        const dots = fileName.split('.');
        if (dots.length !== 2) continue;
        // remove .php
        fileName = fileName.substr(0, fileName.length - 4);
        // module ops
        const modulePath = parent.substr(0, parent.length - 1);
        if (!serviceOps[modulePath]) serviceOps[modulePath] = [];
        const opName = fileName.substr(4);
        serviceOps[modulePath][opName] = true;
    }
  }
}
function generateOpsCode(projectBasePath, routers) {
  const tmplCodeFile = path.join(path.join(__dirname, 'predefined_ops.php'));
  let tmplCode = fs.readFileSync(tmplCodeFile, {encoding: 'utf-8'});
  let newCode = '';

  for (const p in serviceOps) {
      newCode += `        '${p}' => array(\r\n`;
      const op = serviceOps[p];
      const isPublic = isPublicModule(routers, p) ? 'true' : 'false';
      for (const n in op) {
        newCode += `              '${n}' => array('name' => '${n}', 'public' => ${isPublic}),\r\n`;
      }
      newCode += `         ),\r\n`;
  }
  tmplCode = tmplCode.replace('/* AUTO */', newCode);
  fs.writeFileSync(path.join(projectBasePath, 'src', 'services', 'php', 'security', 'predefined_ops.php'), tmplCode);
}
module.exports = (projectBasePath, routers, routersIcon) => {
  generatePHPPredefinedAcls(projectBasePath, routers, routersIcon);
  findOpsCode(path.join(projectBasePath, 'src', 'services', 'php', 'modules'), 0, '/');
  generateOpsCode(projectBasePath, routers);
}
