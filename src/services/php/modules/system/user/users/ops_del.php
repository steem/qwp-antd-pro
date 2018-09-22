<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function delete_user(&$msg, &$data) {
    global $F;

    if (!get_joined_digits($F, $ids)) {
        return false;
    }
    db_delete_ex('sys_user', array(
        array('id', $ids, 'in'),
        array('editable', 'y'),
    ));
}
define('IN_MODULE', 1);
qwp_set_ops_process('delete_user');
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');