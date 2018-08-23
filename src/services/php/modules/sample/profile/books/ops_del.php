<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function delete_books(&$msg, &$data) {
    global $F;

    if (!get_joined_digits($F, $ids)) {
        return false;
    }
    db_delete_ex('tb_books', array('id', $ids, 'in'));
}
define('IN_MODULE', 1);
qwp_set_ops_process('delete_books');
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');