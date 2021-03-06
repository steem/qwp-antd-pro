const Mock = require('mockjs')
const _ = require('lodash')
const { NOTFOUND, P } = require('../common')
let { orgData } = require('../common')

module.exports = {
  ops: {
    create (req, res) {
      const newData = req.body
      newData.createTime = Mock.mock('@now')
      newData.id = Mock.mock('@id')
      orgData.unshift(newData)
      res.status(200).end()
    },
    del (req, res) {
      let ids = P(req, 'ids')
      if (ids) {
        if (_.isString(ids)) ids = ids.split(',')
        orgData = orgData.filter((item) => !ids.some(e => e === item.id))
      }
      res.status(204).end()
    },
    edit (req, res) {
      const id = P(req, 'id')
      const editItem = P(req, 'f')
      let isExist = false
      if (editItem) {
        orgData = orgData.map((item) => {
          if (item.id === id) {
            isExist = true
            return Object.assign({}, item, editItem)
          }
          return item
        })
      }
      if (isExist) {
        res.status(201).end()
      } else {
        res.status(404).json(NOTFOUND)
      }
    },
    list (req, res) {
      const pageSize = P(req, 'pageSize', 10)
      const page = P(req, 'page', 1)
      const other = P(req, 's')
      const sortField = P(req, 'sortField')
      const sortOrder = P(req, 'sortOrder')
      let newData = orgData

      for (const key in other) {
        if ({}.hasOwnProperty.call(other, key)) {
          newData = newData.filter((item) => {
            if ({}.hasOwnProperty.call(item, key)) {
              if (key === 'createTime') {
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
        const desc = sortOrder === 'desc' || sortOrder === 'descend'
        newData.sort((a, b) => {
          if (desc) return a[sortField] > b[sortField]
          return b[sortField] > a[sortField]
        })
      }

      res.status(200).json({
        data: newData.slice((page - 1) * pageSize, page * pageSize),
        total: newData.length,
      })
    },
  },
}
