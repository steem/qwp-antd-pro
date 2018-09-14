import { isFieldValid, isValidPort } from 'utils/form';

export function ip(nv) {
  if (!nv) return true;
  const v = nv.split('.');
  if (v.length > 4) {
    return false;
  }
  for (const item of v) {
    if (item && parseInt(item, 10) > 254) {
      return false;
    }
  }

  return (v.length < 4 || !v[3] || isFieldValid(nv, 'ipv4') === true);
}

export function port(nv) {
  return !nv || isValidPort(nv);
}
