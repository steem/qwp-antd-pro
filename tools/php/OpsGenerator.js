const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');
const mkdirs = require('mkdirs');
const projectBasePath = path.dirname(path.dirname(__dirname));
const argv = require('optimist').argv;
let modulesPath = path.join(projectBasePath, 'src', 'services', 'php', 'modules');

function getFileContent(p) {
  return fs.readFileSync(p, {encoding: 'utf-8'});
}
function isValidName(_) {
  return /^[\w-_]+$/.test(_);
}
function checkModuleName() {
  let m = argv.m.split('/');

  if (m[0].length === 0) m.shift();
  for (let item of m) {
    if (!isValidName(item)) {
      return false;
    }
  }
}
function generateCode(filePath, verb, name, isList) {
  if (fs.existsSync(filePath)) {
    console.log(chalk.grey(`Module already exist: ${filePath}`));
    return;
  }
  let tmplCode;
  if (isList) tmplCode = getFileContent(path.join(__dirname, 'list_tmpl.php'));
  else tmplCode = getFileContent(path.join(__dirname, 'ops_tmpl.php'));
  tmplCode = tmplCode.replace(/object/gm, name);
  if (verb) {
    if (isList) tmplCode = tmplCode.replace(/list/gm, verb);
    else tmplCode = tmplCode.replace(/ops_/gm, verb + '_');
  }
  fs.writeFileSync(filePath, tmplCode);
}
function main() {
  if (!argv.m) {
    console.log(chalk.yellow('Please provide module path'));
    return;
  }
  if (!argv.name || !isValidName(argv.name)) {
    console.log(chalk.yellow('Please provide module name'));
    return;
  }
  if (argv.verb && !isValidName(argv.verb)) {
    console.log(chalk.yellow(`Invalid verb name ${argv.verb}`));
    return;
  }
  if (checkModuleName() === false) {
    console.log(chalk.yellow(`Illegal path: ${argv.m}`));
    return;
  }
  modulesPath = path.join(modulesPath, argv.m.trim('/').trim());
  if (!fs.existsSync(modulesPath)) mkdirs(modulesPath);
  if (argv.crud) {
    console.log(chalk.grey('Create CRUD ops'));
    let verb = 'create';
    generateCode(path.join(modulesPath, `ops_${verb}_${argv.name}.php`), verb, argv.name);
    verb = 'update';
    generateCode(path.join(modulesPath, `ops_${verb}_${argv.name}.php`), verb, argv.name);
    verb = 'del';
    generateCode(path.join(modulesPath, `ops_${verb}_${argv.name}.php`), verb, argv.name);
    verb = 'list';
    generateCode(path.join(modulesPath, `ops_${verb}_${argv.name}.php`), verb, argv.name);
  } else {
    modulesPath = path.join(modulesPath, `ops${argv.verb ? '_' + argv.verb : ''}_${argv.name}.php`);
    generateCode(modulesPath, argv.verb, argv.name, argv.list);
  }
}

main();
