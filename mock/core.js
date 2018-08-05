import fs from 'fs';
import path from 'path';
import _ from 'lodash';

function createApi(a) {
  const isFunction = _.isFunction(a);

  return (req, res) => {
    if (isFunction) {
      a(req, res);
      return;
    }
    res.status(200).send(a);
  }
}
function addService(api, serviceMap, uri, verb, isSingle) {
  if (!isSingle) isSingle = typeof(api) === 'function';
  if (isSingle || api._ || !api.$) {
    serviceMap[`${verb} ${uri}`] = createApi(api._ ? api._ : api);
  }
  if (isSingle) return;
  if (api.$) {
    createServices(api.$, serviceMap, verb, uri + '/');
  }
}
function createServices(services, serviceMap, verb, parent) {
  if (services._ || services.$ || typeof(services) === 'function') {
    addService(services, serviceMap, parent, 'GET', false);
    return;
  }
  for (const api in services) {
    addService(services[api], serviceMap, parent + api, verb, api.indexOf('/') !== -1);
  }
}
function createServicesInDir(serviceMap, dir, parent) {
  const dirs = fs.readdirSync(dir);

  for (let i = 0, cnt = dirs.length; i < cnt; ++i) {
    const aDir = dirs[i];
    const filePath = path.join(dir, aDir);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      createServicesInDir(serviceMap, filePath, parent + aDir + '/');
      continue;
    }
    if (aDir.startsWith('_') || !aDir.endsWith('.js')) continue;
    /* eslint-disable import/no-dynamic-require */
    /* eslint-disable global-require */
    let services = require(filePath);
    /* eslint-disable global-require */
    /* eslint-enable import/no-dynamic-require */
    if (services.default) services = services.default;
    const uri = parent + path.basename(aDir, '.js');
    if (services._ || services.$ || typeof(services) === 'function') {
      addService(services, serviceMap, uri, 'GET', false);
      continue;
    }
    for (const verb in services) {
      createServices(services[verb], serviceMap, verb.toUpperCase(), uri);
    }
  }
}
export function createMockServices(services) {
  const serviceMap = {};
  for (const verb in services) {
    createServices(services[verb], serviceMap, verb.toUpperCase(), '/');
  }
  createServicesInDir(serviceMap, path.join(__dirname, 'services'), '/');
  return serviceMap;
}
