<?php

namespace WLL\App\Controller\Admin;

use WLL\App\Helper\Guest;
use WLL\App\Helper\Member;
use WLL\App\Helper\Util;
use WLL\App\Helper\WC;
use WLL\App\Helper\Settings as SettingsHelper;

defined( 'ABSPATH' ) or die;

class Settings {
	/**
	 * @return void
	 */
	public static function getSettings() {
		if ( ! WC::isSecurityValid( 'wll_launcher_settings' ) ) {
			wp_send_json_error( [ 'message' => __( 'Basic check failed', 'wll-loyalty-launcher' ) ] );
		}
		$is_admin_side = Util::isAdminSite();
		//design
		$design_settings = self::getDesignSettings();
		//content admin side not translated values fetch
		$guest_content    = Guest::getGuestContentData( $is_admin_side );
		$member_content   = Member::getMemberContentData( $is_admin_side );
		$content_settings = [ 'content' => array_merge( $guest_content, $member_content ) ];
		//popup button
		$popup_button_settings = \WLL\App\Helper\Settings::getLauncherButtonContentData( $is_admin_side );
		wp_send_json_success( array_merge( $design_settings, $content_settings, $popup_button_settings ) );
	}

	/**
	 * Retrieves the design settings for the launcher.
	 *
	 * @return array
	 */
	public static function getDesignSettings() {
		$theme_color = SettingsHelper::get( 'theme_color', 'loyalty', '#6F38C5' );

		return (array) apply_filters( 'wll_launcher_design_content_data', [
			'design' => [
				'logo'     => [
					'is_show' => SettingsHelper::opt( 'design.logo.is_show', 'show' ),
					'image'   => SettingsHelper::opt( 'design.logo.image', '' ),
				],
				'colors'   => [
					'theme'   => [
						'primary' => SettingsHelper::opt( 'design.colors.theme.primary', $theme_color ),
						'text'    => SettingsHelper::opt( 'design.colors.theme.text', 'white' ),
					],
					'buttons' => [
						'background' => SettingsHelper::opt( 'design.colors.buttons.background', '#FF6B00' ),
						'text'       => SettingsHelper::opt( 'design.colors.buttons.text', 'white' ),
					],
				],
				'branding' => [
					'is_show' => SettingsHelper::opt( 'design.branding.is_show', 'none' ),
				]
			]
		] );
	}
}