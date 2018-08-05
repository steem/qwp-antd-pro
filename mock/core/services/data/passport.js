const EnumRoleType = {
  1: 'admin',
  2: 'guest',
  3: 'developer',
}

const adminUsers = [
  {
    id: 0,
    account: 'admin',
    name: 'Admin',
    password: '123Qwe',
    role: EnumRoleType.ADMIN,
    avatar: 'user.png',
    createTime: "2017/08/22 16:15:19",
  }, {
    id: 1,
    account: 'guest',
    name: 'Guest',
    password: 'guest',
    role: EnumRoleType.DEFAULT,
    avatar: 'user.png',
    createTime: "2017/08/22 16:15:19",
  }, {
    id: 2,
    account: '吴彦祖',
    name: '吴彦祖',
    password: '123456',
    role: EnumRoleType.DEVELOPER,
    avatar: 'user.png',
    createTime: "2017/08/22 16:15:19",
  },
]

module.exports = {
  EnumRoleType,
  adminUsers,
}
