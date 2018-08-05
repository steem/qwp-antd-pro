import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import config from 'utils/config';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`./models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`./models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

export const getRouterData = app => {
  const routerConfig = {
    '/': { component: dynamicWrapper(app, ['passport'], () => import('./apps/layout')) },
    '/passport/login': { component: dynamicWrapper(app, ['passport'], () => import('./apps/passport/Login')) },
    '/exception/403': { component: dynamicWrapper(app, [], () => import('./components/Exception/403')) },
    '/exception/404': { component: dynamicWrapper(app, [], () => import('./components/Exception/404')) },
    '/exception/500': { component: dynamicWrapper(app, [], () => import('./components/Exception/500')) },
    '/portal': { component: dynamicWrapper(app, ['chart'], () => import('./apps/portal/')) },
    '/sample/dashboard/workplace': { component: dynamicWrapper(app, ['project','activities','chart'], () => import('./apps/sample/dashboard/workplace')) },
    '/sample/dashboard/monitor': { component: dynamicWrapper(app, ['monitor'], () => import('./apps/sample/dashboard/monitor')) },
    '/sample/exception/403': { component: dynamicWrapper(app, [], () => import('./components/Exception/403')) },
    '/sample/exception/404': { component: dynamicWrapper(app, [], () => import('./components/Exception/404')) },
    '/sample/exception/500': { component: dynamicWrapper(app, [], () => import('./components/Exception/500')) },
    '/sample/form/basic-form': { component: dynamicWrapper(app, ['form'], () => import('./apps/sample/form/BasicForm')) },
    '/sample/form/step-form': { component: dynamicWrapper(app, ['form'], () => import('./apps/sample/form/step-form')) },
    '/sample/form/advanced-form': { component: dynamicWrapper(app, ['form'], () => import('./apps/sample/form/AdvancedForm')) },
    '/sample/form/step-form/info': { component: dynamicWrapper(app, ['form'], () => import('./apps/sample/form/step-form/Step1')) },
    '/sample/form/step-form/confirm': { component: dynamicWrapper(app, ['form'], () => import('./apps/sample/form/step-form/Step2')) },
    '/sample/form/step-form/result': { component: dynamicWrapper(app, ['form'], () => import('./apps/sample/form/step-form/Step3')) },
    '/sample/list/table': { component: dynamicWrapper(app, ['rule'], () => import('./apps/sample/list/table')) },
    '/sample/list/basic': { component: dynamicWrapper(app, ['list'], () => import('./apps/sample/list/basic')) },
    '/sample/list/card': { component: dynamicWrapper(app, ['list'], () => import('./apps/sample/list/card')) },
    '/sample/list/search/applications': { component: dynamicWrapper(app, ['list'], () => import('./apps/sample/list/search/applications')) },
    '/sample/list/search/articles': { component: dynamicWrapper(app, ['list'], () => import('./apps/sample/list/search/articles')) },
    '/sample/list/search/projects': { component: dynamicWrapper(app, ['list'], () => import('./apps/sample/list/search/projects')) },
    '/sample/profile/advanced': { component: dynamicWrapper(app, ['profile'], () => import('./apps/sample/profile/advanced')) },
    '/sample/profile/basic': { component: dynamicWrapper(app, ['profile'], () => import('./apps/sample/profile/basic')) },
    '/sample/result/fail': { component: dynamicWrapper(app, [], () => import('./apps/sample/result/error')) },
    '/sample/result/success': { component: dynamicWrapper(app, [], () => import('./apps/sample/result/success')) },
    '/system/settings/basic': { component: dynamicWrapper(app, ['basic'], () => import('./apps/system/settings/basic')) },
    '/system/settings/features': { component: dynamicWrapper(app, ['features'], () => import('./apps/system/settings/features')) },
    '/system/user/users': { component: dynamicWrapper(app, ['users'], () => import('./apps/system/user/users')) },
    '/system/user/role': { component: dynamicWrapper(app, ['role'], () => import('./apps/system/user/role')) },
    '/test': { component: dynamicWrapper(app, [], () => import('./apps/test/')) },

  };
  if (!config.disableRegister) {
    routerConfig['/passport/register'] = {
      component: dynamicWrapper(app, ['passport'], () => import('./apps/passport/Register')),
    };
    routerConfig['/passport/register-result'] = {
      component: dynamicWrapper(app, [], () => import('./apps/passport/RegisterResult')),
    };
  }
  routerConfig.$ = Object.keys(routerConfig);
  routerConfig.$.sort();
  return routerConfig;
};
