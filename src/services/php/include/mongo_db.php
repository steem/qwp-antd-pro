<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
require_once(DRUPAL_DB_ROOT . '/mongo.php');

global $QWP_ACTIVE_DB;
$QWP_ACTIVE_DB = "mongo";
if (isset($QWP_ACTIVE_DB)) {
    db_set_active($QWP_ACTIVE_DB);
}
function qwp_db_try_connect_db() {
    try {
        db_get_version();
    } catch (MongoConnectionException $e) {
        log_db_exception($e, "try_connect_db");
        db_remove_active();
    }
}
function qwp_db_has_record($table_name, $conditions = null) {
    $cursor = db_select($table_name, $conditions);

    return $cursor->hasNext();
}
function qwp_db_records_count($table_name, $conditions = null) {
    $cursor = db_select($table_name, $conditions);

    return $cursor->count();
}
function qwp_db_get_one_record($table_name, $fields = null, $conditions = null) {
    return db_select_one($table_name, $conditions, $fields);
}
function qwp_db_get_fields_from_modal(&$modal, &$fields) {
    $fields = array();
    foreach ($modal as $idx => &$item) {
        if ($idx === 'alias' || !isset($item['table'])) {
            continue;
        }
        $table = $item['table'];
        if (!isset($fields[$table])) {
            $fields[$table] = array();
        }
        foreach ($item as $k => $v) {
            if ($k === 'table' || $k === 'group') {
                continue;
            } else if (is_string($v)) {
                $v = trim($v, ',');
                if (strpos($v, ',') !== false) {
                    $fields[$table] = array_merge($fields[$table], explode(',', $v));
                } else {
                    $fields[$table][] = $v;
                }
            } else if ($v[0]) {
                $fields[$table][] = $v[0];
            }
        }
    }
}
function qwp_db_get_table_header_from_modal(&$modal, &$header) {
    $header = array(
        'names' => array(),
    );
    $groups = array();
    $has_alias = isset($modal['alias']);
    if ($has_alias) {
        $header['fields'] = array();
    }
    foreach ($modal as $idx => &$item) {
        if ($idx === 'alias') {
            continue;
        }
        $table = isset($item['table']) ? $item['table'] : '';
        $is_complex_arr = false;
        $group_fields = array();
        $group_name = false;
        foreach ($item as $k => $v) {
            if ($k === 'table') {
                continue;
            }
            if ($k === 'group') {
                $group_name = $v[0];
                $groups[$group_name] = array($v[1]);
                continue;
            }
            $is_string = is_string($v);
            if ($is_string && ($table || $is_complex_arr)) continue;
            if ($is_string) $v = $item;
            if (count($v) == 1) continue;
            if ($has_alias) {
                $ak = $table . '.' . $v[0];
                $header['fields'][] = $ak;
                if ($has_alias) $group_fields[] = $ak;
                if (isset($modal['alias'][$ak])) {
                    $v[0] = $modal['alias'][$ak];
                }
            } else {
                $group_fields[] = $v[0];
            }
            $header['names'][] = $v;
            if ($is_string) break;
            if (!$is_complex_arr) $is_complex_arr = !$is_string;
        }
        if ($group_name) $groups[$group_name][] = $group_fields;
    }
    if (count($groups) > 0) $header['group'] = $groups;
}
function qwp_db_set_search_condition_internal(&$field_values, &$query, &$allow_empty, &$field_conditions) {
    $op = "and";
    if (isset($field_conditions["op"])) {
        $op = $field_conditions["op"];
    }
    if ($op == "or") {
        $obj = array();
    } else {
        $obj = &$query;
    }
    if (isset($field_conditions["condition"])) {
        qwp_db_set_search_condition_internal($field_values, $obj, $allow_empty, $field_conditions["condition"]);
    }
    $has_fields = false;
    if (isset($field_conditions["fields"])) {
        foreach ($field_conditions["fields"] as $field => &$field_con) {
            if (!isset($field_values[$field])) {
                continue;
            }
            $value = $field_values[$field];
            unset($field_values[$field]);
            $is_empty = $value === '';
            if ($is_empty && !isset($allow_empty[$field])) {
                continue;
            }
            $has_fields = true;
            if (is_array($value)) {
                if ($field_con == 'in') {
                    $query[$field] = array('$in' => $value);
                } else if ($field_con == '[]') {
                    $query[$field] = array('$gte' => $value[0], '$lte' => $value[1]);
                } else if ($field_con == '(]') {
                    $query[$field] = array('$gt' => $value[0], '$lte' => $value[1]);
                } else if ($field_con == '[)') {
                    $query[$field] = array('$gte' => $value[0], '$lt' => $value[1]);
                } else if ($field_con == '()') {
                    $query[$field] = array('$gt' => $value[0], '$lt' => $value[1]);
                }
            } else if ($field_con == 'like') {
                $query[$field]['$regex'] = $value;
            } else if ($field_con == 'null') {
                $query[$field] = null;
            } else if ($field_con == 'not null') {
                $query[$field]['$ne'] = null;
            } else {
                if (is_array($field_con) && isset($field_con[$value])) {
                    $fn_con = $field_con[$value];
                    if (is_array($fn_con) && !isset($fn_con['where'])) {
                        $value = $fn_con[1];
                        $fn_con = $fn_con[0];
                    }
                } else if (is_string($field_con) && function_exists($field_con)) {
                    $fn_con = $field_con;
                } else {
                    $fn_con = null;
                }
                if ($fn_con && is_string($fn_con) && function_exists($fn_con)) {
                    $fn_con = $fn_con($value);
                }
                if ($fn_con === 'null') {
                    $query[$field] = null;
                } else if ($fn_con === 'not null') {
                    $query[$field]['$ne'] = null;
                } else if (is_string($field_con)) {
                    $query[$field][$field_con] = $value;
                } else {
                    $query[$field] = $value;
                }
            }
        }
    }
    if ($op == "or") {
        if ($has_fields) {
            $query['$or'] = $obj;
        } else {
            unset($obj);
        }
    }
}
function qwp_db_set_search_condition(&$query, &$field_values, &$field_conditions) {
    $allow_empty = array();
    if ($field_conditions) {
        if (isset($field_conditions["allow empty"])) {
            $allow_empty = $field_conditions["allow empty"];
        }
        qwp_db_set_search_condition_internal($field_values, $query, $allow_empty, $field_conditions);
    }
    foreach ($field_values as $field => $value) {
        if ($value === '' && !isset($allow_empty[$field])) {
            continue;
        }
        if (is_array($value)) {
            $query[$field] = array('$gte' => $value[0], '$lte' => $value[1]);
        } else {
            $query[$field] = $value;
        }
    }
}
function qwp_db_set_fields(&$query_fields, &$table, &$fields, &$options) {
    if (is_string($fields)) {
        $tmp = explode(',', $fields);
        foreach ($tmp as &$k) {
            $query_fields[$k] = true;
        }
    } else {
        $query_fields = fields;
    }
}
/*
$table_name -> string or array
$fields -> * or string or array
$options -> array(
    'left join' => array(), optional
    'order by' => array(), optional
    'default order' => array(), optional, if oder by is set, it will be ignored
    'group by' => ,string optional
    'where' => string, optional
    'search condition' => array(
        'values' => array() optional
        'condition' => array( optional
            'op' => 'or' or 'and', optional, default is 'and',
            'fields' => array(
                for field search condition,
            ),
            'condition' => optional, for recursive condition
        )
    ),
    'alias' => array(
        $k => $v
    )
)*/
function qwp_create_query(&$query, $table_name, &$fields, &$options = null) {
    $conditions = array();
    $query_fields = array();
    db_set_fields($query_fields, $fields);
    if ($options) {
        // if (isset($options['left join'])) {
        //     foreach($options['left join'] as &$join) {
        //         $query->leftJoin($join[0], $join[1], $join[2]);
        //     }
        // }
        // if (isset($options['inner join'])) {
        //     foreach($options['inner join'] as &$join) {
        //         $query->innerJoin($join[0], $join[1], $join[2]);
        //     }
        // }
        if (isset($options['where']) && is_array($options['where'])) {
            $conditions = array_merge($conditions, $options['where']);
        }
        if (isset($options['search condition'])) {
            if (isset($options['search condition']['values']) && count($options['search condition']['values']) > 0) {
                $field_conditions = null;
                if (isset($options['search condition']['condition'])) {
                    $field_conditions = &$options['search condition']['condition'];
                }
                qwp_db_set_search_condition($conditions, $options['search condition']['values'], $field_conditions);
            }
        }
    }
    if (is_string($table_name)) {
        // if (isset($options['group by'])) {
        //     if(isset($options['group count'])){
        //         $query->addExpression("count(1)", $options['group count']);
        //     }
        //     if(isset($options['group sum'])){
        //         $query->addExpression("SUM(".$options['group sum'].")", $options['group sum']);
        //     }
        //     $query->groupBy($options['group by']);
        // }
        $query = db_select($table_name, $conditions, $query_fields);
    } else {
        return;
    }
    if ($options) {
        if (isset($options['order by']) && $options['order by']) {
            db_parse_order_by($sort, $options['order by']);
            if (count($sort) > 0) $query->sort($sort);
        }
        if (isset($options['limits']) && $options['limits']) {
            if (is_array($options['limits'])) {
                $query->skip($options['limits'][0]);
                $query->limit($options['limits'][1]);
            } else {
                $query->limit($options['limits']);
            }
        }
    }
}
function qwp_db_set_pager(&$query, $total) {
    $page = P('page');
    if ($page === null) $page = P('currentPage');
    if (!$page) {
        $page = 1;
    } else {
        $page = intval($page);
        if ($page <= 0) $page = 1;
    }
    $page_size = P('psize');
    if (!$page_size) $page_size = P('pageSize', 30);
    if (!$page_size || $page_size < 0) {
        $page_size = 30;
    }
    if ($page_size > 200) $page_size = 200;
    $total_page = ceil($total / $page_size);
    if ($page > $total_page && P('cpage', true)) $page = $total_page;
    $page_start = ($page - 1) * $page_size;
    $query->skip($page_start);
    $query->limit($page_size);
    return $page;
}
function qwp_db_init_order_by(&$options) {
    $f1 = array('sortf', 'sorter', 'sortField');
    $sort_field = PA($f1);
    if ($sort_field) {
        $f2 = array('sort', 'order', 'sortOrder');
        $sort = PA($f2);
        if ($sort === 'ascend') $sort = 'asc';
        else if ($sort === 'descend') $sort = 'desc';
        $sort = array(
            array($sort_field, $sort)
        );
        if (isset($options['order by'])) {
            $options['order by'] = array_merge($sort, $options['order by']);
        } else {
            $options['order by'] = $sort;
        }
    } else if (isset($options['default order'])) {
        $options['order by'] = $options['default order'];
        unset($options['default order']);
    }
}
function qwp_db_init_search_params(&$options) {
    global $S;
    if (!count($S)) {
        return;
    }
    $tmp_search = array();
    foreach ($S as $k => $v) {
        $tmp_search[$k] = $v;
    }
    if (isset($options['search validator'])) {
        require_once(QWP_CORE_ROOT . '/validator.php');
        $tmp_v = null;
        qwp_validate_data($tmp_search, $options['search validator'], $tmp_v, true);
    }
    if (isset($options['search converter'])) {
        $options['search converter']($tmp_search);
    }
    if (!isset($options['search condition'])) {
        $options['search condition'] = array();
    }
    if (isset($options['search condition']['values'])) {
        copy_from($options['search condition']['values'], $tmp_search);
    } else {
        $options['search condition']['values'] = $tmp_search;
    }
}
function qwp_db_retrieve_data($table_name, &$data, &$options)
{
    if (isset($options['data modal'])) {
        qwp_db_get_fields_from_modal($options['data modal'], $fields);
    } else {
        $fields = $options['fields'];
    }
    qwp_db_init_order_by($options);
    qwp_db_init_search_params($options);
    qwp_create_query($query, $table_name, $fields, $options);
    $enable_pager = P('enable_pager', true, $options);
    $total = $query->count();
    if (!is_array($data)) $data = array();
    if (isset($data["data"])) {
        $data["total"] = $total + count($data["data"]);
    } else {
        $data["total"] = $total;
        $data["data"] = array();
    }
    if (!$enable_pager || ($enable_pager && $total > 0)) {
        if ($enable_pager) {
            $data['page'] = qwp_db_set_pager($query, $total);
        }
        if (isset($options['data converter'])) {
            $data_converter = $options['data converter'];
            foreach ($query as &$r) {
                _mongo_result_check_id($r);
                $data_converter($r);
                $data["data"][] = $r;
            }
        } else {
            foreach ($query as &$r) {
                _mongo_result_check_id($r);
                $data["data"][] = $r;
            }
        }
        if (!$enable_pager) $data["total"] = count($data["data"]);
    }
}
// if $options is string, it will be treated as where
function qwp_db_get_data($table_name, &$data, $fields, &$options = null) {
    if (!$options) {
        $options = array();
    }
    if (is_string($options)) {
        $options = array(
            'where' => $options
        );
    }
    if (!$fields) {
        qwp_db_get_fields_from_modal($options['data modal'], $fields);
    }
    if (isset($options['data modal'])) {
        if (isset($options['data modal']['alias'])) {
            if (isset($options['alias'])) {
                copy_from($options['alias'], $options['data modal']['alias']);
            } else {
                $options['alias'] = $options['data modal']['alias'];
            }
        }
    }
    $data = array();
    qwp_db_init_order_by($options);
    qwp_db_init_search_params($options);
    qwp_create_query($query, $table_name, $fields, $options);
    $data = array();
    if ($query->count(true) > 0) {
        $is_flat = isset($options['flat']);
        if (isset($options['data converter'])) {
            $data_converter = $options['data converter'];
            foreach ($query as $r) {
                _mongo_result_check_id($r);
                $data_converter($r);
                if ($is_flat) {
                    $data[] = $r[$fields];
                } else {
                    $data[] = $r;
                }
            }
        } else {
            foreach ($query as &$r) {
                _mongo_result_check_id($r);
                if ($is_flat) {
                    $data[] = $r[$fields];
                } else {
                    $data[] = $r;
                }
            }
        }
    }
}
