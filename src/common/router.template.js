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
        app.model(require(`../models/${model}`).default);
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
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
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
  let routerConfig = {
    '/': { component: dynamicWrapper(app, ['passport'], () => import('../ui/layout')), },
    '/passport/login': { component: dynamicWrapper(app, ['passport'], () => import('../ui/passport/Login')), },
    '/exception/403': { component: dynamicWrapper(app, [], () => import('../components/Exception/403')), },
    '/exception/404': { component: dynamicWrapper(app, [], () => import('../components/Exception/404')), },
    '/exception/500': { component: dynamicWrapper(app, [], () => import('../components/Exception/500')), },
/* AUTO */
  };
  if (!config.disableRegister) {
    routerConfig['/passport/register'] = {
      component: dynamicWrapper(app, ['passport'], () => import('../ui/passport/Register')),
    };
    routerConfig['/passport/register-result'] = {
      component: dynamicWrapper(app, [], () => import('../ui/passport/RegisterResult')),
    };
  }
  routerConfig.$ = Object.keys(routerConfig);
  routerConfig.$.sort();
  return routerConfig;
};
