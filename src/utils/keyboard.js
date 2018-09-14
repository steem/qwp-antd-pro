export function prevent(e) {
  e.preventDefault();
  return false;
}

export function digit(e) {
  if (e.charCode < 48 || e.charCode > 57) {
    return prevent(e);
  }
}

export function number(e) {
  if (e.charCode === 48 && !e.target.value) return;
  if (e.charCode < 48 || e.charCode > 57) {
    return prevent(e);
  }
}

export function numberEx(e) {
  if (e.charCode === 42) {
    if (!e.target.value) return;
    return prevent(e);
  }
  if (e.target.value === '*') {
    return prevent(e);
  }
  return number(e);
}

export function ip(e) {
  if ((e.charCode < 48 || e.charCode > 57) && e.charCode !== 46) {
    return prevent(e);
  }
}

export function letters(e) {
  if (!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122))) {
    return prevent(e);
  }
}

export function chain(...args) {
  return (e) => {
    for (const fn of args) {
      if (fn(e) === false) {
        return false;
      }
    }
  };
}
