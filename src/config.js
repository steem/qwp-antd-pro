import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
import { getStorageData } from 'utils/storage';
import config from 'utils/config';
import dynamic from 'dva/dynamic';
import { getRouterData } from './router';
import styles from './index.less';

const { ConnectedRouter } = routerRedux;

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function getLocale() {
  const locale = getStorageData('loc', config.locale);
  if (locale === 'zhCN') return zhCN;
  return enUS;
}

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const AppLayout = routerData['/'].component;

  return (
    <LocaleProvider locale={getLocale()}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/" component={AppLayout} />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
