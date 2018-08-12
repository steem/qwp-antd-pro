const { lang } = require('./common');

/* eslint-disable global-require */
const L = {
  enUS: require('./services/data/lang/enUS/global'),
  zhCN: require('./services/data/lang/zhCN/global'),
}
/* eslint-enable global-require */
const acls = require('./services/data/acls_not_login')

const settings = {
  success: true,
  data: {
    default: '/portal',
    enableHeaderNav: true,
    lang: [
      ['/', L[lang]],
    ],
    validators: {"digits":"^\\d+$","letters":"^([a-z]|[A-Z])+$","alphanumeric":"^[\\w|-]+$","alphanumeric_ex":"^[\\w|-|\\.]+$","url":["^(https?|ftp):\\/\\/[^\\s\\/\\$.?#].[^\\s]*$","i"],"password":[["^(\\w|\\d|@|!)+$","\\d","[a-z]","[A-Z]"],["","","i","i"]],"email":"^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$","number":"^(?:-?\\d+|-?\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$","ipv4":"^(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$","ipv6":"^(?:-?\\d+|-?\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$","datehour":"^\\d\\d\\d\\d-\\d\\d-\\d\\d \\d\\d:\\d\\d$","datetime":"^\\d\\d\\d\\d-\\d\\d-\\d\\d \\d\\d:\\d\\d:\\d\\d$","date":"^\\d\\d\\d\\d-\\d\\d-\\d\\d$","joined_digits":"^\\d+[\\d|,]*$","base64":"^[A-Za-z0-9\\+\\/=]+$","hex":"^[A-E0-9]+$"},
    footer: {
      links: [
        {
          key: 'Pro 首页',
          title: 'Pro 首页',
          href: 'http://pro.ant.design',
        },
        {
          key: 'github',
          icon: 'github',
          href: 'https://github.com/steem/qwp-antd-pro',
        },
        {
          key: 'Ant Design',
          title: 'Ant Design',
          href: 'http://ant.design',
        },
      ],
      copyright: '2018 QWP, INC.',
    },
    headerSearcher: {
      placeholder: '站内搜索',
      dataSource: ['搜索提示一', '搜索提示二', '搜索提示三'],
    },
    faq: {
      title: '使用文档',
      link: 'http://pro.ant.design/docs/getting-started',
    },
    noticeTab: [{
      type: 'info',
      text: '通知',
      emptyText: '你已查看所有通知',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
    },{
      type: 'message',
      text: '消息',
      emptyText: '您已读完所有消息',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
    },{
      type: 'todo',
      text: '待办',
      emptyText: '你已完成所有待办',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
    }],
    acls,
  },
};

module.exports = {
  settings,
}