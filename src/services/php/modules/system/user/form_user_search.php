<?php
$form_rule = array(
    'name' => 'search',
    'rules' => array(
        'phone' => array(
            'rangelength' => [1, 16],
            'digits' => true,
        ),
        'age' => array(
            'digits' => true,
            'range' => [1, 200],
        ),
        'create_time' => array(
            'datetime' => true,
        ),
    ),
);
