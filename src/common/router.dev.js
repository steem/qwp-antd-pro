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
    '/': {
      component: dynamicWrapper(app, ['passport'], () => import('../ui/layout')),
    },
    '/passport/login': {
      component: dynamicWrapper(app, ['passport'], () => import('../ui/Passport/Login')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../components/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../components/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../components/Exception/500')),
    },
    '/portal': {
      component: dynamicWrapper(app, ['chart'], () => import('../ui/Portal')),
    },
    '/sample/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../ui/Dashboard/Monitor')),
    },
    '/sample/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../ui/Dashboard/Workplace')
      ),
    },
    '/sample/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../ui/Forms/BasicForm')),
    },
    '/sample/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../ui/Forms/StepForm')),
    },
    '/sample/form/step-form/info': {
      component: dynamicWrapper(app, ['form'], () => import('../ui/Forms/StepForm/Step1')),
    },
    '/sample/form/step-form/confirm': {
      component: dynamicWrapper(app, ['form'], () => import('../ui/Forms/StepForm/Step2')),
    },
    '/sample/form/step-form/result': {
      component: dynamicWrapper(app, ['form'], () => import('../ui/Forms/StepForm/Step3')),
    },
    '/sample/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../ui/Forms/AdvancedForm')),
    },
    '/sample/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../ui/List/TableList')),
    },
    '/sample/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../ui/List/BasicList')),
    },
    '/sample/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../ui/List/CardList')),
    },
    '/sample/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../ui/List/List')),
    },
    '/sample/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../ui/List/Projects')),
    },
    '/sample/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../ui/List/Applications')),
    },
    '/sample/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../ui/List/Articles')),
    },
    '/sample/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../ui/Profile/BasicProfile')),
    },
    '/sample/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../ui/Profile/AdvancedProfile')
      ),
    },
    '/sample/result/success': {
      component: dynamicWrapper(app, [], () => import('../ui/Result/Success')),
    },
    '/sample/result/fail': {
      component: dynamicWrapper(app, [], () => import('../ui/Result/Error')),
    },
    '/sample/exception/403': {
      component: dynamicWrapper(app, [], () => import('../components/Exception/403')),
    },
    '/sample/exception/404': {
      component: dynamicWrapper(app, [], () => import('../components/Exception/404')),
    },
    '/sample/exception/500': {
      component: dynamicWrapper(app, [], () => import('../components/Exception/500')),
    },
  };
  if (!config.disableRegister) {
    routerConfig['/passport/register'] = {
      component: dynamicWrapper(app, ['passport'], () => import('../ui/Passport/Register')),
    };
    routerConfig['/passport/register-result'] = {
      component: dynamicWrapper(app, [], () => import('../ui/Passport/RegisterResult')),
    };
  }
  routerConfig.$ = Object.keys(routerConfig);
  routerConfig.$.sort();
  return routerConfig;
};
