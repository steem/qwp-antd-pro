<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
if(!defined('QWP_ROOT')){exit('Invalid Request');}

define('QWP_ROLE_VISITOR', 0);
define('QWP_ROLE_ADMIN', 1);
define('QWP_ROLE_OPERATOR',2);
define('QWP_ROLE_OBSERVER',3);

class QWPUser {
    public $uid;
    public $account;
    public $name;
    public $role;
    public $role_name;
    public $login_time;
    public $last_access_time;
    public $create_time;
    public $is_logined;

    function QWPUser($id, $role, $account, $name, $role_name, $create_time) {
        $this->uid = $id;
        $this->role = $role;
        $this->account = $account;
        $this->name = $name;
        $this->role_name = $role_name;
        $this->login_time = time();
        $this->last_access_time = $this->login_time;
        $this->create_time = $create_time;
        $this->is_logined = $role !== QWP_ROLE_VISITOR;
    }
    function update_access_time() {
        $this->last_access_time = time();
    }
}
function qwp_create_visitor_user() {
    global $USER;

    $name = L('Visitor');
    $USER = new QWPUser(0, QWP_ROLE_VISITOR, '', $name, $name, get_current_datetime_string());
}
function qwp_get_logined_user_id() {
    global $USER;

    return $USER->uid;
}
function qwp_get_logined_user_role() {
    global $USER;

    return $USER->role;
}
function qwp_echo_user_name() {
    global $USER;
    echo($USER->name);
}
function qwp_is_guest_user() {
  global $USER;
  return !$USER || $USER->role === QWP_ROLE_VISITOR;
}
function qwp_is_admin_user() {
    global $USER;
    return $USER->role === QWP_ROLE_ADMIN;
}
