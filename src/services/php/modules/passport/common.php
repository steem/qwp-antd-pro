<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
function qwp_init_login(&$u) {
    global $USER;

    $USER = $u;
    CS('u', $USER);
    require_once(QWP_SECURITY_ROOT . '/security.php');
    qwp_init_security($acls);
}
function qwp_logout() {
    CS('u');
    CS('acls');
    CS('nav');
}