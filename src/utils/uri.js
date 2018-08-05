const config = require('./config');
const qs = require('query-string');
const _ = require('lodash');

let lastWindowHash = 0;
let lastPathName = 0;
let currentPath = '';
let params = {};

function join(...args) {
  let p = '';
  let sep = '';
  for (let i = 0, cnt = args.length; i < cnt; ++i) {
    if (args[i].length) {
      p += sep + args[i];
      sep = '&';
    }
  }
  return p
}
function queryChanged() {
  params = qs.parse(window.location.search)
}
function param(name, def) {
  if (!name) return params;
  if (typeof(window) === 'undefined') return def
  return _.isUndefined(params[name]) ? def : params[name]
}

function component(...args) {
  const uri = args.join('/');
  return uri[0] === config.routeUriPrefix ? uri : config.routeUriPrefix + uri;
}

function rootComponent(p) {
  if (!p) p = current();
  return component(p.split('/')[1]);
}

function isRoot(p) {
  return (p || window.location.pathname) === '/';
}

function reload() {
  window.location.reload();
}

function getWindowHash() {
  return window.location.hash ? window.location.hash.substr(1) : '';
}

function current() {
  const pathName = typeof(window) === 'undefined' ? '' : window.location.pathname;

  if (window.location.hash === lastWindowHash && pathName === lastPathName) return currentPath;

  let found = false;

  if (window.location.hash) {
    const h = getWindowHash();
    if (h.length > 1) {
      const pos = h.indexOf('?');
      if (pos > 1) {
        currentPath = h.substr(0, pos);
        found = true;
      } else if (pos === -1) {
        currentPath = h;
        found = true;
      }
    }
  }
  if (!found) {
    currentPath = pathName;
  }
  lastWindowHash = window.location.hash;
  lastPathName = pathName;
  return currentPath;
}

function ops ({ op, m, mock, restfulApi, ...data }) {
  let s = '';
  let d = '';
  let sep = '';

  for (const k in data) {
    d += `${sep}${k}=${encodeURIComponent(data[k])}`;
    if (!sep) sep = '&';
  }
  if (restfulApi === false || !config.restfulApi) {
    if (m) s = join(s, 'm=' + m);
    if (op) s = join(s, 'op=' + op);
    if (d) s = join(s, d);
    return (!mock && !config.useMockSerivce ? config.servicePrefix : config.mockServicePrefix) + s
  }
  s = join(s, (m || '') + '/?');
  if (op) s = join(s, 'op=' + op);
  if (d) s = join(s, d);
  return s;
}

function isPassportComponent (c) {
  return (c || current()).indexOf(config.passportRoot) === 0;
}

function isPortalComponent(c) {
  return (c || current()).indexOf(config.portalRoot) === 0;
}

function exception(type) {
  return type ? `/exception/${type}` : '/exception/404'
}

function isExceptionComponent(c) {
  return (c || current()).indexOf('/exception') === 0;
}

function defaultUri(isLogined, defaultComponent, acls) {
  let curPath = current();
  const isPassport = isPassportComponent(curPath);
  const s = getWindowHash();
  let curUri = false;
  let hasFrom = false;

  if ((isRoot() || isPassport) && s && s !== '/') {
    let pos = s.indexOf('?from=');
    if (pos !== -1) {
      hasFrom = true;
      curPath = s.substr(pos + 6);
      curUri = curPath;
      pos = curPath.indexOf('?');
      if (pos !== -1) curPath = curPath.substr(0, pos);
    }
  }
  if (isPassport) {
    if (!isLogined) return false;
    if (!hasFrom || isPassportComponent(curPath)) {
      if (!defaultComponent) {
        // miss configuration
        return exception(500);
      }
      curPath = component(defaultComponent);
      curUri = curPath;
    }
  }
  if (curPath === '/') {
    if (!defaultComponent) {
      // miss configuration
      return exception(500);
    }
    curPath = component(defaultComponent);
  }
  if (acls) {
    for (const p in acls) {
      if (curPath === p) return curUri || p;
    }
  }
  if (isLogined) {
    // no acl, return default component
    return exception(403);
  }
  let path = curUri || curPath;

  if (location.search) {
    if (path.indexOf('?') !== -1) path += '&';
    path += location.search;
  }
  let from = encodeURI(path);
  from = `?from=${from}`;
  return `${location.origin}/#${config.loginPath}${from}`;
}

function getHeaderNav (acls) {
  const headerNav = [];
  if (acls) {
    for (const p in acls) {
      const paths = p.split('/');
      if (paths.length === 2) {
        const item = { ...acls[p] };
        if (!item.icon && !item.image) item.icon = 'laptop';
        item.path = p;
        headerNav.push(item);
      }
    }
  }
  return headerNav;
}

function hasSiderBar (menus) {
  if (config.hasSiderBar === false) return false;
  if (!menus || menus.length === 0 || isPassportComponent()) return false;
  return true;
}

function isComponentInTarget(path, arr) {
  for (let i = 0, cnt = arr.length; i < cnt; ++i) {
    if (arr[i].indexOf(path) === 0) return true;
  }
  return false;
}

function getRedirect(items, data) {
  for (let i = 0, cnt = items.length; i < cnt; ++i) {
    const item = items[i];
    if (item.children) {
      if (item.children[0] && item.children[0].path) {
        data.push({
          from: item.path,
          to: item.children[0].path,
        });
      }
      getRedirect(item.children, data);
    }
  }
}

function getMenuData(acls, enableHeaderNav, headerNav, defaultCompnent) {
  const ret = [[], [{from: '/', to: config.loginPath}], config.loginPath];

  if (!acls) return ret;
  if (defaultCompnent && isPassportComponent(defaultCompnent)) defaultCompnent = false;

  // select one default component
  let hasAcls = false;
  const headerTags = {};

  if (!enableHeaderNav && headerNav) {
    for (const nav of headerNav) {
      if (!nav.default) headerTags[nav.path.split('/')[1]] = 1;
    }
  }
  for (const iPath in acls) {
    const acl = acls[iPath];
    hasAcls = true;
    if (!acl.page && !defaultCompnent) {
      defaultCompnent = iPath;
    }
    if (hasAcls && defaultCompnent) {
      break;
    }
  }
  if (!hasAcls) return ret;

  if (defaultCompnent) {
    ret[2] = defaultCompnent;
    ret[1][0].to = defaultCompnent;
  }
  
  const curPath = current();

  if (isPassportComponent() || curPath === '/') return ret;

  const dstRootComponent = rootComponent(curPath).substr(1);
  const tag = {};

  for (const iPath in acls) {
    const acl = acls[iPath];

    if (acl.page) continue;

    const p = iPath.split('/');

    if (p.length <= 1) continue;
    if (enableHeaderNav) {
      if (p[1] !== dstRootComponent) continue;
      if (p.length < 3 || p.length > 5) continue;
    } else {
      if (p.length < 2 || p.length > 4) {
        continue;
      }
      if (headerTags[dstRootComponent] && p[1] !== dstRootComponent) {
        continue;
      }
      if (headerTags[p[1]]) {
        if (p.length > 2 && headerTags[p[1]] === 1) {
          ret[1].push({
            from: component(p[1]),
            to: iPath,
          });
          headerTags[p[1]] = 2;
        }
      } 
    }
    p.pop();

    const parent = component(...p);
    const newItem = { ...acl };
    
    newItem.path = iPath;
    if (tag[parent]) {
      if (!tag[parent].children) tag[parent].children = [];
      tag[parent].children.push(newItem);
    } else {
      ret[0].push(newItem);
    }
    tag[iPath] = newItem;
  }
  if (enableHeaderNav && ret[0].length > 0) {
    ret[1].push({from: component(dstRootComponent), to: ret[0][0].path});
  }
  getRedirect(ret[0], ret[1]);

  return ret;
}

function toUrl(url) {
  window.location = url;
}

function toRoot() {
  const s = window.location.hash;

  if (s) {
    const pos = s.indexOf('?from=');
    if (pos !== -1) {
      toUrl(`./${s.substr(pos)}`);
      return;
    }
  }
  toUrl('./');
}

function isSameComponent(u) {
  const pos = u.lastIndexOf('?');
  
  if (pos === 0) return false;
  if (pos > 0) {
    const p = u.substr(0, pos);
    return p === current();
  }
  return u === current();
}

function currentComponent() {
  const p = current().split('/');

  return p[p.length - 1];
}

export default {
  blank: 'about:blank',
  queryChanged,
  param,
  component,
  rootComponent,
  isRoot,
  current,
  currentComponent,
  exception,
  isSameComponent,
  toUrl,
  toRoot,
  reload,
  ops,
  defaultUri,
  isPassportComponent,
  isPortalComponent,
  isExceptionComponent,
  getHeaderNav,
  hasSiderBar,
  getMenuData,
  isComponentInTarget,
  getAclsByPath (acls, pathname) {
    if (!pathname) pathname = current().split('/').slice(0, 2).join('/')
    return acls.filter(t => t.path.indexOf(pathname) === 0)
  },
}
