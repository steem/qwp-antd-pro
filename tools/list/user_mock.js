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

const routerPath = '/';
const L = {};

// all you need is to change the data rule and other page settings
const myOps = createOps({
  name: '@name',
  description: '@string(lower, 6, 12)',
  create_time: '@datetime',
}, routerPath, L, {
  user: {
    names: [
      ["name", "Name", "10", true],
      ["create_time", "Time", "30", true],
      ["description", "Description", "30"],
      ["", "", "20", false, "operation"],
    ],
  },
}, {
  search: {
    name: { rangelength: [1, 256] },
    description: { rangelength: [1, 256] },
    create_time: { date: true },
  },
}, {
  create_time: (item, filter) => {
    const filterTime = new Date(filter).getTime();
    const itemTime = new Date(item).getTime();

    if (filterTime) {
      return itemTime >= filterTime;
    }
    return true;
  },
});

module.exports = {
  ops: {
    ...myOps,
    // other ops if need
  },
}
