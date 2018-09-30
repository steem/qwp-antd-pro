const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const {
  distPath,
} = require('./common');

function main() {
  const files = fs.readdirSync(distPath);
  const assetsDir = path.join(distPath, 'assets');

  fs.mkdirSync(assetsDir);
  for (const f of files) {
    if (f === 'index.html') continue;
    const aFile = path.join(distPath, f);
    fs.moveSync(aFile, path.join(assetsDir, f));
  }
}

console.log(chalk.green('Begin to publish files'));
main();
console.log(chalk.green('Finished'));