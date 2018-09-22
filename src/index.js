import './polyfill';

import dva from 'dva';

import createHistory from 'history/createHashHistory';
// use BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';

import './index.less';
// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
app.use(createLoading());

// 3. Register main model
app.model(require('./models/main').default);
app.model(require('./models/passport').default);

// 4. Router
app.router(require('./config').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
