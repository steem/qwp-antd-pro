<?php
$form_rule = array(
    'name' => 'pwd',
    'rules' => array(
        'pwd1' => array(
            'required' => true,
            'password' => true,
            'rangelength' => [6, 32],
            'name' => '新密码',
        ),
        'pwd2' => array(
            'required' => true,
            'password' => true,
            'rangelength' => [6, 32],
            '=' => 'pwd1',
            'name' => '新密码确认',
        ),
    ),
);
