import { checkPermissions } from './CheckPermissions.js';

const target = 'ok';
const error = 'error';

describe('test CheckPermissions', () => {
  it('Correct string permission authentication', () => {
    expect(checkPermissions({
      '/user': { name: 'user', icon: 'user' },
    }, '/user', target, error)).toEqual('ok');
  });
});
