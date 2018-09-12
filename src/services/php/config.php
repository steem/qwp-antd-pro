<?php
define('CONTENT_CHARSET', 'utf-8');
define('DB_CHARSET', 'utf-8');
define('DEFAULT_LANGUAGE', 'zhCN');
define('IN_DEBUG', true);
define('ENABLE_LOGGER', false);
define('IN_DEBUG_ADMIN', true);
// you can change the default module
define('DEFAULT_MODULE', 'portal');
define('DEFAULT_MODULE_AFTER_LOGIN', 'sample');
define('QWP_SESSION_PREFIX', 'qwp');
define('QWP_SESSION_TIMEOUT', true);
define('QWP_LOG_DIR', '/tmp/qwp');
define('QWP_ROUTER_ROOT', QWP_ROOT . '/router');
define('QWP_CORE_ROOT', QWP_ROOT . '/core');
define('QWP_MODULE_ROOT', QWP_ROOT . '/modules');
define('QWP_PASSPORT_ROOT', QWP_MODULE_ROOT . '/passport');
define('QWP_SECURITY_ROOT', QWP_ROOT . '/security');
define('QWP_INC_ROOT', QWP_ROOT . '/include');
define('QWP_COMMON_ROOT', QWP_ROOT . '/common');
define('QWP_UI_ROOT', QWP_ROOT . '/ui');
define('QWP_TEMPLATE_ROOT', QWP_ROOT . '/template');
define('QWP_LANG_ROOT', QWP_ROOT . '/lang');
define('QWP_SHOW_INVALID_FORM_VALUE', true);
define('QWP_DB_ROOT', QWP_INC_ROOT . '/database');
define('QWP_OPS_RET', 'success');
define('QWP_OPS_MSG', 'message');
define('QWP_OPS_MSG_TYPE', 'type');
define('QWP_PRODUCT_VERSION', '2');
define('QWP_MODULE_SEP', '/');
define('QWP_JUST_SERVICE', true);
define('QWP_APP_SETTINGS_OP', '$');
define('QWP_ENABLE_HEADER_NAV', true);
define('QWP_PACK_ALL_LANG', false);

define('QWP_CLIENT_UI_ROOT', QWP_ROOT . '/../ui');
define('PRODUCT_NAME_LONG', 'productLongName');
define('PRODUCT_NAME', 'productName');
define('PRODUCT_NAME_SHORT', 'productShortName');
define('COMPANY_NAME', 'compayName');

function get_module_icon($name, $default = null) {
  static $module_icons = array(

  );
  return isset($module_icons[$name]) ? $module_icons[$name] : $default;
}

function qwp_get_footer() {
    return array(
        "links" => array(
            array(
                "key" => 'Pro 首页',
                "title" => 'Pro 首页',
                "href" => 'http://pro.ant.design',
            ),
            array(
                "key" => 'github',
                "icon" => 'github',
                "href" => 'https://github.com/ant-design/ant-design-pro',
            ),
            array(
                "key" => 'Ant Design',
                "title" => 'Ant Design',
                "href" => 'http://ant.design',
            ),
        ),
        "copyright" => '2018 QWP, INC.',
    );
}

function qwp_get_default_header_nav() {
    return array();
    /*return array(
        array(
            'name' => 'portal',
            'icon' => 'laptop',
            'path' => '/portal',
        ),
    );*/
}

function qwp_get_header_nav_after_login() {
    return array();
    /*return array_merge(qwp_get_default_header_nav(), array(
        array(
            'name' => 'test',
            'icon' => 'laptop',
            'path' => '/test',
        ),
    ));*/
}

$active_db = 'default';
// database settings
$databases['default']['default'] = array (
    'database' => 'antd',
    'username' => 'root',
    'password' => '',
    'host' => 'localhost',
    'port' => '',
    'driver' => 'mysql',
    'prefix' => '',
);
