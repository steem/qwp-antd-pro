import { createMockServices } from './core';
import { setupMocks } from './core/mock';

describe('test', () => {
  it('it should ok', async () => {
    const services = {
      get: {
        api: {
          $: {
            currentUser: {
              $desc: '获取当前用户接口',
              $params: {
                pageSize: {
                  desc: '分页',
                  exp: 2,
                },
              },
              $body: {
                name: 'Serati Ma',
                avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                id: '00000001',
              },
            },
          },
        },
      },
    };
    setupMocks(services);
    /* eslint-disable no-console */
    console.log(createMockServices(services));
    /* eslint-enable no-console */
  });
});