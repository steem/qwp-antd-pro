import Authorized from './Authorized';
import AuthorizedRoute from './AuthorizedRoute';
import Secured from './Secured';
import check from './CheckPermissions.js';

Authorized.Secured = Secured;
Authorized.AuthorizedRoute = AuthorizedRoute;
Authorized.check = check;

/**
 * use  authority or getAuthority
 * @param {string|()=>String} currentAuthority
 */
function renderAuthorize() {
  return Authorized;
}

export default renderAuthorize;
