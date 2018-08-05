import React from 'react';
import Exception from '../Exception/index';
import CheckPermissions from './CheckPermissions';
/**
 * 默认不能访问任何页面
 * default is "NULL"
 */
const Exception403 = () => <Exception type="403" style={{ minHeight: 500, height: '80%' }} />;

// Determine whether the incoming component has been instantiated
// AuthorizedRoute is already instantiated
// Authorized  render is already instantiated, children is no instantiated
// Secured is not instantiated
const checkIsInstantiation = target => {
  if (!React.isValidElement(target)) {
    return target;
  }
  return () => target;
};

/**
 * 用于判断是否拥有权限访问此view权限
 * authority 支持传入  string ,funtion:()=>boolean|Promise
 * @param {string | function | Promise} authority
 * @param {ReactNode} error 非必需参数
 */
const authorize = (authority, error) => {
  /**
   * conversion into a class
   * 防止传入字符串时找不到staticContext造成报错
   * String parameters can cause staticContext not found error
   */
  let classError = false;
  if (error) {
    classError = () => error;
  }
  if (!authority) {
    throw new Error('authority is required');
  }
  return function decideAuthority(targer) {
    const component = CheckPermissions(authority, targer, classError || Exception403);
    return checkIsInstantiation(component);
  };
};

export default authorize;
