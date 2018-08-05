const pppp = '/'.split('/');
console.log(pppp)
const menuData = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '分析页',
        path: 'analysis',
      },
      {
        name: '监控页',
        path: 'monitor',
      },
      {
        name: '工作台',
        path: 'workplace',
      },
    ],
  },
  {
    name: '表单页',
    icon: 'form',
    path: 'form',
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
      },
      {
        name: '分步表单',
        path: 'step-form',
      },
      {
        name: '高级表单',
        path: 'advanced-form',
      },
    ],
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '查询表格',
        path: 'table-list',
      },
      {
        name: '标准列表',
        path: 'basic-list',
      },
      {
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表',
        path: 'search',
        children: [
          {
            name: '搜索列表（文章）',
            path: 'articles',
          },
          {
            name: '搜索列表（项目）',
            path: 'projects',
          },
          {
            name: '搜索列表（应用）',
            path: 'applications',
          },
        ],
      },
    ],
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    children: [
      {
        name: '基础详情页',
        path: 'basic',
      },
      {
        name: '高级详情页',
        path: 'advanced',
      },
    ],
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: '成功',
        path: 'success',
      },
      {
        name: '失败',
        path: 'fail',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

let results = [];

function getMenu(m, p) {
  for (let i = 0, cnt = m.length; i < cnt; ++i) {
    let item = m[i];
    let newItem = {};
    if (item.name) newItem.name = item.name;
    if (item.icon) newItem.icon = item.icon;
    if (item.path) newItem.path = item.path;
    newItem.path = p + item.path;
    results.push(newItem);
    if (item.children) getMenu(item.children, newItem.path + '/');
  }
}
getMenu(menuData, '/');
console.log(results);

function convertMenu() {
/*
  let acls = [ { name: '首页', icon: 'home', path: '/portal' },
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
    ];
*/
    const acls = [{
      "name": "dashboard",
      "path": "/dashboard",
    }, {
      "name": "portal",
      "path": "/portal",
    }, {
      "name": "test",
      "path": "/test",
    }];
    const newAcls = {};
    for (let k = 0, cnt = acls.length; k < cnt; ++k) {
      const acl = acls[k];
      const path = acl.path;
      delete acl.path;
      newAcls[path] = acl;
    }
    console.log(newAcls);
}
convertMenu();

let ds = [
  {
    name: 'abc',
  },
  {
    name: 'cba',
  }
];

ds.sort(function(a, b){
  if (a.name == b.name) return 0;
  return a.name < b.name ? 1 : -1;
});
console.log(ds);

ds = {"user":{"account":{"required":true,"rangelength":[6,32]},"name":{"required":true,"rangelength":[6,64]},"nick_name":{"rangelength":[6,128]},"phone":{"rangelength":[6,16],"digits":true},"age":{"digits":true,"range":[1,200]},"email":{"email":true,"rangelength":[8,128]},"address":{"rangelength":[6,128]}}};
console.log(ds);
