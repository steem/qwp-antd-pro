<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function modify_pwd(&$msg, &$data) {
    if (!qwp_is_logined()) return false;
    $f = array(
        'pwd' => md5(F('pwd')),
    );
    db_update_ex('sys_user', $f, array(
        array('id', qwp_get_logined_user_id()),
        array('pwd', md5(F('old_pwd')))
    ));
    $msg = L('Modify password successfully');
}
qwp_set_ops_process('modify_pwd');
qwp_set_form_validator('modify_pwd');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');