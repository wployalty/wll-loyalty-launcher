<?php

namespace WLL\App\Controller;

use WLL\App\Helper\Input;
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

	/**
	 * Loads necessary admin scripts and styles.
	 *
	 * This method enqueues required scripts and styles for the admin area. It removes unwanted actions,
	 * enqueues specific stylesheets and scripts, loads JavaScript files, and localizes data for the scripts.
	 *
	 * @return void
	 */
	public static function adminScripts() {
		if ( Input::get( 'page' ) != WLL_PLUGIN_SLUG ) {
			return;
		}
		$suffix = '.min';
		if ( defined( 'SCRIPT_DEBUG' ) ) {
			$suffix = SCRIPT_DEBUG ? '' : '.min';
		}
		// Remove other actions
		array_map( 'remove_all_actions', apply_filters( 'wll_remove_other_plugin_enqueue_actions', [
			'admin_head',
			'admin_enqueue_scripts'
		] ) );
		// remove admin notice
		remove_all_actions( 'admin_notices' );
		// media library for launcher icon image
		wp_enqueue_media();
		wp_enqueue_style( WLL_PLUGIN_SLUG . '-wlr-font', WLR_PLUGIN_URL . 'Assets/Site/Css/wlr-fonts' . $suffix . '.css', [], WLR_PLUGIN_VERSION . '&t=' . time() );
		wp_enqueue_style( WLR_PLUGIN_SLUG . '-alertify', WLR_PLUGIN_URL . 'Assets/Admin/Css/alertify.css', [], WLR_PLUGIN_VERSION );
		wp_enqueue_script( WLR_PLUGIN_SLUG . '-alertify', WLR_PLUGIN_URL . 'Assets/Admin/Js/alertify.js', [ 'jquery' ], WLR_PLUGIN_VERSION . '&t=' . time() );
		$common_path   = WLL_PLUGIN_DIR . '/assets/admin/js/dist';
		$js_files      = WC::getDirFileLists( $common_path );
		$localize_name = '';
		foreach ( $js_files as $file ) {
			$path         = str_replace( WLL_PLUGIN_PATH, '', $file );
			$js_file_name = str_replace( $common_path . '/', '', $file );
			$js_name      = WLL_PLUGIN_SLUG . '-react-ui-' . substr( $js_file_name, 0, - 3 );
			$js_file_url  = WLL_PLUGIN_URL . $path;
			if ( $js_file_name == 'main.bundle.js' ) {
				$localize_name = $js_name;
				wp_register_script( $js_name, $js_file_url, [ 'jquery' ], WLL_PLUGIN_VERSION . '&t=' . time() );
				wp_enqueue_script( $js_name );
			}
		}

		//register the scripts
		$localize_data = [
			'ajax_url'            => admin_url( 'admin-ajax.php' ),
			//nonce
			'reset_setting_nonce' => wp_create_nonce( 'reset_settings' ),
			'local_data_nonce'    => wp_create_nonce( 'local_data' ),
			'render_page_nonce'   => wp_create_nonce( 'render_page_nonce' ),
		];
		wp_localize_script( $localize_name, 'wll_settings_form', $localize_data );
	}

	/**
	 * Adds internal addons to the provided list of addons.
	 *
	 * This method adds internal addons to the list of addons passed as a parameter. It checks for a specific addon,
	 * updates the addon list accordingly, and then adds a new internal addon to the list.
	 *
	 * @param array $add_ons An array containing the list of addons.
	 *
	 * @return array The updated list of addons with internal addons added.
	 */
	public static function addInternalAddons( $add_ons ) {
		if ( ! empty( $add_ons['wp-loyalty-launcher'] ) ) {
			unset( $add_ons['wp-loyalty-launcher'] );
			update_option( 'wll_is_launcher_plugin_activated', true );
		}
		$add_ons['wll-loyalty-launcher'] = [
			'name'         => esc_html__( 'WPLoyalty - Launcher', 'wp-loyalty-rules' ),
			'description'  => __( 'Launcher widget for WPLoyalty. Let your customers easily discover your loyalty rewards.', 'wp-loyalty-rules' ),
			'icon_url'     => \Wlr\App\Helpers\Util::getImageUrl( 'wp-loyalty-launcher' ),
			'page_url'     => '',
			'document_url' => '',
			'is_external'  => true,
			'is_pro'       => false,
			'dependencies' => []
		];

		return $add_ons;
	}
}