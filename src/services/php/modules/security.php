<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}
// you can delete this line to implement your own security check
require_once(QWP_ROOT . '/security/security.php');

// return false to indicate failed to check security
// you need to modify it
function qwp_custom_security_check() {
    return qwp_doing_security_check();
}
