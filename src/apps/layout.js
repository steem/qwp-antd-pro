import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import GlobalHeader from 'components/GlobalHeader';
import GlobalFooter from 'components/GlobalFooter';
import SiderMenu from 'components/SiderMenu';
import NotFound from 'components/Exception/404';
import Server500Error from 'components/Exception/500';
import { getRoutes } from 'utils/utils';
import AuthorizedRoute from 'components/Authorized/AuthorizedRoute';
import { Scrollbars } from 'react-custom-scrollbars';
import { sizer, elements } from 'utils/layout';
import uri from 'utils/uri';
import config from 'utils/config';
import { l } from 'utils/localization';
import logo from '../assets/logo.svg';

const { Content, Header, Footer } = Layout;

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class AppLayout extends React.Component {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    isMobile,
    height: 100,
    layout: {},
  };

  getChildContext() {
    const { location, routerData, main } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(main.menu, routerData),
    };
  }

  syncConfig() {
    if (!config.layout.changed) return;
    delete config.layout.changed;
    const newLayout = {...config.layout};
  
    const { layout } = this.state;
    
    for (const k in newLayout) {
      if (layout[k] !== newLayout[k]) {
        layout[k] = newLayout[k];
      }
    }
    const height = this.getContentHeight(layout);
    this.setState({
      layout,
      height,
    });
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    sizer.add(this);
    this.timer = setInterval(this.syncConfig.bind(this), 100);
  }

  componentWillUnmount() {
    sizer.remove(this);
    clearInterval(this.timer);
    unenquireScreen(this.enquireHandler);
  }

  onHeaderSearch = value => {

  };

  onHeaderInput = value => {

  };

  onNoticeTabClick = (item, tabProps) => {
    console.log(item, tabProps);
  };

  getContentHeight(layout) {
    const sc = document.getElementById('content-scroll');

    return document.body.clientHeight - ((layout || this.state.layout).noHeader ? 0 : sc.offsetTop);
  }

  updateSize = () => {
    this.setState({
      height: this.getContentHeight(),
    });
  };

  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'main/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleNoticeClear = type => {
    message.success(`${l('clearNotice', type)}`);
    this.props.dispatch({
      type: 'main/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'passport/logout',
      });
    } else if (key === 'login') {
      if (uri.current() !== config.loginPath) {
        this.props.dispatch(routerRedux.push(config.loginPath));
      }
    }
  };

  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'main/fetchNotices',
      });
    }
  };
  render() {
    const {
      collapsed,
      fetchingNotices,
      routerData,
      location,
      main,
    } = this.props;
    const {
      layout,
    } = this.state;
    const otherIcons = [];
    const routers = getRoutes(uri.rootComponent(), routerData);
    const pageContent = (
      <Layout>
        {main.hasSiderBar && (
        <SiderMenu
          logo={logo}
          menuData={main.menu}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse.bind(this)}
          logoText={main.settings.productName}
        />)}
        <Layout>
          { main.hasHeader && !layout.noHeader && (
          <Header style={{ padding: 0 }} ref={n => {this.header = n}}>
            <GlobalHeader
              logo={logo}
              logoText={main.settings.productName}
              hideLogoText={main.hideLogoText}
              main={main}
              fetchingNotices={fetchingNotices}
              notices={main.notices}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear.bind(this)}
              onCollapse={this.handleMenuCollapse.bind(this)}
              onMenuClick={this.handleMenuClick.bind(this)}
              onNoticeVisibleChange={this.handleNoticeVisibleChange.bind(this)}
              hasSiderbar={main.hasSiderBar}
              onHeaderSearch={this.onHeaderSearch.bind(this)}
              onHeaderInput={this.onHeaderInput.bind(this)}
              onNoticeTabClick={this.onNoticeTabClick.bind(this)}
              otherIcons={otherIcons}
            />
          </Header>)}
          <Scrollbars autoHide style={{ width: 'auto', height: this.state.height }} renderThumbVertical={elements.contentScrollbarThumb} id="content-scroll">
            <Content style={{ margin: layout.noMargin ? '0' : '24px 24px 0' }}>
              { main.inited && (
                <Switch>
                  {main.redirect.map(item => (
                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                  ))}
                  {routers.map(item => (
                    <AuthorizedRoute
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                      redirectPath={config.loginPath}
                    />
                  ))}
                  <Redirect exact from="/" to={main.defaultCompnent} />
                  <Route render={NotFound} />
                </Switch>)}
              { main.failed && <Switch><Route render={Server500Error} /></Switch> }
            </Content>
            {!layout.noFooter && (
              <Footer style={{ padding: 0 }}>
                <GlobalFooter
                  links={main.settings.footer.links}
                  copyright={
                    <Fragment>
                      Copyright <Icon type="copyright" /> {main.settings.footer.copyright}
                    </Fragment>
                  }
                />
              </Footer>)}
          </Scrollbars>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={main.settings.productName}>
        <ContainerQuery query={config.screenMediaList}>
          {params => <div className={classNames(params)}>{pageContent}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ main, loading }) => ({
  collapsed: main.collapsed,
  fetchingNotices: loading.effects['main/fetchNotices'],
  main,
}))(AppLayout);
