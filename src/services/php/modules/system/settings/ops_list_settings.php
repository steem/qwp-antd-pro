<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function list_settings(&$msg, &$data) {
    global $F;

}
qwp_set_data_process('list_settings');
qwp_set_form_validator('settings');
define('IN_MODULE', 1);
require_once(QWP_CORE_ROOT . '/tmpl_json_data.php');
