import config from 'utils/config';
import { showOpsNotification } from 'utils/utils';
import { importFormRules } from 'utils/form';
import { toTableData } from 'utils/table';
import * as localization from 'utils/localization';
import * as userService from 'requests/user';

const { l } = localization;

function* fetchUsers(call, put, payload, noNotice) {
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
  namespace: 'users',

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

  effects: {

    *init (_, { call, put }) {
      const appRes = yield call(userService.$);

      if (appRes.success && appRes.data) {
        const { lang, ...settings } = appRes.data;
        if (lang) localization.set(lang);
        importFormRules(settings);
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

    *selectedUsers({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          selectedRows: payload.r,
        },
      });
    },

    *fetch(_, { select, call, put }) {
      const p = yield select(s => s.users.data.pagination);
      yield put({
        type: 'updateState',
        payload: {
          selectedRows: [],
        },
      });
      const params = _.payload || p;
      if (!params.pageSize) params.pageSize = config.tablePagination.pageSize;
      yield call(fetchUsers, call, put, params);
    },

    *remove ({ payload }, { select, call, put }) {
      let ids;

      if (payload && payload.ids) {
        ids = payload.ids;
      } else {
        const objs = yield select(s => s.users.selectedRows);
        ids = objs.map(r => r.id).join(',');
      }
      const data = yield call(userService.remove, { f: ids });
      if (data) showOpsNotification(data, l('Delete users'), l('Users are deleted successfully'))
      if (data && data.success) {
        const p = yield select(s => s.users.data.pagination);
        yield call(fetchUsers, call, put, p, true);
      }
    },

    *create ({ payload, callback }, { select, call, put }) {
      const data = yield call(userService.create, payload)
      if (data) showOpsNotification(data, l('Create user'), l('New user has been created successfully'));
      if (data && data.success) {
        if (callback) callback();
        const p = yield select(s => s.users.data.pagination);
        yield call(fetchUsers, call, put, p, true);
      }
    },

    *edit ({ payload, callback }, { select, call, put }) {
      const data = yield call(userService.update, payload)
      if (data) showOpsNotification(data, l('Edit user information'), l('User information is updated successfully'))
      if (data && data.success) {
        if (callback) callback();
        const p = yield select(s => s.users.data.pagination);
        yield call(fetchUsers, call, put, p, true);
      }
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
