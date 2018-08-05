import React from 'react';
import { connect } from 'dva';
import CheckPermissions from './CheckPermissions';

@connect(({ main }) => ({
  main,
}))
class Authorized extends React.Component {
  render() {
    const { children, main, noMatch = null } = this.props;
    const childrenRender = typeof children === 'undefined' ? null : children;
    return CheckPermissions(main.settings ? main.settings.acls : null, childrenRender, noMatch);
  }
}

export default Authorized;
