<?php
$form_rule = array(
    'name' => 'book',
    'rules' => array(
        'name' => array(
            'required' => true,
            'rangelength' => [1, 256],
            'op_edit' => 2, // not for this op
        ),
        'description' => array(
            'rangelength' => [1, 256],
        ),
        'tags' => array(
            'rangelength' => [3, 64],
        ),
    ),
);
