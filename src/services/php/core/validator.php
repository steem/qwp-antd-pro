<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
function qwp_custom_validate_form(&$msg) {
    global $FN_QWP_FORM_VALIDATOR;
    return isset($FN_QWP_FORM_VALIDATOR) ? $FN_QWP_FORM_VALIDATOR($msg) : true;
}
function qwp_delete_file_in_form(&$f, $field) {
    if (isset($f[$field][0])) {
        foreach($f[$field] as &$item) {
            unlink($item['path']);
        }
    } else {
        unlink($f[$field]['path']);
    }
}
function qwp_validate_get_error(&$msg, &$val, &$name) {
    if (is_array($val)) $val = to_json($val);
    if (QWP_SHOW_INVALID_FORM_VALUE) return $msg . '. ' . L('Current value of {0} is: ', $name) . '<pre>'  . $val . '</pre>';
    return $msg;
}
function qwp_validate_file_for_file_validator() {
    global $QWP_FILE_VALIDATOR_RULE, $MODULE_ROOT;

    $form_rule = null;
    require($MODULE_ROOT . '/form_' . $QWP_FILE_VALIDATOR_RULE . '_validator.php');
    if (!$form_rule || !isset($form_rule['files'])) {
        return true;
    }
    $rules = &$form_rule['files'];
    global $_FILES;
    $unwanted = array();
    foreach ($_FILES as $field_name => $file) {
        $file_path = &$file['tmp_name'];
        if (!isset($rules[$field_name])) {
            @unlink($file['tmp_name']);
            $unwanted[] = $field_name;
            continue;
        }
        $file_rule = $rules[$field_name];
        $file_name = &$file['name'];
        $file_size = &$file['size'];
        if (!is_correct_ext($file_name, $file_rule[0])) {
            @unlink($file_path);
            return qwp_validate_get_error(L('File extension should be {0}', $file_rule[0]), $file_name);
        }
        if (isset($file_rule[1])) {
            $size = explode(',', $file_rule[1]);
            if (count($size) == 1) {
                $size = array(1, $size[0]);
            }
            if ($file_size < $size[0] || $file_size > $size[1]) {
                @unlink($file_path);
                return qwp_validate_get_error(L('File size should between {0} and {1}', format_file_size($size[0]), format_file_size($size[1])), $size[0]);
            }
        }
    }
    foreach ($unwanted as $item) {
        @unlink($_FILES[$item]['tmp_name']);
        unset($_FILES[$item]);
    }
    return true;
}
function qwp_validate_files(&$f, &$form_rule, &$rules) {
    if (!isset($form_rule['files']) && !isset($form_rule['has_file'])) {
        return true;
    }
    if (QWP_JUST_SERVICE) {
        foreach ($form_rule['files'] as $item => $v) {
            $f[$item] = C($item);
            if (isset($rules['required']) && $rules['required'] && !$f[$item]) {
                return L('File is empty');
            }
        }
        foreach ($form_rule['files'] as $item => $v) {
            CS($item);
        }
    }
    global $_FILES;

    // files field name must be f[xxx]
    // use required or optional to do validate
    if (!isset($_FILES['f'])) {
        return true;
    }
    $files = &$_FILES['f'];
    // use required or optional to do validate
    if (!isset($files['name']) || !is_array($files['name'])) {
        if (isset($files['tmp_name'])) @unlink($files['tmp_name']);
        return true;
    }
    if (isset($form_rule['files'])) $files_rule = &$form_rule['files'];
    else $files_rule = array();
    foreach ($rules as $field_name => &$rule) {
        foreach ($rule as $key => &$item) {
            if ($key === 'file') {
                $files_rule[$field_name] = $item;
                break;
            }
        }
    }
    foreach ($files['name'] as $file_field => $file_names) {
        $file_rule = &$files_rule[$file_field];
        if (is_string($file_names)) {
            $files['name'][$file_field] = array($file_names);
            $files['tmp_name'][$file_field] = array($files['tmp_name'][$file_field]);
            $files['type'][$file_field] = array($files['type'][$file_field]);
            $files['error'][$file_field] = array($files['error'][$file_field]);
            $files['size'][$file_field] = array($files['size'][$file_field]);
        }
        if (!isset($files_rule[$file_field])) {
            foreach ($files['tmp_name'][$file_field] as $i => $file_path) {
                if (is_string($file_path)) {
                    @unlink($file_path);
                }
            }
            continue;
        }
        $valid_files = array();
        $total = 0;
        $last_file = false;
        foreach ($files['tmp_name'][$file_field] as $i => $file_path) {
            if (!is_string($file_path)) {
                continue;
            }
            $file_name = $files['name'][$file_field][$i];
            $file_size = $files['size'][$file_field][$i];
            if (is_array($file_rule)) {
                if ($file_rule[0]) {
                    if (!is_correct_ext($file_name, $file_rule[0])) {
                        @unlink($file_path);
                        return qwp_validate_get_error(L('File extension should be {0}', $file_rule[0]), $file_name);
                    }
                }
                if ($file_rule[1]) {
                    $size = explode(',', $file_rule[1]);
                    if (count($size) == 1) {
                        if ($file_size > $size[0]) {
                            @unlink($file_path);
                            return qwp_validate_get_error(L('File size should not bigger than {0}', format_file_size($size[0])), $size[0]);
                        }
                    } else {
                        if ($file_size < $size[0] || $file_size > $size[1]) {
                            @unlink($file_path);
                            return qwp_validate_get_error(L('File size should between {0} and {1}', format_file_size($size[0]), format_file_size($size[1])), $size[0]);
                        }
                    }
                }
            }
            ++$total;
            $last_file = array(
                'name' => $file_name,
                'size' => $file_size,
                'path' => $file_path,
                'type' => $files['type'][$file_field][$i],
                'error' => $files['error'][$file_field][$i],
            );
            $valid_files[$i] = $last_file;
        }
        if ($total > 1) {
            $f[$file_field] = $valid_files;
        } else {
            $f[$file_field] = $last_file;
        }
    }
    return true;
}
function qwp_filter_form_values(&$f, &$all_filters) {
    foreach ($all_filters as $field => &$filters) {
        if (!isset($f[$field]) || !$f[$field]) {
            continue;
        }
        $filters = explode(',', $filters);
        foreach ($filters as $filter) {
            if ($filter == 'html') {
                $f[$field] = htmlspecialchars($f[$field]);
            }
        }
    }
}
function qwp_validate_form_item(&$f, &$validator, &$field_value, &$validator_value) {
    if ($validator == 'datetime') {
        return datetime_to_int($field_value) ? true : false;
    } else if ($validator == 'date') {
        return date_to_int($field_value) ? true : false;
    } else if ($validator == 'datehour') {
        return datetime_to_int($field_value . ':00') ? true : false;
    } else if ($validator == 'datetime_range') {
        if (!is_array($field_value) || !isset($field_value[0]) || !isset($field_value[1])) {
            return false;
        }
        return datetime_to_int($field_value[0]) && datetime_to_int($field_value[1]) ? true : false;
    } else if ($validator == 'date_range') {
        if (!is_array($field_value) || !isset($field_value[0]) || !isset($field_value[1])) {
            return false;
        }
        return date_to_int($field_value[0]) && date_to_int($field_value[1]) ? true : false;
    } else if ($validator == 'datehour_range') {
        if (!is_array($field_value) || !isset($field_value[0]) || !isset($field_value[1])) {
            return false;
        }
        return datetime_to_int($field_value[0]. ':00') && datetime_to_int($field_value[1]. ':00') ? true : false;
    } else if ($validator == 'digits') {
        if (!is_digits($field_value)) return false;
        if ($validator_value !== true) {
            return qwp_validate_form_item($f, $validator_value[0], $field_value, $validator_value[1]);
        }
        return true;
    } else if ($validator == 'length') {
        return mb_strlen($field_value, 'utf8') === $validator_value;
    } else if ($validator == 'minlength') {
        return mb_strlen($field_value, 'utf8') >= $validator_value;
    } else if ($validator == 'maxlength') {
        return mb_strlen($field_value, 'utf8') <= $validator_value;
    } else if ($validator == 'rangelength') {
        $len = mb_strlen($field_value, 'utf8');
        return $len >= $validator_value[0] && $len <= $validator_value[1];
    } else if ($validator == 'min') {
        return $field_value >= $validator_value;
    } else if ($validator == 'max') {
        return $field_value <= $validator_value;
    } else if ($validator == 'range' || $validator == '[]') {
        return $field_value >= $validator_value[0] && $field_value <= $validator_value[1];
    } else if ($validator == 'equalTo' || $validator == '=') {
        if (is_array($validator_value)) {
            $equal_item = isset($f[$validator_value[1]]) ? $f[$validator_value[1]] : null;
        } else {
            $equal_item = isset($f[$validator_value]) ? $f[$validator_value] : null;
        }

        return $field_value === $equal_item;
    } else if ($validator == 'in') {
        if (is_array($validator_value)) return in_array($field_value, $validator_value);
        return $field_value === $validator_value;
    } else if ($validator == '[)') {
        return $field_value >= $validator_value[0] && $field_value < $validator_value[1];
    } else if ($validator == '(]') {
        return $field_value > $validator_value[0] && $field_value <= $validator_value[1];
    } else if ($validator == '()') {
        return $field_value > $validator_value[0] && $field_value < $validator_value[1];
    } else if ($validator == 'mixed') {
        foreach ($validator_value as $k => &$v) {
            if (qwp_validate_form_item($f, $k, $field_value, $v)) {
                return true;
            }
        }
        return false;
    }
    return is_valid_input($field_value, $validator);
}
function qwp_validate_data(&$f, &$rules, &$filters = null, $just_unset_when_failed = false) {
    global $QWP_FORM_OP_TAG;

    $op_tag = $QWP_FORM_OP_TAG ? 'op_' . $QWP_FORM_OP_TAG : '';
    $msg_base = L('Invalid form data');
    $empty_value = L('empty');
    $valid_fields = array();
    $continue_validators = array(
        'required' => 1,
        'optional' => 1,
        'file' => 1,
        'name' => 1,
    );
    foreach ($rules as $field_name => &$rule) {
        $op = isset($rule['op']) ? $rule['op'] : '';
        if ($op) {
            unset($rule['op']);
            // only for this op
            if ($op !== $QWP_FORM_OP_TAG) {
                continue;
            }
        }
        if (isset($rule['ui'])) unset($rule['ui']);
        if ($QWP_FORM_OP_TAG && isset($rule[$op_tag])) {
            if ($rule[$op_tag] === 2) {
                continue;
            }
            if ($rule[$op_tag] === 1) {
                $rule['required'] = true;
            } else if ($rule[$op_tag] === 0) {
                $rule['required'] = false;
            }
            unset($rule[$op_tag]);
        }
        $field_value = isset($f[$field_name]) ? $f[$field_name] : null;
        $valid_fields[$field_name] = true;
        if (isset($rule['_msg'])) {
            $msg = &$rule['_msg'];
        } else {
            $msg = &$msg_base;
        }
        if (isset($rule['required']) && $rule['required']) {
            if ($field_value === null || $field_value === '') {
                if ($just_unset_when_failed) {
                    unset($f[$field_name]);
                    continue;
                }
                return qwp_validate_get_error($msg, $emtpy, $field_name);
            }
        } else if ($field_value === null || $field_value === '') {
            continue;
        }
        $from = null;
        if (isset($rule['_from'])) {
            $from = $rule['_from'];
            unset($rule['_from']);
        }
        foreach ($rule as $validator => $validator_value) {
            if (substr($validator, 0, 1) == '_') {
                if ($validator == '_sqlchar') {
                    $f[$field_name] = mysql_real_escape_string($field_value);
                }
                continue;
            }
            if (isset($continue_validators[$validator]) || starts_with($validator, 'op_')) {
                continue;
            }
            if (is_array($field_value)) {
                $is_item_valid = true;
                if ($validator === 'array') {
                    continue;
                }
                if ($validator == 'datetime_range' || $validator == 'date_range' || $validator == 'datehour_range') {
                    if (count($field_value) !== 2 || qwp_validate_form_item($f, $validator, $field_value, $validator_value) === false) {
                        $is_item_valid = false;
                    }
                } else {
                    foreach ($field_value as &$field_value_of_arr) {
                        if (is_array($field_value_of_arr)) {
                            if ($from !== null && isset($field_value_of_arr[$from])) {
                                $chk_v = &$field_value_of_arr[$from];
                            } else {
                                $is_item_valid = false;
                                break;
                            }
                        } else {
                            $chk_v = &$field_value_of_arr;
                        }
                        if (qwp_validate_form_item($f, $validator, $chk_v, $validator_value) === false) {
                            $is_item_valid = false;
                            break;
                        }    
                    }
                }
                if ($is_item_valid) {
                    continue;
                }
            } else {
                if ($validator !== 'array' && qwp_validate_form_item($f, $validator, $field_value, $validator_value) !== false) {
                    continue;
                }
            }
            if ($just_unset_when_failed) {
                unset($f[$field_name]);
            } else {
                return qwp_validate_get_error($msg, $field_value, $field_name);
            }
        }
    }
    if ($filters) qwp_filter_form_values($f, $filters);
    remove_unwanted_data($f, $valid_fields);
    return true;
}
/*
 * $form_rule = array(
 *      'cssSelector' => '#form',
 *      'rules' => array(
 *          'user' => array(
 *              'required' => true,
 *              'email' => true,
 *              ...
 *              '_msg' => '',
 *          ),
 *      ),
 *      'confirmDialog' => 'dialog id or qwp_mbox',
 *      'filters' => array('' => ''),
 *      'mbox' => array(
 *          'title' => '',
 *          'message' => '',
 *      ),
 *      'submitButton' => 'css selector',
 *      'actionMessage' => 'Operation message',
 *      'invalidHandler' => 'function name',
 *      'beforeSubmit'  => 'function name',
 *      'dataType' => 'json|xml|script default is json',
 *      'actionHandler' => 'function name',
 *      'handlerOption' => array( //for createOpsHandler function in qwp.js
 *          'quiet' => true|false default is false, if true, notice information won't come up,
 *          'reload' => true|false, default is false, if true, page will reload after request is successfully processed
 *      ),
 * );
 * You can add more handler and modify createFormValidation function in qwp.js
 */
function qwp_validate_form() {
    global $QWP_FORM_VALIDATOR_RULE, $QWP_SEARCH_FORM_VALIDATOR_RULE, $QWP_FILE_VALIDATOR_RULE;
    global $F, $S, $MODULE_ROOT;

    if (isset($QWP_FILE_VALIDATOR_RULE)) {
        return qwp_validate_file_for_file_validator();
    }
    if (!isset($QWP_FORM_VALIDATOR_RULE) && !isset($QWP_SEARCH_FORM_VALIDATOR_RULE)) {
        return true;
    }
    $form_rule = null;
    if (isset($QWP_FORM_VALIDATOR_RULE)) {
        require($MODULE_ROOT . '/form_' . $QWP_FORM_VALIDATOR_RULE . '_validator.php');
        $data = &$F;
    } else if (isset($QWP_SEARCH_FORM_VALIDATOR_RULE)) {
        require($MODULE_ROOT . '/form_' . $QWP_SEARCH_FORM_VALIDATOR_RULE . '_search.php');
        $data = &$S;
    } else {
      return true;
    }
    if (!$form_rule) {
        return true;
    }
    if (isset($form_rule['rules'])) $rules = &$form_rule['rules'];
    else $rules = &$form_rule;
    $tmp = qwp_validate_files($data, $form_rule, $rules);
    if ($tmp !== true) {
        return $tmp === false ? L('Invalid form data') : $tmp;
    }
    if (isset($form_rule['filters'])) {
        $filters = &$form_rule['filters'];
    } else {
        $filters = null;
    }

    return qwp_validate_data($data, $rules, $filters);
}
function qwp_get_rule_file_path($rule_name) {
    global $MODULE_ROOT;
    return $MODULE_ROOT . '/form_' . $rule_name . '_validator.php';
}
