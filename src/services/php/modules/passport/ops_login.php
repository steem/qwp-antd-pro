<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function qwp_validate_login(&$msg, &$data) {
    $ret = db_select_ex(array('sys_user', 'u'), array(
        array('account', F('user')),
        array('pwd', md5(F('pwd'))),
    ), array('u', array('id', 'name', 'role', 'create_time')));
    if (db_result_count($ret) !== 1) {
        $msg = L('Password is not correct');
        return false;
    }
    db_next_record($ret, $r);
    $data['topTo'] = qwp_get_dst_url();
    $user = new QWPUser($r['id'], intval($r['role']),
        $r['name'], $r['name'], $r['name'], isset($r['create_time']) ? $r['create_time'] : 0);
    qwp_init_login($user);
    $data['loginType'] = P('type', '');
    $msg = L('Login successfully');
}
qwp_set_ops_process('qwp_validate_login');
qwp_set_form_validator('login');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');
