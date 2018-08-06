/* eslint-disable no-unused-vars */

const Mock = require('mockjs')
const _ = require('lodash')

/* eslint-disable global-require */
const L = {
  enUS: require('./data/lang/enUS/user'),
  zhCN: require('./data/lang/zhCN/user'),
}
/* eslint-enable global-require */
const {
  queryArray,
  NOTFOUND,
  INVALID_PARAMS,
  orgData,
  P,
} = require('../common');
const {
  createOps,
} = require('../crud');
let {
  adminUsers,
} = require('./data/passport')

const myOps = createOps({
  name: '@name',
  account: '@string(lower, 6, 12)',
  nick_name: '@last',
  role: "@pick(['1', '2'])",
  phone: /^1[34578]\d{9}$/,
  'age|11-99': 1,
  address: '@county(true)',
  'gender|1': ['m', 'f'],
  email: '@email',
  create_time: '@datetime',
  password: '@string(6, 10)',
  org() {
    return orgData[Mock.Random.integer(0, orgData.length - 1)].id
  },
}, '/system/user', L, {
  user: {
    names: [
      ["name", "Name", "10", true, true],
      ["", "Detail", "10", true, 'detail'],
      ["phone", "Phone", "20", true],
      ["email", "Email", "20", true],
      ["address", "Address", "22", true],
      ["create_time", "CreateTime", "20"],
      ["", "", "20", false, "operation"],
    ],
  },
}, {
  user: {
    id: { required: true, rangelength: [6, 32], op: 'edit', ui: false },
    account: { required: true, rangelength: [5, 32], 'op_edit': 2 },
    pwd: { required: true, password: true, 'op_edit': 0 },
    name: { required: true, rangelength: [6, 64] },
    nick_name: { rangelength: [6, 128] },
    phone: { rangelength: [6, 16], digits: true },
    age: { digits: true, range: [1, 200] },
    email: { email: true, rangelength: [8, 128] },
    address: { rangelength: [6, 128] },
  },
});

module.exports = {
  ops: {
    ...myOps,

    pwd(req, res) {
      const editItem = P(req, 'f')
      let isExist = false

      if (editItem) {
        adminUsers = adminUsers.map((item) => {
          if (item.id === editItem.id) {
            isExist = true
            return Object.assign({}, item, {
              password: editItem.pwd1,
            })
          }
          return item
        })
      }
      const data = {
        success: isExist,
      }
      if (!isExist) data.message = 'Wrong parameters'
      res.status(200).json(data)
    },
  },
}
