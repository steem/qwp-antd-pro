import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { Link } from 'dva/router';
import { Scrollbars } from 'react-custom-scrollbars';
import { sizer, elements } from 'utils/layout';
import styles from './index.less';
import { urlToList } from '../_utils/pathTools';

const { Sider } = Layout;
const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
  menu
    .reduce((keys, item) => {
      keys.push(item.path);
      if (item.children) {
        return keys.concat(getFlatMenuKeys(item.children));
      }
      return keys;
    }, []);

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths
    .reduce((matchKeys, path) => (
      matchKeys.concat(
        flatMenuKeys.filter(item => pathToRegexp(item).test(path))
    )), []);

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    const flatMenuKeys = getFlatMenuKeys(props.menuData);
    this.state = {
      menus: props.menuData,
      flatMenuKeys,
      openKeys: this.getDefaultCollapsedSubMenus(props, flatMenuKeys),
      height: 100,
    };
  }

  componentDidMount() {
    sizer.add(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.menuData !== this.props.menuData) {
      const flatMenuKeys = getFlatMenuKeys(nextProps.menuData);
      this.setState({
        menus: nextProps.menuData,
        flatMenuKeys,
        openKeys: this.getDefaultCollapsedSubMenus(nextProps, flatMenuKeys),
      });
    }
  }

  componentWillUnmount() {
    sizer.remove(this);
  }

  /**
   * Convert pathname to openKeys
   * /list/search/articles = > ['list','/list/search']
   * @param  props
   */
  getDefaultCollapsedSubMenus(props, flatMenuKeys) {
    const { location: { pathname } } = props || this.props;
    return getMenuMatchKeys(flatMenuKeys, urlToList(pathname));
  }

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={
          this.props.isMobile
            ? () => {
                this.props.onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
    }
  };

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = () => {
    const { location: { pathname } } = this.props;
    return getMenuMatchKeys(this.state.flatMenuKeys, urlToList(pathname));
  };

  updateSize = () => {
    this.setState({
      height: document.body.clientHeight - this.logo.offsetHeight - 1,
    });
  }

  // conversion Path
  // 转化路径
  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  };

  isMainMenu = key => {
    return this.state.menus.some(item => key && (item.key === key || item.path === key));
  };

  handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
    });
  };

  render() {
    const { logo, collapsed, onCollapse, logoText } = this.props;
    const { openKeys } = this.state;
    
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed
      ? {}
      : {
          openKeys,
        };
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={256}
        className={styles.sider}
      >
        <div className={styles.logo} key="logo" ref={n => {this.logo = n}}>
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>{logoText}</h1>
          </Link>
        </div>
        <Scrollbars
          autoHide
          style={{ width: 'auto', height: this.state.height }}
          id="content-scroll"
          renderThumbVertical={elements.siderScrollbarThumb}
        >
          <Menu
            id="sider-menu"
            key="Menu"
            theme="dark"
            mode="inline"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={selectedKeys}
            style={{ padding: '16px 0', width: '100%' }}
          >
            {this.getNavMenuItems(this.state.menus)}
          </Menu>
        </Scrollbars>
      </Sider>
    );
  }
}
