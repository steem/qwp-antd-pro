<?php
function get_predefined_ops(&$ops) {
    $ops = array(
        '/sample/exception' => array(
              'list' => array('name' => 'list', 'public' => true),
         ),
        '/sample/profile/books' => array(
              'create' => array('name' => 'create', 'public' => false),
              'del' => array('name' => 'del', 'public' => false),
              'edit' => array('name' => 'edit', 'public' => false),
              'list' => array('name' => 'list', 'public' => false),
         ),
        '/system/settings' => array(
              'create_settings' => array('name' => 'create_settings', 'public' => false),
              'del_settings' => array('name' => 'del_settings', 'public' => false),
              'list_settings' => array('name' => 'list_settings', 'public' => false),
              'save_settings' => array('name' => 'save_settings', 'public' => false),
              'update_settings' => array('name' => 'update_settings', 'public' => false),
         ),
        '/system/user/users' => array(
              'avatar' => array('name' => 'avatar', 'public' => false),
              'create' => array('name' => 'create', 'public' => false),
              'del' => array('name' => 'del', 'public' => false),
              'edit' => array('name' => 'edit', 'public' => false),
              'list' => array('name' => 'list', 'public' => false),
              'upload_avatar' => array('name' => 'upload_avatar', 'public' => false),
         ),

    );
}
