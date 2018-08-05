import lodash from 'lodash'
import uri from './uri'

const _LANG = {}

function _l (txt, ...args) {
  if (!args || args.length === 0) {
    return txt
  }
  if (args.length > 0 && lodash.isPlainObject(args[0])) {
    for (const p in args[0]) {
      txt = txt.replace(new RegExp(`\\{${p}\\}`, "g"), args[0][p])
    }
    return txt
  }
  for (let i = 0, cnt = args.length; i < cnt; ++i) {
    txt = txt.replace(new RegExp(`\\{${i}\\}`, 'gm'), args[i])
  }
  return txt
}

export function l(txt, ...args) {
  const appPath = uri.current().split('/')
  while (appPath.length > 0) {
    let path = appPath.join('/')
    if (!path) path = '/';
    if (_LANG[path]) {
      const sl = _LANG[path]
      if (sl[txt]) return _l(sl[txt], ...args);
    }
    appPath.pop();
  }
  return _l(txt, ...args);
}

export function set(language, update) {
  for (const i in language) {
    const sl = language[i]
    const appPath = sl[0] === '/passport' ? '/' : sl[0]
    if (!_LANG[appPath]) _LANG[appPath] = sl[1]
    else Object.assign(_LANG[appPath], sl[1])
  }
  if (language.length > 0 && update) {
    update({
      type: 'updateState',
      payload: {
        localeChangedTag: (new Date()).getTime(),
      },
    })
  }
}
