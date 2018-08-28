import { routerRedux } from 'dva/router';
import { queryNotices } from 'requests/api';
// TODO: upload error code if needed, otherwise delete
import { query } from 'requests/error';
import * as rqPassport from 'requests/passport';
import * as rqApp from 'requests/app';
import config from 'utils/config';
import * as localization from 'utils/localization';
import uri from 'utils/uri';
import { toTableData } from 'utils/table';
import { importFormRules, mergeFormRules, setValidators } from 'utils/form';
import { showOpsNotification, updateConfig } from 'utils/utils';

const { l } = localization;

function localizationAcls(acls) {
  if (!acls) return;
  for (const k in acls) {
    let n = l(k);
    if (n === k) n = l(acls[k].name);
    acls[k].name = n;
  }
}

function addExceptionRouter(acls) {
  acls['/exception'] = {name: 'exception', page: 'true'};
  acls['/exception/403'] = {name: 'exception', page: 'true'};
  acls['/exception/404'] = {name: 'exception', page: 'true'};
  acls['/exception/500'] = {name: 'exception', page: 'true'};
}

function initSettings(settings, put) {
  if (!settings.superApps) settings.superApps = [];
  if (settings.lang) localization.set(settings.lang, put);
  if (settings.validators) setValidators(settings.validators);
  importFormRules(settings);
  if (!settings.productName) settings.productName = l('productName');
}

function applySettings(settings, passport, put) {
  let defaultCompnent = false;

  if (settings.default) defaultCompnent = uri.component(settings.default);
  if (passport) {
    importFormRules(passport);
    mergeFormRules(settings, passport);
    if (passport.lang) localization.set(passport.lang, put);
  } else {
    passport = {};
  }
  let user = false;
  if (passport.user) user = passport.user;
  if (passport.default) defaultCompnent = uri.component(passport.default);
  if (passport.acls) settings.acls = passport.acls;
  if (passport.headerNav) settings.headerNav = passport.headerNav;
  if (passport.userMenu) settings.userMenu = passport.userMenu;
  if (passport.tables) settings.tables = {...settings.tables, ...passport.tables};
  if (settings.userMenu.length === 0 && config.userMenu) {
    if (user && user.isLogined) {
      if (config.userMenu.logined && config.userMenu.logined.length > 0) {
        settings.userMenu = config.userMenu.logined;
      }
    } else if (config.userMenu.default && config.userMenu.default.length > 0) {
      settings.userMenu = config.userMenu.default;
    }
  }
  localizationAcls(settings.acls);
  if (settings.enableHeaderNav && settings.acls) {
    if (settings.headerNav.length === 0) {
      settings.headerNav = uri.getHeaderNav(settings.acls);
    }
  }
  const menuData = uri.getMenuData(settings.acls, settings.enableHeaderNav, settings.headerNav, defaultCompnent);
  if (passport.footer) settings.footer = { ...settings.footer, ...passport.footer };
  if (passport.superApps) settings.superApps = passport.superApps;
  addExceptionRouter(settings.acls);
  defaultCompnent = menuData[2];
  if (!defaultCompnent) defaultCompnent = config.loginPath;

  return {
    defaultCompnent,
    user,
    menu: menuData[0],
    redirect: menuData[1],
    hasSiderBar: !uri.isExceptionComponent() && uri.hasSiderBar(menuData[0]),
    settings,
  };
}

function* checkNavigation(state, put) {
  const p = uri.defaultUri(state.user.isLogined, state.defaultCompnent, state.settings.acls);

  // console.log(`to: ${p}. is login: ${state.user.isLogined} current: ${uri.current()}`);
  if (p === false) return false;
  if (p.startsWith(location.origin)) {
    window.location = p;
    return true;
  } else if (p !== uri.current()) {
    yield put(routerRedux.push(p));
    return true;
  }
}

const defaultState = {
  user: {
    isLogined: false,
  },
  collapsed: false,
  hideLogoText: false,
  notices: [],
  defaultCompnent: config.loginPath,
  menu: [],
  redirect: [],
  hasHeader: true,
  hasSiderBar: false,
  settings: {
    acls: [],
    enableHeaderNav: true,
    superApps: [],
    headerSearcher: false,
    userMenu: [],
    faq: false,
    footer: {
      links: [],
      copyright: '',
    },
    noticeTab: [],
    headerNav: [],
    productName: '',
  },
  topComponent: '/',
  inited: false,
  failed: false,
};

export default {
  namespace: 'main',

  state: {},

  effects: {
    *init ({
      payload,
    }, { call, put, select }) {
      let newState = false;

      yield put({
        type: 'updateState',
        payload: defaultState,
      });
      if (!uri.isRoot()) {
        uri.toRoot();
        return;
      }
      const appRes = yield call(rqApp.$);
      if (!appRes || !appRes.success || !appRes.data) {
        yield put({
          type: 'updateState',
          payload: {
            failed: true,
          },
        });
        return;
      }
      let oldState = yield select(_ => _.main);
      const settings = { ...oldState.settings, ...appRes.data };
      initSettings(settings, put);
      const passportRes = yield call(rqPassport.$, payload);
      oldState = yield select(_ => _.main);
      newState = applySettings(settings, passportRes ? passportRes.data : null, put);
      if (settings.enableHeaderNav) newState.hasHeader = true;
      newState.inited = true;
      newState.failed = !passportRes || !passportRes.success;
      newState.topComponent = uri.rootComponent();
      if (!newState.user) newState.user = oldState.user;
      yield put({
        type: 'updateState',
        payload: newState,
      });
      yield checkNavigation(newState, put);
    },

    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
    },

    *clearNotices({ payload }, { put }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
    },
  
    *navChanged(_, { put, select }) {
      const state = yield select(e => e.main);
      const newState = {
        topComponent: uri.rootComponent(),
      };
      updateConfig({
        noMargin: false,
        noFooter: false,
        noHeader: false,
      });
      if (state.inited) {
        const p = yield checkNavigation(state, put);
        if (p) return;
        const menuData = uri.getMenuData(state.settings.acls,
          state.settings.enableHeaderNav,
          state.settings.headerNav,
          state.defaultCompnent);
        newState.menu = menuData[0];
        newState.redirect = menuData[1];
        newState.hasSiderBar = !uri.isExceptionComponent() && uri.hasSiderBar(menuData[0]);
      }
      yield put({
        type: 'updateState',
        payload: newState,
      });
    },

    *exception({ payload }, { call, put }) {
      // TODO: upload error code if needed, otherwise delete
      yield call(query, payload.code);
      // redirect on client when network broken
      yield put(routerRedux.push(`/exception/${payload.code}`));
    },

  },

  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    saveCurrentUser(state, action) {
      const user = { ...state.user, ...action.payload };
      return {
        ...state,
        user,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'init' });
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        dispatch({ type: 'navChanged' });
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
