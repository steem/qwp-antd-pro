import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import { l } from 'utils/localization';
import { isUrl } from 'utils/utils';
import config from 'utils/config';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

function createMenuItem(item, link) {
  if (item === '') return (<Menu.Divider key='umd' />);
  const key = item.path || item.name;
  if (isUrl(item.path)) {
    return (
      <Menu.Item key={key}>
        <a href={item.path} target="_blank" rel="noopener noreferrer">
          <Icon type={item.icon || item.name} /><span>{ item.text ? l(item.text) : l(item.name) }</span>
        </a>
      </Menu.Item>);
  }
  if (!link) {
    return (
      <Menu.Item key={key}>
        <Icon type={item.icon || item.name} /><span>{ item.text ? l(item.text) : l(item.name) }</span>
      </Menu.Item>);
  }
  return (
    <Menu.Item key={key}>
      <Link to={item.path} key={item.path}>
        <Icon type={item.icon || item.name} /><span>{ item.text ? l(item.text) : l(item.name) }</span>
      </Link>
    </Menu.Item>);
}

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable */
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  /* eslint-enable */

  render() {
    const {
      main,
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      logoText,
      hideLogoText,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      hasSiderbar,
      onHeaderSearch,
      onHeaderInput,
      onNoticeTabClick,
    } = this.props;
    const {
      settings,
    } = main;
    let userIcon;
    let logoItem;
    let logoDivider;
    let siderBarIcon;
    let headerNav;
    let headerNavIcon;
    let headerNavMenu;
    let headerSearcher;
    let faq;
    let notice;
    const showHeaderItems = config.showHeaderItemsWhenNotLogin || main.user.isLogined;

    if (main.user.name) {
      if (settings.userMenu.length > 0) {
        const menu = (
          <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
            { settings.userMenu.map(item => createMenuItem(item) ) }
          </Menu>);
        userIcon = (
          <Dropdown overlay={menu} trigger={['click']}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={main.user.avatar} />
              <span className={styles.name}>{main.user.name}</span>
            </span>
          </Dropdown>);
      } else {
        userIcon = (
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar size="small" className={styles.avatar} src={main.user.avatar} />
            <span className={styles.name}>{main.user.name}</span>
          </span>);
      }
    } else {
      userIcon = (<Spin size="small" style={{ marginLeft: 8 }} />);
    }
    if (settings.headerNav.length > 0) {
      headerNavMenu = (
        <Menu className={styles.menu} selectedKeys={[main.topComponent]}>
          { settings.headerNav.map(item => createMenuItem(item, true) ) }
        </Menu>);
    }
    if (isMobile || !hasSiderbar) {
      logoItem = (
        <Link to="/" className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="32" /> { !isMobile && !hideLogoText && logoText }
        </Link>);
      if (hasSiderbar) logoDivider = (<Divider type="vertical" key="line" />);
    }
    if (hasSiderbar) {
      siderBarIcon = (
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />);
    }
    if (settings.headerNav.length > 0) {
      headerNav = (
        <div className={styles.navHeader}>
          <Menu
            selectedKeys={[main.topComponent]}
            mode="horizontal"
          >
            { settings.headerNav.map(item => createMenuItem(item, true) ) }
          </Menu>
        </div>);
      headerNavIcon = (
        <div className={styles.navHeaderMenu}>
          <Dropdown overlay={headerNavMenu}>
            <Icon className={styles.trigger} type="appstore" />
          </Dropdown>
        </div>);
    }
    if (settings.headerSearcher && showHeaderItems) {
      headerSearcher = (
        <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder={settings.headerSearcher.placeholder}
          dataSource={settings.headerSearcher.dataSource}
          onSearch={onHeaderInput}
          onPressEnter={onHeaderSearch}
        />);
    }
    if (settings.faq && showHeaderItems) {
      faq = (
        <Tooltip title={l(settings.faq.title)}>
          { isUrl(settings.faq.link) ? (
            <a
              target="_blank"
              href={settings.faq.link}
              rel="noopener noreferrer"
              className={styles.action}
            >
              <Icon type="question-circle-o" />
            </a>) : (
              <Link to={settings.faq.link} className={styles.action} key="faq-link">
                <Icon type="question-circle-o" />
              </Link>)}
        </Tooltip>);
    }
    if (settings.noticeTab.length > 0 && showHeaderItems) {
      const noticeData = this.getNoticeData();
      notice = (
        <NoticeIcon
          className={styles.action}
          count={main.notices.length}
          onItemClick={onNoticeTabClick}
          onClear={onNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          loading={fetchingNotices}
          popupAlign={{ offset: [20, -16] }}
        >
          { settings.noticeTab.map(item => (
            <NoticeIcon.Tab
              list={noticeData[item.type]}
              title={l(item.text)}
              emptyText={l(item.emptyText)}
              emptyImage={item.emptyImage}
              key={item.type}
            />)) }
        </NoticeIcon>);
    }
    return (
      <div className={styles.header} ref={n => {this.header = n}}>
        {logoItem}
        {logoDivider}
        {siderBarIcon}
        <div className={styles.right}>
          {headerNav}
          {headerNavIcon}
          <div className={styles.actionContainer}>
            {headerSearcher}
            {faq}
            {notice}
            {this.props.otherIcons && this.props.otherIcons.map(item => (
              <Tooltip title={l(item.title)} key={item.key}>
                <a className={styles.action} onClick={item.onClick} tag={item.key}>
                  {item.icon ? <Icon type={item.icon} /> : <img src={item.img} />}
                </a>
              </Tooltip>
            ))}
            {userIcon}
          </div>
        </div>
      </div>
    );
  }
}
