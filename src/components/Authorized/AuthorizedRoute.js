import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import config from 'utils/config';
import Authorized from './Authorized';

class AuthorizedRoute extends React.Component {
  render() {
    const { component: Component, render, ...rest } = this.props;
    const redirectPath = this.props.redirectPath || config.loginPath;
    return (
      <Authorized
        noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}
      >
        <Route {...rest} render={props => (Component ? <Component {...props} /> : render(props))} />
      </Authorized>
    );
  }
}

export default AuthorizedRoute;
