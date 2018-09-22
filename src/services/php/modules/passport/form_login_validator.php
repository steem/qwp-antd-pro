<?php
$form_rule = array(
    'cssSelector' => '#form-signin',
    'name' => 'login',
    'rules' => array(
        'user' => array(
            'required' => true,
            'alphanumeric' => true,
            'rangelength' => array(3, 32),
            'name' => '用户名',
        ),
        'pwd' => array(
            'required' => true,
            'rangelength' => array(6, 32),
            'password' => true,
            'name' => '密码',
        ),
    ),
);
