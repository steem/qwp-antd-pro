import React from 'react';
import config from 'utils/config';
import uri from 'utils/uri';
import PromiseRender from './PromiseRender';

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 Permission judgment type string |array | Promise | Function } authority
 * @param { 你的权限 Your permission description  type:string} currentAuthority
 * @param { 通过的组件 Passing components } target
 * @param { 未通过的组件 no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  if (!currentAuthority) return Exception;
  if (config.isDesktop || currentAuthority.indexOf(config.passportRoot) === 0) {
    return target;
  }
  
  // 没有判定权限.默认不允许查看所有
  if (!authority) {
    return Exception;
  }

  // string 处理
  if (typeof authority === 'string') {
    if (authority === currentAuthority) {
      return target;
    }
    return Exception;
  }

  // Promise 处理
  if (isPromise(authority)) {
    return <PromiseRender ok={target} error={Exception} promise={authority} />;
  }

  // Function 处理
  if (typeof authority === 'function') {
    try {
      const bool = authority(currentAuthority);
      if (bool) {
        return target;
      }
      return Exception;
    } catch (error) {
      throw error;
    }
  }

  for (const p in authority) {
    if (p === currentAuthority) {
      return target;
    }
  }

  return Exception;
};

export { checkPermissions };

const check = (authority, target, Exception) => {
  return checkPermissions(authority, uri.current(), target, Exception);
};

export default check;
