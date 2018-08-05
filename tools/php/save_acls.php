<?php
define('CUR_ROOT', dirname(__FILE__));
define('PROJECT_ROOT', dirname(dirname(CUR_ROOT)));
define('QWP_ROOT', PROJECT_ROOT . '/src/services/php');
require_once(QWP_ROOT . '/config.php');
require_once(QWP_INC_ROOT . '/common.php');
require_once(QWP_INC_ROOT . '/db.php');

function save_acls_to_db($clear = false) {
    require_once(QWP_SECURITY_ROOT . '/predefined_acls.php');
    require_once(QWP_SECURITY_ROOT . '/predefined_ops.php');

    get_predefined_acls($modules);
    get_predefined_ops($ops);
    if ($clear) {
        db_delete('sys_modules')->execute();
        db_query('ALTER TABLE sys_modules AUTO_INCREMENT=1');
    }
    foreach ($modules as $path => $item) {
        if (qwp_db_has_record('sys_modules', "path='$path'")) continue;
        $f = array(
            'name' => $item['name'],
            'path' => $path,
            'icon' => isset($item['icon']) ? $item['icon'] : '',
            'page' => isset($item['page']) && $item['page'] ? 'y' : 'n',
            'type' => 'm',
            'seq' => '1',
            'public' => $item['public'] ? 'y' : 'n',
        );
        $id = db_insert('sys_modules')->fields($f)->execute();
    }
    foreach ($ops as $path => $items) {
        foreach ($items as $name => $item) {
            $op_path = $path . QWP_MODULE_SEP . $name;
            if (qwp_db_has_record('sys_modules', "path='$op_path'")) continue;
            $f = array(
                'name' => $name,
                'path' => $op_path,
                'icon' => '',
                'page' => 'n',
                'type' => 'op',
                'public' => $item['public'] ? 'y' : 'n',
            );
            $id = db_insert('sys_modules')->fields($f)->execute();
        }
    }
    echo_line('Finished');
}

save_acls_to_db();
