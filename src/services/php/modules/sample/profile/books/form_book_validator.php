<?php
$form_rule = array(
    'name' => 'book',
    'rules' => array(
        'name' => array(
            'required' => true,
            'rangelength' => [1, 256],
            'op_edit' => 2, // not for this op
            'name' => '书名',
        ),
        'description' => array(
            'rangelength' => [1, 256],
            'name' => '描述',
        ),
        'tags' => array(
            'rangelength' => [3, 64],
            'name' => '标签',
        ),
    ),
);
