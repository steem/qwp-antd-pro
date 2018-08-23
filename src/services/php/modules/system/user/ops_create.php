<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function add_user(&$msg, &$data) {
    global $F, $DUP_RECORD_MSG;

    $DUP_RECORD_MSG = 'User account is duplicated, please use another account name';
    // just for demo of file upload
    if (isset($F['avatar']) && $F['avatar']) {
        $F['avatar_type'] = $F['avatar'][3];
        $F['avatar'] = $F['avatar'][2];
    }
    $F['create_time'] = time();
    if (isset($F['pwd']) && $F['pwd']) $F['pwd'] = md5($F['pwd']);
    else $F['pwd'] = md5(create_password());
    db_insert_ex('sys_user', $F);
    $msg = L('Create a new user successfully');
}
qwp_set_ops_process('add_user', true);
qwp_set_form_validator('user');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');
