import config from 'utils/config';
import { showOpsNotification } from 'utils/utils';
import { importFormRules } from 'utils/form';
import { toTableData } from 'utils/table';
import * as localization from 'utils/localization';
import * as userService from 'requests/user';

const { l } = localization;

function* fetchUser(call, put, payload, noNotice) {
  const response = yield call(userService.list, payload || config.tablePagination);
  if (response && response.success) {
    yield put({
      type: 'updateState',
      payload: toTableData(response, payload || config.tablePagination),
    });
  } else if (response && !noNotice) {
    showOpsNotification(response);
  }
}

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {...config.tablePagination},
    },
    settings: {
      tables: {},
    },
    selectedRows: [],
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'init' });
    },
  },

  effects: {

    *init (_, { call, put }) {
      const appRes = yield call(userService.$);

      if (appRes.success && appRes.data) {
        const { lang, ...settings } = appRes.data
        importFormRules(settings);
        if (lang) localization.set(lang, put);
        yield put({
          type: 'updateState',
          payload: {
            settings,
          },
        });
      } else if (appRes) {
        showOpsNotification(appRes);
      }
    },

    *selectedUser({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          selectedRows: payload.r,
        },
      });
    },

    *fetch(_, { select, call, put }) {
      const p = yield select(s => s.user.data.pagination);
      yield put({
        type: 'updateState',
        payload: {
          selectedRows: [],
        },
      });
      const params = _.payload || p;
      if (!params.pageSize) params.pageSize = config.tablePagination.pageSize;
      yield call(fetchUser, call, put, params);
    },

  },

  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

  },
};
