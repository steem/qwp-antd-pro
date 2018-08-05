
const keyboardFilters = {
  digit(e) {
    if (e.charCode < 48 || e.charCode > 57) {
      e.preventDefault();
      return false;
    }
  },
  letters(e) {
    if (!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122))) {
      e.preventDefault();
      return false;
    }
  },
};

export {
  keyboardFilters,
};
