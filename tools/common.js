const fs = require('fs');
const path = require('path');

const projectBasePath = path.dirname(__dirname);

function getFileContent(p) {
  return fs.readFileSync(p, {encoding: 'utf-8'});
}

module.exports = {
  projectBasePath,
  appsPath: path.join(projectBasePath, 'src', 'apps'),
  modelsPath: path.join(projectBasePath, 'src', 'models'),
  requestsPath: path.join(projectBasePath, 'src', 'requests'),
  mockPath: path.join(projectBasePath, 'mock'),
  mockCorePath: path.join(projectBasePath, 'mock', 'core'),
  mockServicePath: path.join(projectBasePath, 'mock', 'core', 'services'),
  crudPath: path.join(__dirname, 'crud'),
  getFileContent,
}