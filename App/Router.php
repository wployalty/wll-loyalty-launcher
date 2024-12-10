<?php

namespace WLL\App;

use WLL\App\Controller\Admin\Labels;
use WLL\App\Controller\Admin\Settings;
use WLL\App\Controller\Common;

defined( 'ABSPATH' ) or die;

class Router {
	public static function init() {
		if ( is_admin() ) {
			add_action( 'admin_menu', [ Common::class, 'addMenu' ] );
			add_action( 'admin_footer', [ Common::class, 'hideMenu' ] );
			add_action( 'admin_enqueue_scripts', [ Common::class, 'adminScripts' ], 100 );

			//common
			add_action( 'wp_ajax_wll_launcher_local_data', [ Labels::class, 'getLocalData' ] );
			add_action( 'wp_ajax_wll_get_launcher_labels', [ Labels::class, 'getLabels' ] );
			// setting
			add_action( 'wp_ajax_wll_launcher_settings', [ Settings::class, 'getSettings' ] );
		}
		add_filter( 'wlr_internal_addons_list', [ Common::class, 'addInternalAddons' ] );
	}
}