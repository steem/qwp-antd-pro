# QWP-Antd Admin

基于[qwp](https://github.com/steem/qwp)和[ant-design-pro](https://github.com/ant-design/ant-design-pro.git)

## 特性
-   前端和后端共享表单验证代码
-   自动填充前端表单数据
-   前端和后端共享国际化语言文件
-   用户权限控制（开发阶段可按目录自动生成所有权限）
-   前端和后端代码分离，后端services代码可用任意语言编写
-   根据用户权限自动调整页面布局
-   完整的CRUD样例，提供自动生成CRUD页面的脚手架代码并自动生成CRUD的mock service代码
-   提供Notification和用户信息菜单样例
-   对话框高度和宽度自适应
-   通过appSetting设置导航布局以及权限列表等

## 快速开始

克隆项目文件:

    git clone https://github.com/steem/qwp-antd-pro.git

进入目录安装依赖:

    npm i 或者 yarn install

开发：

```bash
npm start
打开 http://localhost:8000
```

构建：

```bash
npm build

将会生成dist目录
```

代码检测：

```bash
npm run lint
```

自动生成代码：

```bash
npm run crud -- --path=system/user/sample --model=sampleModel
```

--model是可选的参数，如果未填，则取path参数的最后一项

自动生成dev模式下的router代码：

```bash
npm run router:php
```

router:java需根据java后端框架自行编写代码来实现


项目部署：

由于路由需要rewrite支持，请参考
[#269](https://github.com/zuiidea/antd-admin/issues/269)

后台service部分也可以通过jsonp方式独立部署
