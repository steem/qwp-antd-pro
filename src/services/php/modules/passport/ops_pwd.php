<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function edit_pwd(&$msg, &$data) {
    global $F;
    
    $pwd = array(
        'pwd' => $F['pwd1'],
    );
    db_update_ex('sys_user', $pwd, array(
        array('id', qwp_get_logined_user_id()),
        array('editable', 'y')
    ));
    $msg = L('修改密码成功');
}
qwp_set_ops_process('edit_pwd', true);
qwp_set_form_validator('pwd');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');