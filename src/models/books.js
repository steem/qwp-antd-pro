import config from 'utils/config';
import { showOpsNotification } from 'utils/utils';
import { importFormRules } from 'utils/form';
import { toTableData } from 'utils/table';
import * as localization from 'utils/localization';
import * as booksService from 'requests/books';
import { getStorageData } from '../utils/storage';

const { l } = localization;

function* fetchBooks(call, put, payload, noNotice) {
  const response = yield call(booksService.list, payload || config.tablePagination);
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
  namespace: 'books',

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
      const appRes = yield call(booksService.$);

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

    *selectedBooks({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          selectedRows: payload.r,
        },
      });
    },

    *fetch(_, { select, call, put }) {
      const p = yield select(s => s.books.data.pagination);
      yield put({
        type: 'updateState',
        payload: {
          selectedRows: [],
        },
      });
      const params = _.payload || p;
      if (!params.pageSize) params.pageSize = config.tablePagination.pageSize;
      yield call(fetchBooks, call, put, params);
    },

    *remove ({ payload }, { select, call, put }) {
      let ids;

      if (payload && payload.ids) {
        ids = payload.ids;
      } else {
        const objs = yield select(s => s.books.selectedRows);
        ids = objs.map(r => r.id).join(',');
      }
      const data = yield call(booksService.remove, { f: ids });
      if (data) showOpsNotification(data, l('Delete bookss'), l('Bookss are deleted successfully'))
      if (data && data.success) {
        const p = yield select(s => s.books.data.pagination);
        yield call(fetchBooks, call, put, p, true);
      }
    },

    *create ({ payload, callback }, { select, call, put }) {
      const data = yield call(booksService.create, payload)
      if (data) showOpsNotification(data, l('Create books'), l('New books has been created successfully'));
      if (data && data.success) {
        callback();
        const p = yield select(s => s.books.data.pagination);
        yield call(fetchBooks, call, put, p, true);
      }
    },

    *edit ({ payload, callback }, { select, call, put }) {
      const data = yield call(booksService.update, payload)
      if (data) showOpsNotification(data, l('Edit books information'), l('Books information is updated successfully'))
      if (data && data.success) {
        callback();
        const p = yield select(s => s.books.data.pagination);
        yield call(fetchBooks, call, put, p, true);
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
