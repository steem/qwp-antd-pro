const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');
const {
  argv,
} = require('optimist');
const {
  projectBasePath,
  appsPath,
  getFileContent,
} = require('./common');

let newRoutersCode = '';
const routers = {};
const routersIcon = {};

/* eslint-disable no-console */
/* eslint-disable no-eval */

function updatePublicRouters(p) {
  const paths = p.split('/');
  paths.pop();
  while (paths.length > 1) {
    const key = paths.join('/');
    for (const r in routers) {
      if (r === key) {
        r[3] = true;
        break;
      }
    }
    paths.pop();
  }
}
function addRouter(router, parentPath, parentIdentity) {
  let parentModels = false;
  if (router.models) {
    if (!_.isArray(router.models)) router.models = [router.models];
    parentModels = "['" + router.models.join("','");
  }
  if (router.icon) routersIcon[parentPath.substr(0, parentPath.length - 1)] = router.icon;
  if (!_.isArray(router.items)) router.items = [router.items];
  for (let i = 0, cnt = router.items.length; i < cnt; ++i) {
    let item = router.items[i];
    let key = parentPath;
    let codePath = parentPath;

    if (_.isString(item)) item = {path: item};
    if (item.path) {
      key += item.path;
    }
    if (item.codePath) {
      codePath = item.codePath;
    } else {
      if (item.code) {
        codePath += item.code;
      } else if (item.path) {
        codePath += item.path;
      }
      codePath = './apps' + codePath;
    }
    if (key.endsWith('/')) key = key.substr(0, key.length - 1);
    if (item.icon) routersIcon[key] = item.icon;
    const isPublic = router.public || item.public;
    routers[key] = [item.path || parentIdentity, item.icon ? item.icon : '', router.page || item.page, isPublic];
    if (isPublic) updatePublicRouters(key);
    let code = "'" + key + "': { component: dynamicWrapper(app, ";
    if (item.selfModels && !_.isArray(item.selfModels)) item.selfModels = [item.selfModels];
    else if (item.models && !_.isArray(item.models)) item.models = [item.models];
    if (parentModels || (item.selfModels && item.selfModels.length > 0) ||
      (item.models && item.models.length > 0)) {
      if (!item.selfModels && parentModels) {
        code += parentModels;
      } else if (item.selfModels || item.models) {
        code += "['";
      }
      if (item.selfModels) {
        code += item.selfModels.join("','");
      } else if (item.models) {
        code += item.models.join("','");
      }
      code += "']";
    } else {
      code += '[]';
    }
    code += ", () => import('" + codePath + "'))";
    newRoutersCode += '    ' + code + " },\r\n";
    // if (item.children) {
    //   if (item.children.models) {
    //     if (router.models) item.children.models = _.concat(router.models, item.children.models);
    //   } else {
    //     if (router.models) item.children.models = router.models;
    //   }
    //   addRouter(item.children, key + '/');
    // }
  }
}
function createRouter(filePath, parentPath, parentIdentity) {
  if (!fs.existsSync(filePath)) return;

  console.log(chalk.cyan(`Router: ${filePath}`));
  const code = getFileContent(filePath);
  eval(code);
  if (typeof(router) === 'undefined') {
    console.log(chalk.yellow('Router code issue: ' + filePath));
    return;
  }
  /* eslint-disable no-undef */
  if (!router.items) {
    console.log(chalk.yellow('Router is empty: ' + filePath));
    return;
  }
  addRouter(router, parentPath, parentIdentity);
  /* eslint-enable no-undef */
}
function findIcon(dir, parentPath) {
  const newPath = path.join(dir, 'icon.txt');
  if (!fs.existsSync(newPath)) return;
  const s = fs.statSync(newPath);
  if (s.isFile()) {
    let icon = getFileContent(newPath);
    icon = icon.trim();
    if (icon.length > 0) routersIcon[parentPath.substr(0, parentPath.length - 1)] = icon;
    else console.log(chalk.yellow(`ICON file content is empty: ${newPath}`));
  }
}
function findRouters(dir, parentPath, top, parentIdentity) {
  if (!top) {
    findIcon(dir, parentPath);
    createRouter(path.join(dir, 'router.js'), parentPath, parentIdentity);
  }
  const files = fs.readdirSync(dir);

  if (!files || files.length === 0) {
    console.log(chalk.blue('UI directory is empty: ' + dir));
    return;
  }
  for (let i = 0, cnt = files.length; i < cnt; ++i) {
    const newPath = path.join(dir, files[i]);
    const s = fs.statSync(newPath);
    if (s.isDirectory()) findRouters(newPath, parentPath + files[i] + '/', false, files[i]);
  }
}
function generateMockAclsCode() {
  let newAclsCode = '';
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
      const icon = routersIcon[r.path];
      newAclsCode += "'" + r.path + "': {name: '" + r.name +"'";
      if (icon) newAclsCode += ", icon: '" + icon +"'";
      newAclsCode += '},\r\n';
    }
  }
  for (routerPath in routers) {
    const r = routers[routerPath]
    const page = r[2] ? 'true' : 'false';
    const icon = r[1] || routersIcon[routerPath];
    newAclsCode += "'" + routerPath + "': {name: '" + r[0] +"', page: " + page;
    if (icon) newAclsCode += ", icon: '" + icon +"'";
    newAclsCode += '},\r\n';
  }

  const tmplCodeFile = path.join(projectBasePath, 'mock', 'core', 'services', 'data', 'acls_tmpl.js');
  let tmplCode = getFileContent(tmplCodeFile);
  tmplCode = tmplCode.replace('/* AUTO */', newAclsCode);
  fs.writeFileSync(path.join(projectBasePath, 'mock', 'core', 'services', 'data', 'acls.js'), tmplCode);
}
function generateCode() {
  if (newRoutersCode.length === 0) {
    console.log(chalk.yellow('No router code is found'));
    return;
  }
  const tmplCodeFile = path.join(projectBasePath, 'src', 'tmpl', 'router.template.js');

  if (!fs.existsSync(tmplCodeFile)) {
    console.log(chalk.yellow('Router template code file does not exist: ' + tmplCodeFile));
    return;
  }
  let tmplCode = getFileContent(tmplCodeFile);
  tmplCode = tmplCode.replace('/* AUTO */', newRoutersCode);
  fs.writeFileSync(path.join(projectBasePath, 'src', 'router.js'), tmplCode);
  generateMockAclsCode();
}
function getCodeGenerator() {
  if (!argv.language) {
    console.log(chalk.yellow('Language is not defined'));
    return false;
  }
  if (!fs.existsSync(path.join(__dirname, argv.language))) {
    console.log(chalk.yellow(`Language is not support: ${argv.language}`));
    return false;
  }
  /* eslint-disable import/no-dynamic-require */
  /* eslint-disable global-require */
  const generator = require(`./${argv.language}/RouterGenerator`);
  if (!generator) {
    console.log(chalk.yellow(`Load language generator [${argv.language}] failed`));
    return false;
  }
  console.log(chalk.green(`Generating code: ${argv.language}`));
  return generator;
}
function main() {
  console.log('Apps path: ' + appsPath);
  const codeGenerator = getCodeGenerator();
  if (!codeGenerator) return;
  findRouters(appsPath, '/', true, '');
  generateCode();
  codeGenerator(projectBasePath, routers, routersIcon);
  console.log(chalk.green('Finished'));
}

main();
