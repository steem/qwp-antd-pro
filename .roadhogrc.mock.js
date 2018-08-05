import mockjs from 'mockjs';
import { createMockServices } from './mock/core';
import { setupMocks } from './mock/core/mock';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
let proxy = {
  get: {
    api: {
      $: {
        'project/notice': getNotice,
        activities: getActivities,
        rule: getRule,
        tags: mockjs.mock({
          'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
        }),
        fake_list: getFakeList,
        fake_chart_data: getFakeChartData,
        'profile/basic': getProfileBasicData,
        'profile/advanced': getProfileAdvancedData,
        notices: getNotices,
        500: (req, res) => {
          res.status(500).send({
            timestamp: 1513932555104,
            status: 500,
            error: 'error',
            message: 'error',
            path: '/base/category/list',
          });
        },
        404: (req, res) => {
          res.status(404).send({
            timestamp: 1513932643431,
            status: 404,
            error: 'Not Found',
            message: 'No message available',
            path: '/base/category/list/2121212',
          });
        },
        403: (req, res) => {
          res.status(403).send({
            timestamp: 1513932555104,
            status: 403,
            error: 'Unauthorized',
            message: 'Unauthorized',
            path: '/base/category/list',
          });
        },
        401: (req, res) => {
          res.status(401).send({
            timestamp: 1513932555104,
            status: 401,
            error: 'Unauthorized',
            message: 'Unauthorized',
            path: '/base/category/list',
          });
        },
      }
    }
  },
  post: {
    api: {
      $: {
        rule: {
          $params: {
            pageSize: {
              desc: '分页',
              exp: 2,
            },
          },
          $body: postRule,
        },
        forms: (req, res) => {
          res.send({ message: 'Ok' });
        },
        register: (req, res) => {
          res.send({ status: 'ok', currentAuthority: 'user' });
        },
      }
    }
  }
};

setupMocks(proxy);

export default (noProxy ? {} : delay(createMockServices(proxy), 1000));
