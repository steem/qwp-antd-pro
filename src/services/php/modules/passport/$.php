<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
$acls = C('acls', array());
$app_settings = array(
    'acls' => isset($acls['modules']) ? $acls['modules'] : array(),
    'default' => DEFAULT_MODULE_AFTER_LOGIN,
    'headerNav' => QWP_ENABLE_HEADER_NAV ? qwp_get_header_nav_after_login() : array(),
);
global $USER;
$app_settings['user'] = array(
    'id' => $USER->uid,
    'account' => $USER->account,
    'name' => $USER->name,
    'role' => $USER->role,
    'roleName' => $USER->role_name,
    'avatar' => 'user.png',
    'createTime' => $USER->create_time ? $USER->create_time : '--',
    'isLogined' => $USER->is_logined,
);
qwp_render_app_settings($app_settings);
