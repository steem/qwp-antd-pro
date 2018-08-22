<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

global $USER;

if (P('u')) {
    $avatar = C('avatar');
    if ($avatar) {
        set_content_type($avatar[3]);
        readfile($avatar[2]);
    }
} else {
    $id = P('id');
    $q = db_select_ex(array('sys_user', 'u'), array(
        array('id', $id ? $id : $USER->uid),
    ), array('u', array('avatar', 'avatar_type')));
    if (db_result_count($ret) > 0) {
        db_next_record($ret, $r);
        if ($r['avatar']) {
            set_content_type($r['avatar_type']);
            readfile($r['avatar']);
        }
    }
}