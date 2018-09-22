<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function set_avatar_condition(&$v) {
    return $v == '1' ? 'not null' : 'null';
}
function convert_search_data(&$s) {
    if (isset($s['name'])) {
        $s['account'] = $s['name'];
    }
    if (isset($s['create_time'])) {
        $s['create_time'] = date_to_int($s['create_time']);
    }
}
function convert_user(&$r) {
    if (isset($r['create_time'])) $r['create_time'] = get_datetime_string($r['create_time']);
}
function list_users(&$msg, &$data) {
    global $S;

    get_user_data_modal($user_modal);
    $user_id = P('id');
    $options = array(
        'data modal' => $user_modal,
        'data converter' => 'convert_user',
    );
    $S['editable'] = 'y';
    if ($user_id) {
        $data = array();
        $S['id'] = $user_id;
        qwp_db_get_data(array('sys_user', 'u'), $data, null, $options);
    } else {
        $options['default order'] = array('role', array('create_time', 'desc'));
        $options['search condition'] = array(
            'condition' => array(
                'fields' => array(
                    'name' => 'like',
                    'account' => 'like',
                    'avatar' => 'set_avatar_condition',
                    'gender' => array('s' => array('<>', 'x')),
                    'create_time' => '>=',
                ),
                'condition' => array(
                    'op' => 'or',
                    'fields' => array(
                        'phone' => 'like',
                        'account' => 'like',
                        'email' => 'like',
                        'name' => 'like',
                    ),
                )
            ),
        );
        $options['search converter'] = 'convert_search_data';
        qwp_db_retrieve_data(array('sys_user', 'u'), $data, $options);
    }
}
define('IN_MODULE', 1);
qwp_set_data_processor('list_users');
qwp_set_search_validator('user');
require_once(QWP_CORE_ROOT . '/tmpl_json_data.php');
