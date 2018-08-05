import request from 'utils/request';
import uri from 'utils/uri';

const mock = true;
const restfulApi = false;

export async function $ (m = null) {
  return request(uri.ops({ op: '$', m, restfulApi, mock }),{
    method: 'get',
  });
}
