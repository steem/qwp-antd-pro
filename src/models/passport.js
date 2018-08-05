import { showOpsNotification } from 'utils/utils';
import uri from 'utils/uri';
import * as rqPassport from 'requests/passport';

export default {
  namespace: 'passport',

  state: {
    list: [],
    status: undefined,
    regStatus: undefined,
    loginType: 'account',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(rqPassport.login, payload);
      if (response) showOpsNotification(response);
      if (response.success) {
        uri.reload();
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: response || {},
        });
      }
    },
    *logout(_, { call, put }) {
      yield call(rqPassport.logout);
      yield put({
        type: 'main/init',
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.message,
        loginType: payload.loginType,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
