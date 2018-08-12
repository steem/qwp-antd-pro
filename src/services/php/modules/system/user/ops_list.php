<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function set_avatar_condition(&$v) {
    return $v == '1' ? 'not null' : 'null';
}
function convert_search_data(&$s) {
    if (isset($s['name'])) {
        $s['u.name'] = $s['name'];
        unset($s['name']);
    }
    if (isset($s['create_time'])) {
        $s['create_time'] = datetime_to_int($s['create_time']);
    }
}
function convert_user(&$r) {
    $r['create_time'] = get_datetime_string($r['create_time']);
}
function list_users(&$msg, &$data) {
    get_user_data_modal($user_modal);
    $user_id = P('id');
    $options = array(
        'data modal' => $user_modal,
        'left join' => array(
            array('sys_role', 'r', 'r.id=u.role'),
        ),
        'where' => 'u.id<>1 and u.role<>1',
        'data converter' => 'convert_user',
    );
    if ($user_id) {
        $data = array();
        if ($user_id != '1' && is_digits($user_id)) {
            $options['where'] .= ' and u.id=' . $user_id;
            qwp_db_get_data(array('sys_user', 'u'), $data, null, $options);
        }
    } else {
        $options['default order'] = array('role', array('id', 'desc'));
        $options['search condition'] = array(
            'condition' => array(
                'fields' => array(
                    'u.name' => 'like',
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
