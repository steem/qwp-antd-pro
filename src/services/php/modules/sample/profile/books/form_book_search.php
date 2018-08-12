<?php
$form_rule = array(
    'name' => 'search',
    'rules' => array(
        'name' => array(
            'rangelength' => [1, 256],
        ),
        'description' => array(
            'rangelength' => [1, 256],
        ),
        'create_time' => array(
            'date' => true,
        ),
    ),
);
