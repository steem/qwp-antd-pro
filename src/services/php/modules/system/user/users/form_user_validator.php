<?php
$form_rule = array(
//    'cssSelector' => '#form-signin',
    'name' => 'user',
    'rules' => array(
        // 'id' => array(
        //     'required' => true,
        //     'digits' => true,
        //     'op' => 'edit', // only for this op
        //     'ui' => false,
        // ),
        'account' => array(
            'required' => true,
            'rangelength' => [5, 32],
            'op_edit' => 2, // not for this op
            'name' => '账号',
        ),
        'pwd' => array(
            'required' => true,
            'password' => true,
            'op_edit' => 0, // 0 optional for this op, 1 required for this op
            'name' => '密码',
        ),
        'role' => array(
            'required' => true,
            'range' => [1, 2],
            'name' => '角色',
        ),
        'name' => array(
            'required' => true,
            'rangelength' => [6, 64],
            'name' => '姓名',
        ),
        'nick_name' => array(
            'rangelength' => [6, 128],
            'name' => '昵称',
        ),
        'phone' => array(
            'rangelength' => [6, 16],
            'digits' => true,
            'name' => '电话',
        ),
        'age' => array(
            'digits' => true,
            'range' => [1, 200],
            'name' => '年龄',
        ),
        'email' => array(
            'email' => true,
            'rangelength' => [8, 128],
            'name' => '邮箱',
        ),
        'address' => array(
            'rangelength' => [6, 128],
            'name' => '地址',
        ),
        'avatar' => array(
            'optional' => true,
            'name' => '头像',
        ),
    ),
    'files' => array(
        'avatar' => array('jpg,gif,png', '1024,204800000'),
    ),
/*    'actionMessage' => L('Login is in processing, please wait...'),
    'invalidHandler'  => 'loginInvalidHandler',
    'beforeSubmit' => 'loginBeforeSubmit',
    'actionHandler' => 'loginActionHandler',*/
);
