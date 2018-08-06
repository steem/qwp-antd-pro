/* eslint-disable no-unused-vars */

const Mock = require('mockjs')
const _ = require('lodash')

/* eslint-enable global-require */
const {
  queryArray,
  NOTFOUND,
  INVALID_PARAMS,
  P,
} = require('../common');
const {
  createOps,
} = require('../crud');

// all you need is to change the data rule and other page settings
const myOps = createOps({
  name: '@name',
  desc: '@string(lower, 6, 12)',
});

module.exports = {
  ops: {
    ...myOps,
    // other ops if need
  },
}
