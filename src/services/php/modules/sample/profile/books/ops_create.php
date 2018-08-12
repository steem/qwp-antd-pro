<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function add_book(&$msg, &$data) {
    global $F;

    if (isset($F['tags']) && !is_array($F['tags'])) {
        return false;
    }
    $F['create_time'] = time();
    $F['tags'] = isset($F['tags']) ? to_json($F['tags']) : '';
    db_insert('tb_books')->fields($F)->execute();
}
qwp_set_ops_process('add_book', true);
qwp_set_form_validator('book');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');
