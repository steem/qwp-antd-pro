const Mock = require('mockjs')
const _ = require('lodash')

/* eslint-enable global-require */
const {
  P,
} = require('../common');

const userData = Mock.mock({
  'data|1000-3000': [{
      name: '@string(lower, 6, 12)',
      desc: '@string(lower, 6, 12)',
    },
  ],
});

export function getUserData(req, res) {
  const pageSize = P(req, 'pageSize', 10);
  let page = P(req, 'page') || P(req, 'currentPage');
  // const other = P(req, 's');
  const sortField = P(req, 'sortField') || P(req, 'sorter');
  const sortOrder = P(req, 'sortOrder') || P(req, 'order');
  const newData = userData.data;

  if (!page) page = 1;
  // for (const key in other) {
  //   if ({}.hasOwnProperty.call(other, key)) {
  //     newData = newData.filter((item) => {
  //       if ({}.hasOwnProperty.call(item, key)) {
  //         if (key === 'address') {
  //           return other[key].every(iitem => item[key].indexOf(iitem) > -1)
  //         } else if (key === 'createTime') {
  //           const start = new Date(other[key][0]).getTime()
  //           const end = new Date(other[key][1]).getTime()
  //           const now = new Date(item[key]).getTime()

  //           if (start && end) {
  //             return now >= start && now <= end
  //           }
  //           return true
  //         }
  //         return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
  //       }
  //       return true
  //     })
  //   }
  // }
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
}

module.exports = {
  ops: {
    $: {
      success: true,
      data: {
        tables: {
          "user": {
            "names": [
              ["name", "名称", "10", true],
              ["desc", "描述", "15", true],
            ],
          },
        },
        formRules: {
          user: {
            name: { required: true, rangelength: [5, 32] },
            desc: { required: false, rangelength: [5, 256] },
          },
        },
      },
    },
    list: getUserData,
  },
}
