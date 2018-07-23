<?php

add_action( 'init', 'register_menus' );

function register_menus() {
    register_nav_menus([
        'header-menu' => __('Header Menu'),
        'footer-menu' => __('Footer Menu')
    ]);
}