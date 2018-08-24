<?php
function db_create_connection($key) {
    global $databases, $mongos;

    $connection_options = $databases['default'][$key];
    $mogo_options = array();
    $dsn = 'mongodb://' . $connection_options['host'] . ':' . (empty($connection_options['port']) ? 27017 : $connection_options['port']);
    copy_from_wanted($mogo_options, $connection_options, array(
        'connect' => 1,
        'timeout' => 1,
        'replicaSet' => 1,
        'username' => 1,
        'password' => 1,
    ));
    if (isset($connection_options['database']) && $connection_options['database']) {
        $mogo_options['db'] = $connection_options['database'];
    }
    $mongos[$key] = new MongoClient($dsn, $mogo_options);
}

function db_get_db_connection($key = null) {
    global $mongos, $mogo_active_key;

    if (!$key) $key = $mogo_active_key;
    if (!$key) {
        $key = 'default';
        db_set_active($key);
    }
    if (!isset($mongos)) $mongos = array();
    if (!isset($mongos[$key])) db_create_connection($key);

    return $mongos[$key];
}

function db_set_active($key) {
    global $mogo_active_key, $mongo_active_database, $databases;

    $mogo_active_key = $key;
    $mongo_active_database = $databases['default'][$key]['database'];
}

function db_remove_active($key = null) {
    global $mongos, $mogo_active_key;

    if (!$key) $mogo_active_key = $key;
    if (isset($mongos[$key]) && $mongos[$key]) {
        unset($mongos[$key]);
    }
}

function db_result_count(&$ret) {
  return $ret->count(true);
}

function _mongo_result_check_id(&$r) {
    if (isset($r['_id'])) {
        $r['id'] = (string)$r['_id'];
        unset($r['_id']);
    }
}

function db_next_record(&$ret, &$r) {
    if (!$ret || !$ret->hasNext()) return false;
    $r = $ret->next();
    _mongo_result_check_id($r);

    return true;
}

function db_get_version() {
    return db_get_db_connection()->selectDB('admin')->command('function () { return db.version(); }');
}

function db_parse_order_by(&$sort, &$order_by) {
    $sort = array();
    if (!$order_by) return;
    if (is_string($order_by)) {
        $sort[$order_by] = 1;
        return;
    }
    if (!is_array($order_by)) {
        return;
    }
    foreach($order_by as &$item) {
        if (is_string($item)) {
            $sort[$item] = 1;
        } else {
            $sort[$item[0]] = $item[1] === 'desc' ? -1 : 1;
        }
    }
}
function db_set_inc(&$incs, &$ori) {
    $incs = array();
    if (!$ori) return;
    if (is_string($ori)) {
        $tmp = explode(',', $fields);
        foreach ($tmp as &$k) {
            if (!$k) continue;
            $incs[$k] = 1;
        }
        return;
    }
    foreach ($ori as $key => &$item) {
        if (is_int($key)) {
            $incs[$key] = 1;
        } else {
            $incs[$key] = $item;
        }
    }
}
function db_set_fields(&$query_fields, &$fields) {
    $query_fields = array();
    if (!$fields) return;
    if (!$fields || $fields === '*') return;
    if (is_string($fields)) {
        $tmp = explode(',', $fields);
        foreach ($tmp as &$k) {
            $query_fields[$k] = true;
        }
    } else if (isset($fields[0]) && is_string($fields[0])) {
        if (is_array($fields[1])) $tmp = &$fields[1];
        else $tmp = &$fields;
        foreach ($tmp as &$k) {
            $query_fields[$k] = true;
        }
    } else {
        // compatibility for sql
        foreach ($fields as $table_alias => $field) {
            db_set_fields($query_fields, $field);
            break;
        }
    }
}
function db_add_condition(&$conditions, &$con, $or = false) {
    $field = &$con[0];
    $value = &$con[1];
    if ($or) $c = array();
    else $c = &$conditions;
    $field_con = null;
    if (count($con) === 3) $field_con = $con[2];
    if ($field === 'id') {
        $field = '_id';
        if (is_string($value)) $value = explode(',', $value);
        if (is_array($value) && count($value) > 1) {
            for ($i = 0, $cnt = count($value); $i < $cnt; ++$i) {
                $value[$i] = new MongoId($value[$i]);
            }
        } else {
            $value = new MongoId($value[0]);
        }
    }
    if (is_array($value)) {
        if ($field_con == 'in') {
            $c[$field] = array('$in' => $value);
        } else if ($field_con == '[]') {
            $c[$field] = array('$gte' => $value[0], '$lte' => $value[1]);
        } else if ($field_con == '(]') {
            $c[$field] = array('$gt' => $value[0], '$lte' => $value[1]);
        } else if ($field_con == '[)') {
            $c[$field] = array('$gte' => $value[0], '$lt' => $value[1]);
        } else if ($field_con == '()') {
            $c[$field] = array('$gt' => $value[0], '$lt' => $value[1]);
        }
    } else if ($field_con == 'like') {
        $c[$field]['$regex'] = '.*' . $value . '.*';
    } else if ($field_con == 'null') {
        $c[$field] = null;
    } else if ($field_con == 'not null') {
        $c[$field]['$ne'] = null;
    } else if ($field_con == '<>') {
        $c[$field]['$ne'] = $value;
    } else if ($field_con == '>=') {
        $c[$field]['$gte'] = $value;
    } else if ($field_con == '>') {
        $c[$field]['$gte'] = $value;
    } else if ($field_con == '<=') {
        $c[$field]['$lte'] = $value;
    } else if ($field_con == '<') {
        $c[$field]['$lt'] = $value;
    } else {
        $c[$field] = $value;
    }
    if ($or) $conditions[] = $c;
}
function db_set_condition(&$conditions, &$cons, $or = false) {
    $conditions = array();
    if (count($cons) === 0) return;
    if (is_string($cons[0])) {
        db_add_condition($conditions, $cons, $or);
        return;
    }
    foreach ($cons as &$item) {
        if ($item[0] === '$or') {
            db_set_condition($obj, $item[1], true);
            if (count($obj) > 0) $conditions['$or'] = $obj;
        } else if ($item[0] === '$where') {
            if ($or) $conditions[] = array('$where' => $item[1]);
            else $conditions['$where'] = $item[1];
        } else {
            db_add_condition($conditions, $item, $or);
        }
    }
}

function _mongo_select_ex($table_name, $condition, $fields, $order_by = null) {
    global $mongo_active_database;

    if (is_array($table_name)) $table_name = $table_name[0];
    $cursor = db_get_db_connection()->selectCollection($mongo_active_database, $table_name)->find($condition, $fields);
    if (!$cursor) return false;
    db_parse_order_by($sort, $order_by);
    if (count($sort) > 0) $cursor->sort($sort);

    return $cursor;
}

function db_select_ex($table_name, $condition = null, $fields = null, $order_by = null) {
    global $mongo_active_database;

    if (is_array($table_name)) $table_name = $table_name[0];
    db_set_condition($cons, $condition);
    db_set_fields($query_fields, $fields);
    $cursor = db_get_db_connection()->selectCollection($mongo_active_database, $table_name)->find($cons, $query_fields);
    if (!$cursor) return false;
    db_parse_order_by($sort, $order_by);
    if (count($sort) > 0) $cursor->sort($sort);

    return $cursor;
}

function db_select_one($table_name, $condition = null, $fields = null) {
    global $mongo_active_database;

    if (is_array($table_name)) $table_name = $table_name[0];
    db_set_condition($cons, $condition);
    db_set_fields($query_fields, $fields);
    $r = db_get_db_connection()->selectCollection($mongo_active_database, $table_name)->findOne($cons, $query_fields);
    if ($r) {
        _mongo_result_check_id($r);
        return $r;
    }
    return false;
}

function db_delete_ex($table_name, $condition = null) {
    global $mongo_active_database;

    if (is_array($table_name)) $table_name = $table_name[0];
    db_set_condition($cons, $condition);
    return db_get_db_connection()->selectCollection($mongo_active_database, $table_name)->remove($cons);
}

function db_insert_ex($table_name, &$doc) {
    global $mongo_active_database;

    return db_get_db_connection()->selectCollection($mongo_active_database, $table_name)->insert($doc);
}
function db_update_ex($table_name, &$doc, $condition = null, $incs = null) {
    global $mongo_active_database;

    db_set_condition($cons, $condition);
    $new_data = array('$set' => &$doc);
    db_set_inc($tmp_inc, $incs);
    if (count($tmp_inc) > 0) {
        $new_data['$inc'] = $tmp_inc;
    }
    $options = array(
        'multiple' => true,
    );
    $ret = db_get_db_connection()->selectCollection($mongo_active_database, $table_name)->update($cons, $new_data, $options);
    if (!$ret || !$ret['ok']) return false;
    return $ret['nModified'];
}
function db_batch_insert($table_name, $docs) {
    global $mongo_active_database;

    $batch = new MongoInsertBatch(db_get_db_connection()->selectCollection($mongo_active_database, $table_name));
    foreach($docs as $doc) {
        $batch->add($doc);
    }
    $ret = $batch->execute(array("w" => 1));
    if (!$ret) return false;
    if (!isset($ret['ok']) || !$ret['ok']) return 0;

    return $ret['nInserted'];
}
