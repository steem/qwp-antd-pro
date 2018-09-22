<?php
$form_rule = array(
    'name' => 'search',
    'rules' => array(
        'phone' => array(
            'rangelength' => [1, 16],
            'digits' => true,
            'name' => '电话',
        ),
        'age' => array(
            'digits' => true,
            'range' => [1, 200],
            'name' => '年龄',
        ),
        'create_time' => array(
            'date' => true,
            'name' => '创建时间',
        ),
        'account' => array(
            'rangelength' => [1, 64],
            'name' => '账号',
        ),
        'name' => array(
            'rangelength' => [1, 64],
            'name' => '姓名',
        ),
    ),
);
