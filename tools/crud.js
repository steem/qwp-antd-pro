const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const util = require('util');
const {
  argv,
} = require('optimist');
const {
  crudPath,
  mockCorePath,
  requestsPath,
  modelsPath,
  mockServicePath,
  getFileContent,
  appsPath,
} = require('./common');

let modulePath;
let moduleDir;
let objectName;
let objectUpperCaseName;
let modelName;

/* eslint-disable no-console */
/* eslint-disable no-eval */

function isValidFile(p) {
  if (fs.existsSync(p)) {
    console.log(chalk.yellow(p + ' already exists'));
    return false;
  }
  return true;
}

function isValidPath() {
  if (!isValidFile(modulePath)) return false;
  if (!isValidFile(modulePath + '.js')) return false;
  if (!isValidFile(modulePath + '.less')) return false;
  if (!isValidFile(path.join(moduleDir, objectName + 'Dialog.js'))) return false;
  if (!isValidFile(path.join(mockServicePath, modelName + '.js'))) return false;
  if (!isValidFile(path.join(modelsPath, modelName + '.js'))) return false;
}
function replaceCode(src, dst) {
  let code = getFileContent(src);
  code = code.replace(/user/g, objectName);
  code = code.replace(/User/g, objectUpperCaseName);
  fs.writeFileSync(dst, code);
}
const tmpl1 = '  /* moduleMaps */';
function replaceMockCode() {
  const p = path.join(mockCorePath, 'mock.js');
  let code = getFileContent(p);
  const r = "  '/" + argv.path + "': '" + modelName +"',\r\n";
  if (code.indexOf(r) !== -1) return;
  code = code.replace(tmpl1, r + tmpl1);
  fs.writeFileSync(p, code);
}
const tmpl2 = '/* AUTO_IMPORT */';
const tmpl3 = '/* AUTO */';
function replaceMockServiceStubCode() {
  const p = path.join(mockServicePath, 'index.js');
  let code = getFileContent(p);
  let r = util.format("const %s = require('./%s');\r\n%s", modelName, modelName, tmpl2);
  if (code.indexOf(r) !== -1) return;
  code = code.replace(tmpl2, r);
  r = util.format("  %s,\r\n%s", modelName, tmpl3);
  code = code.replace(tmpl3, r);
  fs.writeFileSync(p, code);
}
function replaceRequestCode() {
  let code = getFileContent(path.join(crudPath, 'user_request.js'));
  code = code.replace("system', 'user", argv.path.split('/').join("', '"));
  code = code.replace(/user/g, objectName);
  code = code.replace(/User/g, objectUpperCaseName);
  fs.writeFileSync(path.join(requestsPath, modelName + '.js'), code);
}
function replaceMockServiceCode() {
  const mockServiceCodePath = path.join(mockServicePath, modelName + '.js');
  fs.copyFileSync(path.join(crudPath, 'user_mock.js'), mockServiceCodePath);
  replaceCode(mockServiceCodePath, mockServiceCodePath);
  let code = getFileContent(mockServiceCodePath);
  const r = util.format("const routerPath = '/%s';", argv.path);
  code = code.replace("const routerPath = '/';", r);
  fs.writeFileSync(mockServiceCodePath, code);
}
function main() {
  if (!argv.path) {
    console.log(chalk.yellow('Router path is required'));
    return false;
  }
  argv.path = argv.path.trim('/');
  console.log(argv.path.split('/'));
  modulePath = path.join(appsPath, argv.path);
  objectName = path.basename(modulePath);
  modelName = objectName;
  if (argv.model) modelName = argv.model;
  objectUpperCaseName = objectName.substr(0, 1).toUpperCase() + objectName.substr(1);
  moduleDir = path.dirname(modulePath);
  console.log('Module path: ' + modulePath);
  if (!fs.existsSync(moduleDir)) {
    console.log(chalk.yellow('Module dir: ' + moduleDir + ' does not exist, please create the dir manually!'));
    return;
  }
  if (isValidPath() === false) {
    console.log(chalk.yellow('Failed'));
    return;
  }
  replaceCode(path.join(crudPath, 'user.js'), modulePath + '.js');
  replaceCode(path.join(crudPath, 'user.less'), modulePath + '.less');
  replaceCode(path.join(crudPath, 'UserDialog.js'), path.join(moduleDir, objectUpperCaseName + 'Dialog.js'));
  replaceCode(path.join(crudPath, 'user_model.js'), path.join(modelsPath, modelName + '.js'));
  replaceMockServiceCode();
  replaceRequestCode();
  replaceMockCode();
  replaceMockServiceStubCode();
  console.log(chalk.green('Finished'));
  console.log(chalk.green('Remember to change router.js file: ' + path.join(moduleDir, 'router.js')));
  console.log({
    path: objectName,
    models: objectName,
  });
  console.log(chalk.green('After change router.js file, use "npm run router:x" to generate router, currently x must be php'));
}

main();
