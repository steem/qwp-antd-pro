import request from 'utils/request';
import uri from 'utils/uri';

const m = 'passport';
const restfulApi = false;
const mock = true;

export async function login (params) {
  return request({
    url: uri.ops({ op: 'login', restfulApi, m, mock }),
    method: 'post',
    body: params,
  })
}

export async function logout () {
  return request({
    url: uri.ops({ op: 'logout', restfulApi, m, mock }),
    method: 'get',
  })
}

export async function changePassword (params) {
  return request({
    url: uri.ops({ op: 'pwd', restfulApi, m: 'user', mock }),
    method: 'post',
    body: params,
  })
}

export async function $ (params) {
  return request({
    url: uri.ops({ op: '$', restfulApi, m, mock }),
    method: 'get',
    body: params,
  })
}
