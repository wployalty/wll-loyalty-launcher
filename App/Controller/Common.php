<?php

namespace WLL\App\Controller;

use WLL\App\Helper\WC;

defined( 'ABSPATH' ) or die;

class Common {
	/**
	 * Add admin menu.
	 *
	 * @return void
	 */
	public static function addMenu() {
		if ( WC::hasAdminPrivilege() ) {
			add_menu_page(
				WLL_PLUGIN_NAME, WLL_PLUGIN_NAME, 'manage_woocommerce', WLL_PLUGIN_SLUG, [
				self::class,
				'displayMenuContent'
			], 'dashicons-megaphone', 57
			);
		}
	}

	/**
	 * Hide add-on menu.
	 *
	 * @return void
	 */
	public static function hideMenu() {
		?>
        <style>
            #toplevel_page_wll-loyalty-launcher {
                display: none !important;
            }
        </style>
		<?php
	}

	/**
	 * Display menu content.
	 *
	 * @return void
	 */
	public static function displayMenuContent() {
		if ( ! WC::hasAdminPrivilege() ) {
			return;
		}
		$params = apply_filters( 'wll_before_launcher_admin_page', [] );
		wc_get_template( 'main.php', $params, WLL_PLUGIN_SLUG, WLL_PLUGIN_DIR . '/App/View/Admin/' );
	}
}