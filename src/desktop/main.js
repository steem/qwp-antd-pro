export default {
  settings:{
    default: 'sample',
    enableHeaderNav: true,
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
          href: 'https://github.com/ant-design/ant-design-pro',
        },
        {
          key: 'Ant Design',
          title: 'Ant Design',
          href: 'http://ant.design',
        }
      ],
      copyright: '2018 蚂蚁金服体验技术部出品'
    },
    headerSearcher: {
      placeholder: '站内搜索',
      dataSource: ['搜索提示一', '搜索提示二', '搜索提示三'],
    },
    faq: {
      title: '使用文档',
      link: 'http://pro.ant.design/docs/getting-started'
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
  // 后端代码可用把权限列表保存在数据库，并设计好排序方式，按顺序输出即可控制模块在前端的显示顺序
    acls: [ { name: '结果页', icon: 'check-circle-o', path: '/sample/result' },
      { name: '成功', path: '/sample/result/success' },
      { name: '失败', path: '/sample/result/fail' },
      { name: '异常页', icon: 'warning', path: '/sample/exception' },
      { name: '403', path: '/sample/exception/403' },
      { name: '404', path: '/sample/exception/404' },
      { name: '500', path: '/sample/exception/500' },
    ],
    formRules: {
      "login": {
        "user": {
          "required": true,
          "alphanumeric": true,
          "rangelength": [3, 32],
        },
        "pwd": {
          "required": true,
          "rangelength": [6, 32],
          "password": true,
        },
        "option1": {
          "required": true,
          "rangelength": [2, 3],
        }
      },
      changePassword: {
        pwd1: {
          required: true,
          _msg: 'New password is required',
        },
        pwd2: {
          required: true,
          _msg: 'Password confirmation is required',
        }
      },
    },
  },
  logined: {
    default: 'sample',
    enableHeaderNav: true,
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
          href: 'https://github.com/ant-design/ant-design-pro',
        },
        {
          key: 'Ant Design',
          title: 'Ant Design',
          href: 'http://ant.design',
        }
      ],
      copyright: '2018 蚂蚁金服体验技术部出品'
    },
    userMenu: [
      {
        name: 'user',
        text: '个人中心',
        icon: 'user',
      },
      {
        name: 'setting',
        text: '设置',
      },
      {
        name: 'password',
        text: '修改密码',
      },
      '',
      {
        name: 'logout',
        text: '退出登录',
      }
    ],
    headerSearcher: {
      placeholder: '站内搜索',
      dataSource: ['搜索提示一', '搜索提示二', '搜索提示三'],
    },
    faq: {
      title: '使用文档',
      link: 'http://pro.ant.design/docs/getting-started'
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
  // 后端代码可用把权限列表保存在数据库，并设计好排序方式，按顺序输出即可控制模块在前端的显示顺序
    acls: [ { name: '首页', icon: 'home', path: '/portal' },
      { name: 'test', icon: 'dashboard', path: '/test' },
      { name: '页面示例', icon: 'dashboard', path: '/sample' },
      { name: '系统管理', icon: 'dashboard', path: '/system' },
      { name: '仪表盘', icon: 'dashboard', path: '/sample/dashboard' },
      { name: '监控页', path: '/sample/dashboard/monitor' },
      { name: '工作台', path: '/sample/dashboard/workplace' },
      { name: '表单页', icon: 'form', path: '/sample/form' },
      { name: '基础表单', path: '/sample/form/basic-form' },
      { name: '分步表单', path: '/sample/form/step-form' },
      { path: '/sample/form/step-form/info', page: true },
      { path: '/sample/form/step-form/confirm', page: true },
      { path: '/sample/form/step-form/result', page: true },
      { name: '高级表单', path: '/sample/form/advanced-form' },
      { name: '列表页', icon: 'table', path: '/sample/list' },
      { name: '查询表格', path: '/sample/list/table' },
      { name: '标准列表', path: '/sample/list/basic' },
      { name: '卡片列表', path: '/sample/list/card' },
      { name: '搜索列表', path: '/sample/list/search' },
      { name: '搜索列表（文章）', path: '/sample/list/search/articles' },
      { name: '搜索列表（项目）', path: '/sample/list/search/projects' },
      { name: '搜索列表（应用）', path: '/sample/list/search/applications' },
      { name: '详情页', icon: 'profile', path: '/sample/profile' },
      { name: '基础详情页', path: '/sample/profile/basic' },
      { name: '高级详情页', path: '/sample/profile/advanced' },
      { name: '结果页', icon: 'check-circle-o', path: '/sample/result' },
      { name: '成功', path: '/sample/result/success' },
      { name: '失败', path: '/sample/result/fail' },
      { name: '异常页', icon: 'warning', path: '/sample/exception' },
      { name: '403', path: '/sample/exception/403' },
      { name: '404', path: '/sample/exception/404' },
      { name: '500', path: '/sample/exception/500' },
      { name: '账户管理', icon: 'user', path: '/system/user' },
      { name: '账户', icon: 'user', path: '/system/user/users' },
      { name: '角色', icon: 'user', path: '/system/user/role' },
      { name: '系统设置', icon: 'user', path: '/system/settings' },
      { name: '基础设置', icon: 'user', path: '/system/settings/basic' },
      { name: '功能管理', icon: 'user', path: '/system/settings/features' },
    ],
    formRules: {
    },
  }
};
