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

function isValidMaskItem(iv) {
  if (iv === 255) return true;

  let mask = 0x80;
  let cnt = 0;
  let isZero = false;

  while (cnt < 8) {
    if ((iv & mask) === 0) {
      isZero = true;
    } else if (isZero) {
      return false;
    }
    cnt += 1;
    mask >>= 1;
  }

  return true;
}

export function ipMask(nv) {
  if (!nv) return true;

  const v = nv.split('.');
  if (v.length > 4) {
    return false;
  }

  let i = 0;
  let is255 = true;
  const last = v.length - 1;

  for (const item of v) {
    if (!item) {
      return i === v.length - 1;
    }
    const iv = parseInt(item, 10);
    if (iv > 255) {
      return false;
    }
    if (i === last) {
      break;
    }
    if (i === 0 && iv === 0) {
      return false;
    }
    if (!is255 && iv !== 0) {
      return false;
    }
    if (!isValidMaskItem(iv)) {
      return false;
    }
    if (iv !== 255) {
      is255 = false;
    }
    i += 1;
  }
  
  return true;
}

export function port(nv) {
  return !nv || isValidPort(nv);
}
