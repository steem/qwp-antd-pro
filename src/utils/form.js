import _ from 'lodash';
import moment from 'moment';
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
  if (v) validators = v;
}

export function isValidPort(data) {
  if (!data || data.startsWith('0')) return false;
  if (!isFieldValid(data, 'digits')) return false;

  const v = parseInt(data, 10);
  
  return v > 0 && v < 65536;
}

export function isFieldValid(data, ruleName) {
  if (!validators[ruleName]) return -1;

  const rule = validators[ruleName];

  if (_.isArray(rule)) {
    for (let i = 0, cnt = rule[0].length; i < cnt; ++i) {
      let r;
      if (rule[1][i]) r = new RegExp(rule[0][i], rule[1][i]);
      else r = new RegExp(rule[0][i]);
      if (!r.test(data)) {
        return validatorDesc[ruleName] || validatorDesc.general;
      }
    }
  } else {
    const r = new RegExp(rule);
    
    if (!r.test(data)) {
      return validatorDesc[ruleName] || validatorDesc.general;
    }
  }

  return true;
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

function fillInitialValue(r, itemType, values, name) {
  if (itemType === 'file' || !values || _.isUndefined(values[name])) {
    if (itemType && itemType.startsWith('date')) {
      return;
    }
    r.initialValue = '';
  } else if (itemType === 'datetime') {
    r.initialValue = moment(values[name], 'YYYY-MM-DD HH:mm:ss');
  } else if (itemType === 'date') {
    r.initialValue = moment(values[name], 'YYYY-MM-DD');
  } else if (itemType === 'datehour') {
    r.initialValue = moment(values[name], 'YYYY-MM-DD HH:mm');
  } else if (itemType === 'datetime_range') {
    r.initialValue = [moment(values[name][0], 'YYYY-MM-DD HH:mm:ss'), moment(values[name][1], 'YYYY-MM-DD HH:mm:ss')];
  } else if (itemType === 'date_range') {
    r.initialValue = [moment(values[name][0], 'YYYY-MM-DD'), moment(values[name][1], 'YYYY-MM-DD')];
  } else if (itemType === 'datehour_range') {
    r.initialValue = [moment(values[name][0], 'YYYY-MM-DD HH:mm'), moment(values[name][1], 'YYYY-MM-DD HH:mm')];
  } else {
    r.initialValue = values[name];
    // try to guess date range picker
    if (_.isArray(r.initialValue) && r.initialValue.length === 2 && !isMomentObject(r.initialValue[0])) {
      const v1 = moment(r.initialValue[0]);
      const v2 = moment(r.initialValue[1]);
      if (v1.isValid() && v2.isValid()) {
        r.initialValue[0] = v1;
        r.initialValue[1] = v2;
      }
    }
  }
}

export function createFieldRules (settings, formName, name, values, op) {
  const dv = { rules: [] };
  let r = dv;
  const form = settings.formRules && settings.formRules[formName] ? settings.formRules[formName] : {};
  let itemType = false;

  if (form[name]) {
    r = form[name].rule;
    itemType = form[name].itemType;
  }
  fixRules(r.rules, op);
  fillInitialValue(r, itemType, values, name);

  return r;
}

export function getFieldDecorator(form, settings, formName, name, values, op) {
  const args = [formName ? formName + '.' + name : name];
  const r = createFieldRules(settings, formName, name, values, op);

  if (!_.isUndefined(r.initialValue) || r.rules.length > 0) args.push(r);

  return form.getFieldDecorator(...args);
}

function isMomentObject(o) {
  return o && o.constructor && o.constructor.name === 'Moment';
}

function getDateTimeValue(o) {
  return o.format('YYYY-MM-DD HH:mm:ss');
}

function formalizedFormValues(values, dst, formRules, formName) {
  const rule = formRules && formName && formRules[formName] ? formRules[formName] : false;

  for (const k in values) {
    if (values[k] && values[k].constructor) {
      const name = values[k].constructor.name;

      if (rule && rule[k] && rule[k].itemType) {
        let itemType = rule[k].itemType;
        if (itemType.startsWith('date')) {
          if (itemType.endsWith('range')) {
            dst[k] = [0, 0];
            itemType = itemType.substr(0, itemType.length - 6);
            if (itemType === 'datetime') {
              dst[k][0] = getDateTimeValue(values[k][0]);
              dst[k][1] = getDateTimeValue(values[k][1]);
            } else if (itemType === 'date') {
              dst[k][0] = values[k][0].format('YYYY-MM-DD');
              dst[k][1] = values[k][1].format('YYYY-MM-DD');
            } else if (itemType === 'datehour') {
              dst[k][0] = values[k][0].format('YYYY-MM-DD HH:mm');
              dst[k][1] = values[k][1].format('YYYY-MM-DD HH:mm');
            }
          } else if (itemType === 'datetime') {
            dst[k] = getDateTimeValue(values[k]);
          } else if (itemType === 'date') {
            dst[k] = values[k].format('YYYY-MM-DD');
          } else if (itemType === 'datehour') {
            dst[k] = values[k].format('YYYY-MM-DD HH:mm');
          }
          continue;
        }
      }
      if (name === 'Moment') {
        dst[k] = getDateTimeValue(values[k]);
        continue;
      } else if (name === 'Array') {
        if (values[k].length === 2) {
          dst[k] = [0, 0];
          if (isMomentObject(values[k][0])) {
            dst[k][0] = getDateTimeValue(values[k][0]);
          } else {
            dst[k][0] = values[k][0];
          }
          if (isMomentObject(values[k][1])) {
            dst[k][1] = getDateTimeValue(values[k][1]);
          } else {
            dst[k][1] = values[k][1];
          }
          continue;
        }
      }
      dst[k] = values[k];
    }
  }
}

export function submitForm ({form, onSubmit, dataKey, formRules, formName}) {
  const resetFields = () => form.resetFields();
  form.validateFieldsAndScroll((err, values) => {
    if (formName && values[formName]) values = values[formName];
    const fvs = {};
    formalizedFormValues(values, fvs, formRules, formName);
    if (!dataKey) dataKey = 'f';
    onSubmit(err, {
      [dataKey]: fvs,
    }, resetFields)
  });
}

export function createSubmitHandler ({form, onSubmit, activeFields, dataKey, beforeSubmit, formRules, formName}) {
  const resetFields = () => form.resetFields();
  if (activeFields) {
    return (e) => {
      e.preventDefault();
      const fields = _.isFunction(activeFields) ? activeFields() : activeFields;
      form.validateFieldsAndScroll(fields, { force: true }, (err, values) => {
        if (formName && values[formName]) values = values[formName];
        const fvs = {};
        formalizedFormValues(values, fvs, formRules, formName);
        if (beforeSubmit && beforeSubmit(fvs) === false) return;
        if (!dataKey) dataKey = 'f';
        onSubmit(err, {
          [dataKey]: fvs,
        }, resetFields);
      });
    }
  }
  return (e) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (formName && values[formName]) values = values[formName];
      const fvs = {};
      formalizedFormValues(values, fvs, formRules, formName);
      if (beforeSubmit && beforeSubmit(fvs) === false) return;
      if (!dataKey) dataKey = 'f'
      onSubmit(err, {
        [dataKey]: fvs,
      }, resetFields)
    });
  };
}

export function createSubmitHandlerForSearch({form, onSubmit, beforeSubmit, formRules, formName}) {
  return createSubmitHandler({
    form,
    onSubmit,
    beforeSubmit,
    formRules,
    formName,
    dataKey: 's',
  });
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

  const ignoredRules = ['_msg', '_sqlchar', '_from', 'array', 'requried', 'ui'];

  initErrorMessages();
  for (const p in settings.formRules) {
    const f = settings.formRules[p]
    for (const name in f) {
      const formRule = f[name];

      if (!_.isUndefined(formRule.ui)) {
        if (formRule.ui === false) {
          continue;
        }
      }

      const newRules = { rules: [] };
      let itemType = false;
      let objectType = false;
      let firstRule = true;

      newRules.rules.push({required: !!formRule.required, default: !!formRule.required});
      for (const ruleName in formRule) {
        const ruleValue = formRule[ruleName];
        let r;
        let isNewCreated;

        if (firstRule) {
          r = newRules.rules[0];
          isNewCreated = false;
          firstRule = false;
        } else {
          r = {};
          isNewCreated = true;
        }
        if (ignoredRules.indexOf(ruleName) !== -1) continue;
        if (ruleName === 'file') {
          r.itemType = 'file';
          r.validator = fileValidator;
          r.message = validatorDesc.file;
          if (ruleValue.length > 0) {
            const rsArr = ruleValue[0].split(',');
            if (rsArr.length) {
              r.rs = {};
              for (const rsi of rsArr) {
                r.rs[rsi] = true;
              }
            }
            if (ruleValue[1]) {
              r.size = ruleValue[1].split(',');
              if (r.size.length === 1) {
                r.size = [1, r.size[0]];
              }
            }
          }
        } else if (ruleName === 'rangelength') {
          [r.min, r.max] = ruleValue;
          r.message = l('The length of this field must between {0} and {1}.', r.min, r.max);
        } else if (ruleName === 'minlength') {
          r.min = ruleValue;
          r.message = l('The minimium length of this field must be {0}.', r.min);
        } else if (ruleName === 'maxlength') {
          r.max = ruleValue;
          r.message = l('The maximum length of this field must be {0}.', r.max);
        } else if (rangeErrorDesc[ruleName]) {
          r.validator = compareValidator;
          r.message = rangeErrorDesc[ruleName](...ruleValue);
          r.rs = [ruleName, ruleValue];
        } else if (validators[ruleName]) {
          itemType = ruleName;
          if (itemType.startsWith('date')) {
            objectType = itemType.endsWith('range') ? 'array' : 'object';
          } else if (_.isArray(validators[ruleName])) {
            r.validator = createRegExValidatorByArray(newRules.rules);
            r.rs = validators[ruleName];
          } else {
            r.validator = createRegExValidator(validators[ruleName], newRules.rules);
          }
          if (validatorDesc[ruleName]) r.message = validatorDesc[ruleName];
        } else {
          if (ruleName.startsWith('date')) {
            itemType = ruleName;
            objectType = ruleName.endsWith('range') ? 'array' : 'object';
          }
          r[ruleName] = ruleValue;
        }
        if (isNewCreated) newRules.rules.push(r);
      }
      if (newRules.rules.length > 0) {
        const msg =  formRule._msg ? l(formRule._msg) : validatorDesc.general;
        newRules.rules.forEach((r) => {
          if (!r.message) r.message = msg;
          if (objectType) r.type = objectType;
        });
        f[name] = {rule: newRules, itemType};
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
