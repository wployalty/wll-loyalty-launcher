<?php
/**
 * Plugin Name: WPLoyalty - Launcher
 * Plugin URI: https://www.wployalty.net
 * Description: Launcher widget for WPLoyalty. Let your customers easily discover your loyalty rewards.
 * Version: 1.0.0
 * Author: Wployalty
 * Slug: wll-loyalty-launcher
 * Text Domain: wll-loyalty-launcher
 * Domain Path: /i18n/languages/
 * Requires Plugins: woocommerce
 * Requires at least: 4.9.0
 * WC requires at least: 6.5
 * WC tested up to: 9.4
 * Author URI: https://wployalty.net/
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

use Automattic\WooCommerce\Utilities\FeaturesUtil;
use WLL\App\Helper\Plugin;
use WLL\App\Router;
use WLL\App\Setup;

defined( 'ABSPATH' ) or die;

add_action( 'before_woocommerce_init', function () {
	if ( class_exists( FeaturesUtil::class ) ) {
		FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__ );
	}
} );
if ( ! function_exists( 'isWLLLoyaltyActive' ) ) {
	function isWLLLoyaltyActive() {
		$active_plugins = apply_filters( 'active_plugins', get_option( 'active_plugins', [] ) );
		if ( is_multisite() ) {
			$active_plugins = array_merge( $active_plugins, get_site_option( 'active_sitewide_plugins', [] ) );
		}

		return in_array( 'wp-loyalty-rules/wp-loyalty-rules.php', $active_plugins ) || array_key_exists( 'wp-loyalty-rules/wp-loyalty-rules.php', $active_plugins )
		       || in_array( 'wployalty/wp-loyalty-rules-lite.php', $active_plugins ) || array_key_exists( 'wployalty/wp-loyalty-rules-lite.php', $active_plugins );
	}
}
if ( ! isWLLLoyaltyActive() ) {
	return;
}

defined( 'WLL_PLUGIN_NAME' ) or define( 'WLL_PLUGIN_NAME', 'WPLoyalty - Launcher' );
defined( 'WLL_MINIMUM_PHP_VERSION' ) or define( 'WLL_MINIMUM_PHP_VERSION', '7.4.0' );
defined( 'WLL_MINIMUM_WP_VERSION' ) or define( 'WLL_MINIMUM_WP_VERSION', '4.9' );
defined( 'WLL_MINIMUM_WC_VERSION' ) or define( 'WLL_MINIMUM_WC_VERSION', '6.0' );
defined( 'WLL_MINIMUM_WLR_VERSION' ) or define( 'WLL_MINIMUM_WLR_VERSION', '1.3.0' );
defined( 'WLL_PLUGIN_VERSION' ) or define( 'WLL_PLUGIN_VERSION', '1.0.0' );
defined( 'WLL_PLUGIN_SLUG' ) or define( 'WLL_PLUGIN_SLUG', 'wll-loyalty-launcher' );
defined( 'WLL_PLUGIN_FILE' ) or define( 'WLL_PLUGIN_FILE', __FILE__ );
defined( 'WLL_PLUGIN_DIR' ) or define( 'WLL_PLUGIN_DIR', str_replace( '\\', '/', __DIR__ ) );
defined( 'WLL_PLUGIN_PATH' ) or define( 'WLL_PLUGIN_PATH', str_replace( '\\', '/', __DIR__ ) . '/' );
defined( 'WLL_PLUGIN_URL' ) or define( 'WLL_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

if ( ! file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	return;
}
if ( ! class_exists( Plugin::class ) ) {
	// Autoload the vendor
	require_once __DIR__ . '/vendor/autoload.php';
}
add_action( 'plugins_loaded', function () {
	if ( class_exists( Router::class ) && class_exists( \Wlr\App\Router::class ) ) {
		Setup::init();
		if ( Plugin::checkDependencies() ) {
			Router::init();
		}
	}
} );