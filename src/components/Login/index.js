import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Tabs } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import { createSubmitHandler } from 'utils/form';
import LoginItem from './LoginItem';
import LoginTab from './LoginTab';
import LoginSubmit from './LoginSubmit';
import styles from './index.less';

@connect(({ main }) => ({
  main,
}))
class Login extends Component {
  static propTypes = {
    className: PropTypes.string,
    defaultActiveKey: PropTypes.string,
    onTabChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static childContextTypes = {
    tabUtil: PropTypes.object,
    form: PropTypes.object,
    updateActive: PropTypes.func,
    main: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => {},
    onSubmit: () => {},
  };

  state = {
    type: this.props.defaultActiveKey,
    tabs: [],
    active: {},
  };

  getChildContext() {
    const { tabs } = this.state;

    return {
      tabUtil: {
        addTab: id => {
          this.setState({
            tabs: [...tabs, id],
          });
        },
        removeTab: id => {
          this.setState({
            tabs: tabs.filter(currentId => currentId !== id),
          });
        },
      },
      form: this.props.form,
      updateActive: activeItem => {
        const { type, active } = this.state;
        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }
        this.setState({
          active,
        });
      },
      main: this.props.main,
    };
  }

  onSwitch = type => {
    this.setState({
      type,
    });
    this.props.onTabChange(type);
  };

  activeFileds = () => this.state.active[this.state.type];
  
  render() {
    const { className, children } = this.props;
    const { type, tabs } = this.state;
    const TabChildren = [];
    const otherChildren = [];

    React.Children.forEach(children, item => {
      if (!item) {
        return;
      }
      // eslint-disable-next-line
      if (item.type.__ANT_PRO_LOGIN_TAB) {
        TabChildren.push(item);
      } else {
        otherChildren.push(item);
      }
    });

    if (!this.submitHandler) {
      this.submitHandler = createSubmitHandler({
        form: this.props.form,
        onSubmit: this.props.onSubmit,
        activeFileds: this.activeFileds.bind(this),
      })
    }
  
    return (
      <div className={classNames(className, styles.login)}>
        <Form onSubmit={this.submitHandler}>
          {tabs.length ? (
            <div>
              <Tabs
                animated={false}
                className={styles.tabs}
                activeKey={type}
                onChange={this.onSwitch}
              >
                {TabChildren}
              </Tabs>
              {otherChildren}
            </div>
          ) : (
            [...children]
          )}
        </Form>
      </div>
    );
  }
}

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});

export default Form.create()(Login);
