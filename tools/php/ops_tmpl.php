<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function ops_object(&$msg, &$data) {
    global $F;

}
qwp_set_ops_process('ops_object', true);
qwp_set_form_validator('object');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_ops.php');
