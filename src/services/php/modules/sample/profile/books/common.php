<?php
if(!defined('QWP_ROOT')){exit('Invalid Request');}

function get_book_data_modal(&$modal) {
    $modal = array(
        array(
            'table' => 'u',
            array('name', 'Name', '10', true),
            array('tags', 'Tags', '30'),
            array('create_time', 'Create time', '10', true),
            array('description', 'Description', '12'),
            array('', '', '10', false, 'operation'),
            'id',
        ),
    );
}
