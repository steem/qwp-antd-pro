const qs = require('qs');
const Mock = require('mockjs');
const _ = require('lodash');
const {
  adminUsers,
} = require('./data/passport')
const {
  lang,
  inDebug,
  PB,
} = require('../common.js')
/* eslint-disable global-require */
const L = {
  enUS: require('./data/lang/enUS/passport'),
  zhCN: require('./data/lang/zhCN/passport'),
};
/* eslint-enable global-require */
// 后端代码可用把权限列表保存在数据库，并设计好排序方式，按顺序输出即可控制模块在前端的显示顺序
const acls = require('./data/acls')

const defaultComponent = 'portal';
const defaultUser = {
  name: 'Guest',
  avatar: 'avatar.png',
  isLogined: false,
};
const defaultUserMenu = [
  {
    name: 'login',
    text: '登录',
  },
];
const userMenuAfterLogin = [
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
    icon: 'key',
  },
  '',
  {
    name: 'logout',
    text: '退出登录',
  },
];
const tables = {
};
const tokenToUser = {};

module.exports = {
  ops: {
    '$': (req, res) => {
      const cookie = req.headers.cookie || ''
      const cookies = qs.parse(cookie.replace(/\s/g, ''), {
        delimiter: ';',
      })
      const response = {
        success: true,
        data: {
          lang: [
            ['/', L[lang]],
          ],
/*
          后台代码可利用此项来控制header导航条，默认前端自动选择所有一级权限作为headerNav
          headerNav: [{
            name: 'portal',
            icon: 'laptop',
            path: '/portal',
          },{
            name: 'dashboard',
            icon: 'laptop',
            path: '/dashboard',
          },{
            name: 'sample',
            icon: 'laptop',
            path: '/sample',
          }, {
            name: 'system',
            icon: 'laptop',
            path: '/system',
          }],
*/
          formRules: {
            login: {
              user: {
                "required": true,
                "alphanumeric": true,
                "rangelength": [3, 32],
              },
              pwd: {
                "required": true,
                "rangelength": [6, 32],
                "password": true,
              },
              option1: {
                "required": true,
                "rangelength": [2, 3],
              },
            },
            changePassword: {
              pwd1: {
                required: true,
                _msg: 'New password is required',
              },
              pwd2: {
                required: true,
                _msg: 'Password confirmation is required',
              },
            },
          },
        },
      }
      let aUser = false;
      if (inDebug()) {
        aUser = {
          ...adminUsers[0],
        };
      } else if (cookies.token) {
        const token = JSON.parse(cookies.token);

        if (token && token.id && token.deadline > new Date().getTime()) {
          const userId = tokenToUser[token.id];
          if (!_.isUndefined(userId)) {
            aUser = adminUsers.filter((item) => userId === item.id);
            if (aUser.length > 0) {
              aUser = {...aUser[0]};
            }
          }
        }
      }
      if (aUser) {
        delete aUser.password;
        response.data.user = {...aUser};
        response.data.user.isLogined = true;
        response.data.userMenu = userMenuAfterLogin;
        response.data.acls = acls;
        response.data.default = defaultComponent;
        response.data.tables = tables;
      } else {
        response.data.userMenu = defaultUserMenu;
        response.data.user = defaultUser;
      }
      // response.tokenStr = cookies.token;
      // response.tokenToUser = tokenToUser;
      // response.token = cookies.token ? JSON.parse(cookies.token) : '';
      res.status(200).json(response);
    },
    login (req, res) {
      const loginData = PB(req, 'f')
      const result = {
        success: false,
        message: 'Invalid parameters',
      }
      if (!loginData) {
        res.json(result)
        return
      }
      result.message = 'Failed to login';
      const {
        user,
        pwd,
        type,
      } = loginData
      result.loginType = type;
      let aUser
      aUser = adminUsers.filter((item) => item.account === user && item.password === pwd)
      if (aUser) {
        if (aUser.length > 0) {
          aUser = {...aUser[0]};
          delete aUser.password;
        } else {
          aUser = false
        }
        const now = new Date()
        now.setDate(now.getDate() + 1);
        const token = Mock.Random.string(16);
        tokenToUser[token] = aUser.id;
        res.cookie('token', JSON.stringify({
          id: token,
          deadline: now.getTime(),
        }), {
          maxAge: 900000,
          httpOnly: true,
        })
        result.success = true
        result.message = 'Login successfully'
      }
      res.status(200).json(result)
    },
    logout (req, res) {
      res.clearCookie('token')
      res.status(200).json({
        success: true,
        message: 'Logout successfully',
      }).end()
    },
  },
}
