<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function get_user_data_modal(&$modal) {
    $modal = array(
        array(
            'table' => 'u',
            array('name', 'Name', '10', true, true),
            array('', 'Detail', '10', false, 'detail'),
            array('phone', 'Phone', '20', true),
            array('email', 'Email', '20', true),
            array('address', 'Address', '22', true),
            array('create_time', 'CreateTime', '20'),
            array('', '', '20', false, 'operation'),
            'id,nick_name,age,gender,account,role,avatar_type',
        ),
    );
}
