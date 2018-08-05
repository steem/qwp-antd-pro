import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'components/Login';
import logo from '../../assets/logo.svg';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ passport, loading }) => ({
  passport,
  submitting: loading.effects['passport/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      values.type = type;
      this.props.dispatch({
        type: 'passport/login',
        payload: {
          ...values,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { passport, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="logo" className={styles.logo} src={logo} />
          </div>
          <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
        </div>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            {passport.status === 'error' &&
              passport.loginType === 'account' &&
              !submitting &&
              this.renderMessage('账户或密码错误（admin/123Qwe）')}
            <UserName name="user" placeholder="admin/user" />
            <Password name="pwd" placeholder="123Qwe/123Qwe" />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            {passport.status === 'error' &&
              passport.loginType === 'mobile' &&
              !submitting &&
              this.renderMessage('验证码错误')}
            <Mobile name="mobile" />
            <Captcha name="captcha" />
          </Tab>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="alipay-circle" />
            <Icon className={styles.icon} type="taobao-circle" />
            <Icon className={styles.icon} type="weibo-circle" />
            <Link className={styles.register} to="/passport/register">
              注册账户
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}
