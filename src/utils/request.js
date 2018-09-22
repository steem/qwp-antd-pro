import fetch from 'dva/fetch';
import _ from 'lodash';
import { showOpsNotification, showErrorMessage } from './utils';
import uri from './uri';
import { l } from './localization';
import store from '../index';

const codeMessage = {
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function throwError(txt, name, res) {
  const error = new Error(txt);
  error.name = name;
  error.response = res;
  throw error;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throwError(response.status, codeMessage[response.status] || response.statusText, response);
}

function showError(e) {
  if (e.name === -1) {
    showErrorMessage(e.response && e.response.message ? e.response.message : l('Please login'));
    store.dispatch({
      type: 'main/init',
    });
    return;
  }
  showOpsNotification({
    success: false,
    message: l('Request failed, the reason is: {0}', l(e.message)),
  });
}

function createFormData(data, parent) {
  let r = '';
  let sep = '';

  for (const k in data) {
    const kk = parent ? `${parent}[${k}]` : k;
    if (_.isObject(data[k])) {
      r += sep + createFormData(data[k], kk);
    } else {
      r += `${sep}${kk}=${encodeURIComponent(data[k])}`;
    }
    if (!sep) sep = '&';
  }
  return r;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  let newOptions;
  let dstUrl;

  if (typeof(url) !== 'string') {
    newOptions = { ...defaultOptions, ...url };
    dstUrl = newOptions.url;
    delete newOptions.url;
  } else {
    dstUrl = url;
    newOptions = { ...defaultOptions, ...options };
  }

  const data = newOptions.body || newOptions.data;
  let method = newOptions.method ? newOptions.method.toUpperCase() : false;

  if (data && method !== 'POST' && method !== 'PUT') method = 'POST';
  if (data && (method === 'POST' || method === 'PUT')) {
    if (newOptions.json) {
      newOptions.headers = {
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(data);
    } else if (!(data instanceof FormData)) {
      newOptions.headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = createFormData(data, '');
    }
  }

  return fetch(dstUrl, newOptions)
    .then(checkStatus)
    .then(response => {
      if (response.headers.get('Content-Type').toLowerCase().indexOf('application/json') >= 0) {
        return response.json();
      }
      return response.text();
    })
    .then(ret => {
      if (ret && ret.data && ret.data.toLogin) {
        throwError('', -1, ret);
      }
      return ret;
    })
    .catch(showError);
}

