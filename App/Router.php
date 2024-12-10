<?php

namespace WLL\App;
defined( 'ABSPATH' ) or die;

class Router {
	public static function init() {
		if ( is_admin() ) {
			add_action( 'admin_init', [] );
		}
	}
}