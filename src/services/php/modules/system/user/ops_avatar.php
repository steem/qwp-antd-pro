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
    $q = db_select('sys_user', 'u');
    $id = P('id');
    $q->fields('u', array('avatar', 'avatar_type'))->condition('id', $id ? $id : $USER->uid);
    $ret = $q->execute();
    if ($ret->rowCount() > 0) {
        $r = $ret->fetchAssoc();
        if ($r['avatar']) {
            set_content_type($r['avatar_type']);
            readfile($r['avatar']);
        }
    }
}