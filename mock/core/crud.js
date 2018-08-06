const Mock = require('mockjs')
const _ = require('lodash')

/* eslint-enable global-require */
const {
  queryArray,
  NOTFOUND,
  INVALID_PARAMS,
  lang,
  P,
} = require('./common');

function createOps (mockTmpl, path = '/', L = {}, tables = {}, formRules = {}) {
  mockTmpl.id = '@id';
  let mockData = Mock.mock({'data|1000-3000': [mockTmpl]}).data;

  return {
    $: {
      success: true,
      data: {
        lang: [
          [path, L[lang]],
        ],
        tables,
        formRules,
      },
    },
    // for getting the created mock data
    _data: mockData,
    get(req, res) {
      const id = P(req, 'id')
      const data = queryArray(mockData, id, 'id')
      if (data) {
        res.status(200).json(data)
      } else {
        res.status(404).json(NOTFOUND)
      }
    },
    create(req, res) {
      const newData = P(req, 'f')

      if (newData) {
        mockData.unshift({
          ...Mock.mock(mockTmpl),
          ...newData,
        })
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
        mockData = mockData.filter((item) => !ids.some(e => e === item.id))
      }
      res.status(200).json({success: true});
    },
    edit(req, res) {
      const id = P(req, 'id')
      const editItem = P(req, 'f')
      let isExist = false

      if (editItem) {
        if (editItem.account) delete editItem.account;
        mockData = mockData.map((item) => {
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
      let newData = mockData;

      if (!page) page = 1;
      for (const key in other) {
        if ({}.hasOwnProperty.call(other, key)) {
          newData = newData.filter((item) => {
            if ({}.hasOwnProperty.call(item, key)) {
              if (key === 'address') {
                return other[key].every(iitem => item[key].indexOf(iitem) > -1)
              } else if (key === 'create_time') {
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
  };
}

module.exports = {
  createOps,
}