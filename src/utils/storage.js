const config = require('./config');

function $key(k) {
  return config.prefix + '-' + k;
}

export function getStorageData(key, d) {
  return localStorage.getItem($key(key)) || d;
}

export function setStorageData(key, value) {
  return localStorage.setItem($key(key), value);
}
