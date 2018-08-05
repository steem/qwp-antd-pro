<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function qwp_validate_login(&$msg, &$data) {
    $ret = db_select('sys_user', 'u')->fields('u', array('id', 'name', 'role', 'create_time'))
        ->condition('account', F('user'))
        ->condition('pwd', md5(F('pwd')))
        ->execute();
    if ($ret->rowCount() !== 1) {
        $msg = L('Password is not correct');
        return false;
    }
    $r = $ret->fetchAssoc();
    $data['topTo'] = qwp_get_dst_url();
    $user = new QWPUser(intval($r['id']), intval($r['role']),
        $r['name'], $r['name'], $r['name'], $r['create_time']);
    qwp_init_login($user);
    $data['loginType'] = P('type', '');
    $msg = L('Login successfully');
}
qwp_set_ops_process('qwp_validate_login');
qwp_set_form_validator('login');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');
