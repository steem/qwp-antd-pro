<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function edit_user(&$msg, &$data) {
    global $F;
    $id = P('id');
    if (!$id || $id == '1') {
        return false;
    }
    // just for demo of file upload
    if (isset($F['avatar']) && $F['avatar']) {
        $F['avatar_type'] = $F['avatar'][3];
        $F['avatar'] = $F['avatar'][2];
    }
    if (isset($F['pwd']) && !$F['pwd']) unset($F['pwd']);
    else $F['pwd'] = md5($F['pwd']);
    if (isset($F['account'])) unset($F['account']);
    db_update_ex('sys_user', $F, array(
        array('id', $id),
        array('editable', 'y')
    ));
}
qwp_set_ops_process('edit_user', true);
qwp_set_form_validator('user', 'edit');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');