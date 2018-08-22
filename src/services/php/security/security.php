<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

// template function, you need to modify it if you want to use
/*
privilege structure:
$acls = array(
    'modules' => array(
        'sample' => 'Samples',
        'sample-sub' => 1,
        'sample-sub-sub' => 1,
    ),
    'pages' => array(
        'sample' => array(
            'form' => 'Form sample',
            'table' => 'Table sample',
        ),
        'sample-sub' => array(
            'test' => 1,
        ),
    ),
    'ops' => array(
        'sample#form' => array(
            'edit' => 1,
        ),
        'sample#table' => array(
            'list' => 1,
            'get_types' => 1,
        ),
        'users' => array(
            'list' => 1,
            'add' => 1,
            'edit' => 1,
            'del' => 1,
        ),
    ),
);
*/
function qwp_scan_acls_in_directory(&$modules, &$pages, &$ops, $dir, $level, $parent, $add_module = true) {
  $files = scandir($dir);
  foreach ($files as $item) {
      if (is_dot_dir($item)) continue;
      $file_path = join_paths($dir, $item);
      if (is_dir($file_path)) {
          if ($level === 0 && $item === 'passport') continue;
          $new_parent = $parent . ($parent && $parent != QWP_MODULE_SEP ? QWP_MODULE_SEP : '') . $item;
          if ($add_module) $modules[$new_parent] = $item;
          qwp_scan_acls_in_directory($modules, $pages, $ops, $file_path, $level + 1, $new_parent, $add_module);
      } else if ($level !== 0) {
          if (!ends_with($item, '.php') || starts_with($item, 'home') ||
              starts_with($item, 'form_') || starts_with($item, 'common.')) continue;
          $dots = explode('.', $item);
          if (count($dots) !== 2) continue;
          // remove .php
          $item = substr($item, 0, strlen($item) - 4);
          $is_op = strrpos($item, 'ops_');
          if ($is_op === 0) {
              // module ops
              if (!isset($ops[$parent])) $ops[$parent] = array();
              $op_name = substr($item, 4);
              $ops[$parent][$op_name] = $op_name;
          } else if ($is_op !== false) {
              // page ops
              $op_name = substr($item, $is_op + 4);
              $page_key = $parent . '#' . substr($item, 0, $is_op - 1);
              if (!isset($ops[$page_key])) $ops[$page_key] = array();
              $ops[$page_key][$op_name] = $op_name;
          } else {
              // page
              if (!isset($pages[$parent])) $pages[$parent] = array();
              $pages[$parent][$item] = $item;
          }
      }
  }
}
function qwp_get_all_acls_in_directory(&$acls) {
    $acls['modules'] = array();
    $acls['pages'] = array();
    $acls['ops'] = array();
    $modules = &$acls['modules'];
    $pages = &$acls['pages'];
    $ops = &$acls['ops'];
    if (QWP_JUST_SERVICE) {
        require_once(QWP_SECURITY_ROOT . '/predefined_acls.php');
        require_once(QWP_SECURITY_ROOT . '/predefined_ops.php');
        get_predefined_acls($modules);
        get_predefined_ops($ops);
    } else {
        qwp_scan_acls_in_directory($modules, $pages, $ops, QWP_MODULE_ROOT, 0, '');
    }
    ksort($modules, SORT_STRING);
    ksort($pages, SORT_STRING);
    ksort($ops, SORT_STRING);
}
function qwp_get_user_acls(&$acls) {
    if (IN_DEBUG_ADMIN && qwp_is_admin_user()) {
        qwp_get_all_acls_in_directory($acls);
        return;
    }
    global $USER;

    $conditions = array(
        array('enabled', 'y'),
    );
    if (qwp_is_guest_user()) {
        $conditions[] = array('public', 'y');
    } else if (!qwp_is_admin_user()) {
        $module_ids = db_select_ex(array('sys_role_modules', 'r'), array(array('role_id', $USER->role)), array('r', array('module_id')));
        $ids = array();
        while (db_next_record($module_ids, $r)) {
          $ids[] = $r['module_id'];
        }
        $conditions[] = array(
            '$or', array(
                array('id', $ids, 'in'),
                array('public', 'y'),
            )
        );
    }
    $order_by = array(
        array('path', 'asc'),
        array('seq', 'asc'),
    );
    $ret = db_select_ex(array('sys_modules', 'm'), $conditions,
        array('m', array('name', 'path', 'icon', 'type', 'page')), $order_by);
    $acls['modules'] = array();
    $acls['pages'] = array();
    $acls['ops'] = array();
    $modules = &$acls['modules'];
    $pages = &$acls['pages'];
    $ops = &$acls['ops'];
    while (db_next_record($ret, $r)) {
        if ($r['type'] === 'm') {
            $modules[$r['path']] = array(
                'name' => $r['name'],
                'icon' => $r['icon'],
                'page' => $r['page'] === 'y' ? true : false,
            );
        } else if ($r['type'] === 'p') {
            $path = explode(QWP_MODULE_SEP, $r['path']);
            $identity = $path[count($path) - 1];
            array_pop($path);
            $path = implode(QWP_MODULE_SEP, $path);
            if (!isset($pages[$path])) $pages[$path] = array();
            $pages[$path][$identity] = array(
                'name' => $r['name'],
                'icon' => $r['icon'],
            );
        } else if ($r['type'] === 'op') {
            $path = explode(QWP_MODULE_SEP, $r['path']);
            $identity = $path[count($path) - 1];
            array_pop($path);
            $path = implode(QWP_MODULE_SEP, $path);
            if (!isset($ops[$path])) $ops[$path] = array();
            $ops[$path][$identity] = array(
                'name' => $r['name'],
            );
        }
    }
}
function qwp_init_nav_modules(&$acls) {
    $modules = array();
    $sub_modules = array();
    $all_modules = &$acls['modules'];
    $left_modules = array();
    foreach($all_modules as $m => $desc) {
        $arr = explode(QWP_MODULE_SEP, $m);
        $level = count($arr);
        if ($level === 1) {
            if (file_exists(join_paths(QWP_MODULE_ROOT, $m, 'home.php'))) {
                $modules[$m] = $desc;
            } else {
                $left_modules[$m] = $desc;
            }
        } else if ($level === 2) {
            if (isset($left_modules[$arr[0]]) && file_exists(join_paths(QWP_MODULE_ROOT, implode('/', $arr), 'home.php'))) {
                // select the first module
                $modules[$m] = $left_modules[$arr[0]];
                unset($left_modules[$arr[0]]);
            }
            if (!isset($sub_modules[$arr[0]])) $sub_modules[$arr[0]] = array();
            $sub_modules[$arr[0]][$m] = array('desc' => $desc);
        } else if ($level === 3) {
            if (isset($left_modules[$arr[0]]) && file_exists(join_paths(QWP_MODULE_ROOT, implode('/', $arr), 'home.php'))) {
                // select the first module
                $modules[$m] = $left_modules[$arr[0]];
                unset($left_modules[$arr[0]]);
            }
            $parent = $arr[0] . QWP_MODULE_SEP . $arr[1];
            if (!isset($sub_modules[$arr[0]][$parent]['sub'])) $sub_modules[$arr[0]][$parent]['sub'] = array();
            $sub_modules[$arr[0]][$parent]['sub'][] = array($m, $desc);
        }
    }
    $modules = array_reverse($modules);
    CS('nav', $modules);
    CS('sub_nav', $sub_modules);
}
function qwp_has_sub_modules() {
    global $MODULE;

    $nav = C('sub_nav', array());
    return isset($nav[$MODULE[0]]);
}
// template function, you need to modify it if you want to use
function qwp_init_security(&$acls) {
    $acls = array();
    qwp_get_user_acls($acls);
    CS('acls', $acls);
    if (!QWP_JUST_SERVICE) {
        qwp_init_nav_modules($acls);
    }
}
function qwp_doing_security_check() {
    global $MODULE_URI, $PAGE, $OP, $IS_APP_SETTING_REQ;

    $acls = C('acls', null);
    if (!$acls) {
        qwp_init_security($acls);
    }
    if (qwp_is_passport_module()) {
        return true;
    }
    $uri = QWP_JUST_SERVICE ? QWP_MODULE_SEP . $MODULE_URI : $MODULE_URI;
    if (!isset($acls['modules'][$uri])) {
        return false;
    }
    if ($OP) {
        if ($PAGE) {
            $uri .= QWP_MODULE_SEP . $PAGE;
        }
        return isset($acls['ops'][$uri]) && ($IS_APP_SETTING_REQ || isset($acls['ops'][$uri][$OP]));
    }
    if ($PAGE) {
        return isset($acls['pages'][$uri]) && isset($acls['pages'][$uri][$PAGE]);
    }
    log_info('security check is passed: ' . $uri);
}
