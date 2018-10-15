const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const {
  argv,
} = require('optimist');
const {
  distPath,
  projectBasePath,
  getFileContent,
  srcPath,
} = require('./common');

function prePublish() {
  let p = path.join(projectBasePath, '.webpackrc.js');
  fs.copySync(p, p + '.bak');
  let code = getFileContent(p);
  code = code.replace("publicPath: '/',", "publicPath: './assets/',");
  fs.writeFileSync(p, code);
  p = path.join(srcPath, 'index.ejs');
  fs.copySync(p, p + '.bak');
  code = getFileContent(p);
  code = code.replace("./rollbar.min.js", "./assets/rollbar.min.js");
  code = code.replace("./data-set.min.js", "./assets/data-set.min.js");
  fs.writeFileSync(p, code);
}
function afterPublish() {
  let p = path.join(projectBasePath, '.webpackrc.js');
  fs.copySync(p + '.bak', p);
  fs.unlinkSync(p + '.bak');
  p = path.join(srcPath, 'index.ejs');
  fs.copySync(p + '.bak', p);
  fs.unlinkSync(p + '.bak');
}
function main() {
  const files = fs.readdirSync(distPath);
  const assetsDir = path.join(distPath, 'assets');

  fs.mkdirSync(assetsDir);
  for (const f of files) {
    if (f === 'index.html') continue;
    const aFile = path.join(distPath, f);
    fs.moveSync(aFile, path.join(assetsDir, f));
  }
  afterPublish();
}

if (argv.prePublish) {
  console.log(chalk.green('Begin to pre-publish files'));
  prePublish();
  console.log(chalk.green('Finished'));
} else {
  console.log(chalk.green('Begin to publish files'));
  main();
  console.log(chalk.green('Finished'));
}