<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function convert_search_data(&$s) {
    if (isset($s['create_time'])) {
        $s['create_time'] = datetime_to_int($s['create_time']);
    }
}
function convert_data(&$r) {
    $r['create_time'] = get_datetime_string($r['create_time']);
}
function list_books(&$msg, &$data) {
    get_book_data_modal($data_modal);
    $options = array(
        'data modal' => $data_modal,
        'data converter' => 'convert_data',
    );
    $options['default order'] = array(array('id', 'desc'));
    $options['search condition'] = array(
        'condition' => array(
            'fields' => array(
                'name' => 'like',
                'description' => 'like',
                'create_time' => '>=',
            ),
        ),
    );
    $options['search converter'] = 'convert_search_data';
    qwp_db_retrieve_data(array('tb_books', 'u'), $data, $options);
}
define('IN_MODULE', 1);
qwp_set_data_processor('list_books');
qwp_set_search_validator('book');
require_once(QWP_CORE_ROOT . '/tmpl_json_data.php');
