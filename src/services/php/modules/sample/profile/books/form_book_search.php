<?php
$form_rule = array(
    'name' => 'search',
    'rules' => array(
        'name' => array(
            'rangelength' => [1, 256],
            'name' => '书名',
        ),
        'description' => array(
            'rangelength' => [1, 256],
            'name' => '描述',
        ),
        'create_time' => array(
            'date' => true,
            'name' => '创建时间',
        ),
    ),
);
