module.exports = {
  prefix: 'qwpantd',
  logo: '/logo.png',
  inDebug: true,
  restfulApi: true,
  mockServicePrefix: '/_mock',
  servicePrefix: './antd/services',
  useMockSerivce: false,
  routeUriPrefix: '/',
  passportRoot: '/passport',
  loginPath: '/passport/login',
  portalRoot: '/portal',
  isDesktop: false,
  locale: 'zhCN',
  disableRegister: true,
  showHeaderItemsWhenNotLogin: false,
  colors: {
    siderScrollbarThumber: 'rgb(123, 225, 248)',
    contentScrollbarThumber: 'rgb(160, 153, 153)',
  },
  screenMediaList: {
    'screen-xs': {
      maxWidth: 575,
    },
    'screen-sm': {
      minWidth: 576,
      maxWidth: 767,
    },
    'screen-md': {
      minWidth: 768,
      maxWidth: 991,
    },
    'screen-lg': {
      minWidth: 992,
      maxWidth: 1199,
    },
    'screen-xl': {
      minWidth: 1200,
    },
  },
  layout: {},
  tablePagination: {
    currentPage: 1,
    pageSize: 30,
    defaultPageSize: 30,
    pageSizeOptions:['10', '30', '50', '100'],
  },
  userMenu: {
    logined: [
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
      },
    ],
    default: [
      {
        name: 'login',
        text: '登录',
      },
    ],
  },
};
