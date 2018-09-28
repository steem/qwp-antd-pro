import config from './config';

let loginNotify = [];

export function registerLoginNotify(namespace) {
  loginNotify.push(namespace);
}

export function notifyLogin(main) {
  if (loginNotify.length > 0 && main.user && main.user.isLogined) {
    for (const item of loginNotify) {
      config.store.dispatch({type: `${item}/init`});
    }
    loginNotify = [];
  }
}