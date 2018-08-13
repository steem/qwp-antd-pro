<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function edit_book(&$msg, &$data) {
    global $F;

    $id = P('id');
    if (!is_digits($id)) {
        return false;
    }
    if (isset($F['tags']) && !is_array($F['tags'])) {
        return false;
    }
    $F['tags'] = isset($F['tags']) && $F['tags'] ? to_json($F['tags']) : '';
    db_update('tb_books')->fields($F)->condition('id', $id)->execute();
}
qwp_set_ops_process('edit_book', true);
qwp_set_form_validator('book', 'edit');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');