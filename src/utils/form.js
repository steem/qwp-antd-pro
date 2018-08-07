import _ from 'lodash';
import { l } from './localization';

let validators = {};
const validatorDesc = {
  digits: 'Must be digits',
  letters: 'Must be letters',
  alphanumeric: 'Must be letters',
  alphanumeric_ex: 'Must be letters',
  url: 'Must be valid url',
  password: 'Password is too simple',
  email: 'Must be valid email',
  number: 'Must be valid number',
  ipv4: 'Must be valid ipv4 address',
  ipv6: 'Must be valid ipv6 address',
  datehour: 'Must be date with hour, eg: 1998-01-01 19:01',
  datetime: 'Must be date with hour and minutes, eg: 1998-01-01 19:01:01',
  date: 'Must be date, eg: 1998-01-01',
  joined_digits: 'Must be digits joined by comma, eg: 1,2,3',
  base64: 'Must be valid base64 encoded value',
  hex: 'Must be hex string',
  file: 'The file type is invalid',
  general: 'The field is invalid',
  fileSize: 'File size must between {0} ~ {1}',
};

function rangeError(v1, v2) {
  return l('Input value range is [{0}, {1}]', v1, v2);
}

const rangeErrorDesc = {
  'min': v => l('The minimum value is {0}', v),
  'max': v => l('The maximum value is {0}', v),
  'range': rangeError,
  '[]': rangeError,
  '[)': (v1, v2) => l('Input value range is [{0}, {1})', v1, v2),
  '(]': (v1, v2) => l('Input value range is ({0}, {1}]', v1, v2),
  '()': (v1, v2) => l('Input value range is ({0}, {1})', v1, v2),
};

function compareValidator(rule, v, callback) {
  const { rs } = rule;
  let invalid = false;
  const value = parseInt(v, 10);

  if (rs[0] === 'min') {
    invalid = rs[1] > value;
  } else if (rs[0] === 'max') {
    invalid = rs[1] < value;
  } else if (rs[0] === '[]' || rs[0] === 'range') {
    invalid = value < rs[1][0] || value > rs[1][1];
  } else if (rs[0] === '[)') {
    invalid = value < rs[1][0] || value >= rs[1][1];
  } else if (rs[0] === '(]') {
    invalid = value <= rs[1][0] || value > rs[1][1];
  } else if (rs[0] === '()') {
    invalid = value <= rs[1][0] || value >= rs[1][1];
  }
  if (invalid) callback(new Error(validatorDesc.general));
  else callback();
}

function isOptionalRule(rules) {
  for (const r of rules) {
    if (!_.isUndefined(r.required)) {
      return r.required !== true;
    }
  }
  return true;
}

function createRegExValidatorByArray (rules) {
  return  (rule, value, callback) => {
    if (!value && isOptionalRule(rules)) {
      callback();
      return;
    }
    const { rs } = rule;
    for (let i = 0, cnt = rs[0].length; i < cnt; ++i) {
      let r;
      if (rs[1][i]) r = new RegExp(rs[0][i], rs[1][i]);
      else r = new RegExp(rs[0][i]);
      if (!r.test(value)) {
        callback(new Error(validatorDesc.general));
        return;
      }
    }
    callback();
  }
}

function createRegExValidator(p, rules) {
  return  (rule, value, callback) => {
    if (!value && isOptionalRule(rules)) {
      callback();
      return;
    }
    const r = new RegExp(p);
    if (!r.test(value)) {
      callback(new Error(validatorDesc.general));
      return;
    }
    callback();
  }
}

function checkFileList(rule, fileList) {
  if (!rule || !rule.rs || !fileList) return true;
  for (const file of fileList) {
    let value = file.name.toLowerCase();
    const pos = value.lastIndexOf('.');
    if (pos === -1) break;
    value = value.substr(pos + 1);
    if (rule.rs[value]) {
      if (rule.size) {
        if (file.size < rule.size[0] || file.size > rule.size[1]) {
          return validatorDesc.fileSize;
        }
      }
      return true;
    }
  }
  return validatorDesc.file;
}
function fileValidator (rule, fileList, callback) {
  const ret = checkFileList(rule, fileList);
  if (ret === true) callback();
  else callback(new Error(ret));
}

export function isFileValid(settings, formName, name, fileList) {
  const form = settings.formRules ? settings.formRules[formName] : {};

  if (!form[name] || !form[name].rules) return true;
  for (const rule of form[name].rules) {
    if (rule.validator === fileValidator) {
      return checkFileList(rule, fileList);
    }
  }
  return true;
}

export function setValidators(v) {
  validators = v;
}

function isFileItem(rules) {
  for (const r of rules) {
    if (r.validator === fileValidator) return true;
  }
  return false;
}

function changeRuleRequiredFlag(rules, d) {
  for (const r of rules) {
    if (!_.isUndefined(r.required)) {
      r.required = d === 1;
      break;
    }
  }
}

function restoreRuleRequiredFlag(rules) {
  for (const r of rules) {
    if (!_.isUndefined(r.required)) {
      r.required = r.default;
      break;
    }
  }
}

function fixRules(rules, op) {
  if (!op) {
    restoreRuleRequiredFlag(rules);
    return;
  }
  const tag = 'op_' + op;
  for (const r of rules) {
    if (!_.isUndefined(r[tag])) {
      changeRuleRequiredFlag(rules, r[tag]);
      return;
    }
  }
}

export function createFieldRules (settings, formName, name, values, op) {
  const dv = { rules: [] };
  let r = dv;
  const form = settings.formRules && settings.formRules[formName] ? settings.formRules[formName] : {};

  if (form[name]) r = form[name];
  fixRules(r.rules, op);
  if (isFileItem(r.rules)) {
    r.initialValue = '';
  } else if (values) {
    r.initialValue = !_.isUndefined(values[name]) ? values[name] : '';
  }
  return r;
}

export function getFieldDecorator(form, settings, formName, name, values, op) {
  return form.getFieldDecorator(name, createFieldRules(settings, formName, name, values, op))
}

function isMomentObject(o) {
  return o && o.constructor && o.constructor.name === 'Moment';
}

function getDateTimeValue(o) {
  return o.format('YYYY-MM-DD HH:mm:ss');
}

function formalizedFormValue(values) {
  for (const k in values) {
    if (values[k] && values[k].constructor) {
      const name = values[k].constructor.name;
      if (name === 'Moment') {
        values[k] = getDateTimeValue(values[k]);
      } else if (name === 'Array') {
        if (values[k].length === 2) {
          if (isMomentObject(values[k][0])) {
            values[k][0] = getDateTimeValue(values[k][0]);
          }
          if (isMomentObject(values[k][1])) {
            values[k][1] = getDateTimeValue(values[k][1]);
          }
        }
      }
    }
  }
}

export function createSubmitHander (form, onSubmit, activeFields, dataKey, beforeSubmit) {
  const resetFields = () => form.resetFields();
  if (activeFields) {
    return (e) => {
      e.preventDefault();
      const fields = _.isFunction(activeFields) ? activeFields() : activeFields;
      form.validateFieldsAndScroll(fields, { force: true }, (err, values) => {
        formalizedFormValue(values);
        if (beforeSubmit && beforeSubmit(values) === false) return;
        if (!dataKey) dataKey = 'f';
        onSubmit(err, {
          [dataKey]: values,
        }, resetFields);
      });
    }
  }
  return (e) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      formalizedFormValue(values);
      if (beforeSubmit && beforeSubmit(values) === false) return;
      if (!dataKey) dataKey = 'f'
      onSubmit(err, {
        [dataKey]: values,
      }, resetFields)
    });
  };
}

function initErrorMessages() {
  if (validatorDesc._inited) return;
  for (const k in validatorDesc) {
    if (k.startsWith('_')) continue;
    validatorDesc[k] = l(validatorDesc[k]);
  }
  validatorDesc._inited = true;
}

export function importFormRules (settings) {
  if (!settings || !settings.formRules) return;
  initErrorMessages();
  for (const p in settings.formRules) {
    const f = settings.formRules[p]
    for (const name in f) {
      const fr = f[name];

      if (!_.isUndefined(fr.ui)) {
        if (fr.ui === false) {
          continue;
        }
        delete fr.ui;
      }

      const nr = { rules: [] };

      if (!fr.required) nr.rules.push({required: false, default: false});
      for (const item in fr) {
        const ov = fr[item];
        const r = {};

        if (item === '_msg') continue;
        if (item === 'file') {
          r.validator = fileValidator;
          r.message = validatorDesc.file;
          if (ov.length > 0) {
            const rsArr = ov[0].split(',');
            if (rsArr.length) {
              r.rs = {};
              for (const rsi of rsArr) {
                r.rs[rsi] = true;
              }
            }
            if (ov[1]) {
              r.size = ov[1].split(',');
              if (r.size.length === 1) {
                r.size = [1, r.size[0]];
              }
            }
          }
        } else if (item === 'rangelength') {
          [r.min, r.max] = ov;
          r.message = l('The length of this field must between {0} and {1}.', r.min, r.max);
        } else if (item === 'minlength') {
          r.min = ov;
          r.message = l('The minimium length of this field must be {0}.', r.min);
        } else if (item === 'maxlength') {
          r.max = ov;
          r.message = l('The maximum length of this field must be {0}.', r.max);
        } else if (rangeErrorDesc[item]) {
          r.validator = compareValidator;
          r.message = rangeErrorDesc[item](...ov);
          r.rs = [item, ov];
        } else if (validators[item]) {
          if (_.isArray(validators[item])) {
            r.validator = createRegExValidatorByArray(nr.rules);
            r.rs = validators[item]
          } else {
            r.validator = createRegExValidator(validators[item], nr.rules);
          }
          if (validatorDesc[item]) r.message = validatorDesc[item];
        } else {
          r[item] = ov;
          if (item === 'required') r.default = ov;
        }
        nr.rules.push(r)
      }
      if (nr.rules.length > 0) {
        const msg =  fr._msg ? l(fr._msg) : validatorDesc.general;
        nr.rules.forEach((r) => {
          if (!r.message) r.message = msg;
        })
        f[name] = nr
      } else {
        delete f[name]
      }
    }
  }
}

export function mergeFormRules (settings, newSettings) {
  if (!newSettings.formRules) return
  if (!settings.formRules) settings.formRules = newSettings.formRules
  else settings.formRules = { ...settings.formRules, ...newSettings.formRules }
}
