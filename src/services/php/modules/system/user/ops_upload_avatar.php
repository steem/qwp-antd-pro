<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function upload_avatar(&$msg, &$data) {
    global $F, $USER, $_FILES;

    $file_name = $USER->uid . '_' . random_string();
    $avatar_info = save_uploaded_file('avatar', $file_name);
    qwp_set_upload_file_result($data, $avatar_info);
    if (!$avatar_info) {
        CS('avatar');
        return false;
    }
    $old_avatar = C('avatar');
    if ($old_avatar) {
        safe_unlink($old_avatar[2]);
    }
    CS('avatar', $avatar_info);
}
define('IN_MODULE', 1);
qwp_set_ops_process('upload_avatar');
qwp_set_file_validator('user');
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');