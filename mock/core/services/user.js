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
  lang,
  P,
} = require('../common');
let { userData } = require('../common');
const {
  EnumRoleType,
} = require('./data/passport')
let {
  adminUsers,
} = require('./data/passport')

module.exports = {
  ops: {
    '$': (req, res) => {
      const response = {
        success: true,
        data: {
          lang: [
            ['/system/user', L[lang]],
          ],
          tables: {
            "user": {
              "names": [
                ["name", "Name", "10", true, true],
                ["", "Detail", "10", true, 'detail'],
                ["phone", "Phone", "20", true],
                ["email", "Email", "20", true],
                ["address", "Address", "22", true],
                ["create_time", "CreateTime", "20"],
                ["", "", "20", false, "operation"],
              ],
            },
          },
          formRules: {
            user: {
              account: { required: true, rangelength: [5, 32], 'op_edit': 2 },
              pwd: { required: true, password: true, 'op_edit': 0 },
              name: { required: true, rangelength: [6, 64] },
              nick_name: { rangelength: [6, 128] },
              phone: { rangelength: [6, 16], digits: true },
              age: { digits: true, range: [1, 200] },
              email: { email: true, rangelength: [8, 128] },
              address: { rangelength: [6, 128] },
            },
          },
        },
      }
      res.json(response)
    },
    get(req, res) {
      const id = P(req, 'id')
      const data = queryArray(userData, id, 'id')
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).json(NOTFOUND)
      }
    },
    create(req, res) {
      const newData = P(req, 'f')

      if (newData) {
        if (!EnumRoleType[newData.role]) {
          res.status(200).json({success: false})
          return;
        }
        newData.create_time = Mock.mock('@now')
        newData.avatar = newData.avatar || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.nick_name ? newData.nick_name.substr(0, 1) : 'N')
        newData.id = Mock.mock('@id')
        userData.unshift(newData)
        res.status(200).json({success: true})
      } else {
        res.status(404).json(INVALID_PARAMS)
      }
    },
    del(req, res) {
      let ids = P(req, 'f')
      if (ids) {
        if (_.isString(ids)) ids = ids.split(',');
        ids.filter(e => e.id !== 1);
        userData = userData.filter((item) => !ids.some(e => e === item.id))
      }
      res.status(200).json({success: true});
    },
    edit(req, res) {
      const id = P(req, 'id')
      const editItem = P(req, 'f')
      let isExist = false

      if (editItem) {
        if (editItem.account) delete editItem.account;
        userData = userData.map((item) => {
          if (item.id === id) {
            isExist = true
            return Object.assign({}, item, editItem)
          }
          return item
        })
      }
      if (isExist) {
        res.status(200).json({success: true})
      } else {
        res.status(404).json(NOTFOUND)
      }
    },
    list(req, res) {
      const pageSize = P(req, 'pageSize', 10);
      let page = P(req, 'page') || P(req, 'currentPage');
      const other = P(req, 's');
      const sortField = P(req, 'sortField') || P(req, 'sorter');
      const sortOrder = P(req, 'sortOrder') || P(req, 'order');
      let newData = userData;

      if (!page) page = 1;
      for (const key in other) {
        if ({}.hasOwnProperty.call(other, key)) {
          newData = newData.filter((item) => {
            if ({}.hasOwnProperty.call(item, key)) {
              if (key === 'address') {
                return other[key].every(iitem => item[key].indexOf(iitem) > -1)
              } else if (key === 'createTime') {
                const start = new Date(other[key][0]).getTime()
                const end = new Date(other[key][1]).getTime()
                const now = new Date(item[key]).getTime()

                if (start && end) {
                  return now >= start && now <= end
                }
                return true
              }
              return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
            }
            return true
          })
        }
      }
      if (newData.length > 0 && sortField && !_.isUndefined(newData[0][sortField])) {
        const desc = sortOrder === 'desc' || sortOrder === 'descend';
        newData.sort((a, b) => {
          if (a[sortField] === b[sortField]) return 0;
          if (desc) return a[sortField] < b[sortField] ? 1 : -1;
          return a[sortField] < b[sortField] ? -1 : 1;
        })
      }
      res.status(200).json({
        success: true,
        data: {
          data: newData.slice((page - 1) * pageSize, page * pageSize),
          total: newData.length,
          sortOrder,
        },
      })
    },

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
