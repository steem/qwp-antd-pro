<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function list_object(&$msg, &$data) {

}
define('IN_MODULE', 1);
qwp_set_data_processor('list_object');
qwp_set_search_validator('object');
require_once(QWP_CORE_ROOT . '/tmpl_json_data.php');
