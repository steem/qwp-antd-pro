<?php
function get_predefined_ops(&$ops) {
    $ops = array(
        '/sample/exception' => array(
              'list' => array('name' => 'list', 'public' => true),
         ),
        '/sample/profile/books' => array(
              'create' => array('name' => 'create', 'public' => true),
              'del' => array('name' => 'del', 'public' => true),
              'edit' => array('name' => 'edit', 'public' => true),
              'list' => array('name' => 'list', 'public' => true),
         ),
        '/system/settings' => array(
              'create_settings' => array('name' => 'create_settings', 'public' => true),
              'del_settings' => array('name' => 'del_settings', 'public' => true),
              'list_settings' => array('name' => 'list_settings', 'public' => true),
              'save_settings' => array('name' => 'save_settings', 'public' => true),
              'update_settings' => array('name' => 'update_settings', 'public' => true),
         ),
        '/system/user' => array(
              'avatar' => array('name' => 'avatar', 'public' => true),
              'create' => array('name' => 'create', 'public' => true),
              'del' => array('name' => 'del', 'public' => true),
              'edit' => array('name' => 'edit', 'public' => true),
              'list' => array('name' => 'list', 'public' => true),
              'upload_avatar' => array('name' => 'upload_avatar', 'public' => true),
         ),

    );
}
