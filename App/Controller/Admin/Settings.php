<?php

namespace WLL\App\Controller\Admin;

use WLL\App\Helper\Guest;
use WLL\App\Helper\Input;
use WLL\App\Helper\Member;
use WLL\App\Helper\Util;
use WLL\App\Helper\Validation;
use WLL\App\Helper\WC;
use WLL\App\Helper\Settings as SettingsHelper;

defined( 'ABSPATH' ) or die;

class Settings {
	/**
	 * Get settings.
	 *
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
		$popup_button_settings = self::getLauncherButtonContentData( $is_admin_side );
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
					'image'   => SettingsHelper::opt( 'design.logo.image' ),
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

	/**
	 * Retrieves the data for the launcher button content.
	 *
	 * @param bool $is_admin_side Whether to display data for admin side.
	 *
	 * @return array Returns an array containing the launcher button content data.
	 */
	public static function getLauncherButtonContentData( $is_admin_side = false ) {
		$text_data = [
			'launcher' => [
				'appearance' => [
					'text' => SettingsHelper::opt( 'launcher.appearance.text', 'My Rewards', 'launcher_button' ),
					'icon' => [
						'selected' => SettingsHelper::opt( 'launcher.appearance.icon.selected', 'default', 'launcher_button' ),
					]
				],
			],
		];
		array_walk_recursive( $text_data, function ( &$value, $key ) use ( $is_admin_side ) {
			/*$is_admin_side = isset($is_admin_side) && is_bool($is_admin_side) && $is_admin_side;*/
			$value = ( ! $is_admin_side ) ? __( $value, 'wp-loyalty-rules' ) : $value;
		} );
		$data = [
			'launcher' => [
				'appearance'             => [
					'selected' => SettingsHelper::opt( 'launcher.appearance.selected', 'icon_with_text', 'launcher_button' ),
					'icon'     => [
						'image' => SettingsHelper::opt( 'launcher.appearance.icon.image', '', 'launcher_button' ),
						'icon'  => SettingsHelper::opt( 'launcher.appearance.icon.icon', 'gift', 'launcher_button' ),
					],
				],
				'placement'              => [
					'position'       => SettingsHelper::opt( 'launcher.placement.position', 'right', 'launcher_button' ),
					'side_spacing'   => SettingsHelper::opt( 'launcher.placement.side_spacing', 0, 'launcher_button' ),
					'bottom_spacing' => SettingsHelper::opt( 'launcher.placement.bottom_spacing', 0, 'launcher_button' ),
				],
				'view_option'            => SettingsHelper::opt( 'launcher.view_option', 'mobile_and_desktop', 'launcher_button' ),
				'font_family'            => SettingsHelper::opt( 'launcher.font_family', 'inherit', 'launcher_button' ),
				'show_conditions'        => SettingsHelper::opt( 'launcher.show_conditions', [], 'launcher_button' ),
				'condition_relationship' => SettingsHelper::opt( 'launcher.condition_relationship', "and", 'launcher_button' )
			]
		];

		return apply_filters( 'wll_launcher_popup_button_content_data', array_merge_recursive( $text_data, $data ) );
	}

	/**
	 * Save design settings.
	 *
	 * This method saves the design settings after validation.
	 *
	 * @return void
	 */
	public static function saveDesign() {
		if ( ! WC::isSecurityValid( 'wll_design_settings' ) ) {
			wp_send_json_error( [ 'message' => __( 'Basic check failed', 'wll-loyalty-launcher' ) ] );
		}
		$design = (string) Input::get( 'design' );
		if ( empty( $design ) ) {
			wp_send_json_error( [ 'message' => __( 'Settings not saved!', 'wll-loyalty-launcher' ) ] );
		}
		$design = json_decode( stripslashes( base64_decode( $design ) ), true );
		if ( empty( $design ) ) {
			wp_send_json_error( [ 'message' => __( 'Settings not saved!', 'wll-loyalty-launcher' ) ] );
		}
		// validation
		$validate_data = Validation::validateDesignTab( [ 'design' => $design ] );
		if ( is_array( $validate_data ) ) {
			foreach ( $validate_data as $key => $validate ) {
				$validate_data[ $key ] = [ current( $validate ) ];
			}
			wp_send_json_error( [
				'message'     => __( 'Settings not saved!', 'wll-loyalty-launcher' ),
				'field_error' => $validate_data
			] );
		}
		update_option( 'wll_launcher_design_settings', [ 'design' => $design ] );
		wp_send_json_success( [ 'message' => __( 'Settings saved!', 'wll-loyalty-launcher' ) ] );
	}

	public static function saveContent() {
		if ( ! WC::isSecurityValid( 'wll_content_settings' ) ) {
			wp_send_json_error( [ 'message' => __( 'Basic check failed', 'wll-loyalty-launcher' ) ] );
		}
		$content = (string) Input::get( 'content' );
		if ( empty( $content ) ) {
			wp_send_json_error( [ 'message' => __( 'Settings not saved!', 'wll-loyalty-launcher' ) ] );
		}
		$content = json_decode( stripslashes( base64_decode( $content ) ), true );
		if ( empty( $content ) ) {
			wp_send_json_error( [ 'message' => __( 'Settings not saved!', 'wll-loyalty-launcher' ) ] );
		}

		$validate_data = Validation::validateContentTab( [ 'content' => $content ] );
		if ( is_array( $validate_data ) ) {
			foreach ( $validate_data as $key => $validate ) {
				$validate_data[ $key ] = [ current( $validate ) ];
			}
			wp_send_json_error( [
				'message'     => __( 'Settings not saved!', 'wll-loyalty-launcher' ),
				'field_error' => $validate_data
			] );
		}
		update_option( 'wll_launcher_content_settings', [ 'content' => $content ] );
		wp_send_json_success( [ 'message' => __( 'Settings saved!', 'wll-loyalty-launcher' ) ] );
	}

	public static function saveLauncher() {
		if ( ! WC::isSecurityValid( 'wll_launcher_settings' ) ) {
			wp_send_json_error( [ 'message' => __( 'Basic check failed', 'wll-loyalty-launcher' ) ] );
		}
		$launcher = (string) Input::get( 'launcher' );
		if ( empty( $launcher ) ) {
			wp_send_json_error( [ 'message' => __( 'Settings not saved!', 'wll-loyalty-launcher' ) ] );
		}
		$launcher = json_decode( stripslashes( base64_decode( $launcher ) ), true );
		if ( empty( $launcher ) ) {
			wp_send_json_error( [ 'message' => __( 'Settings not saved!', 'wll-loyalty-launcher' ) ] );
		}
		$validate_data = Validation::validateLauncherTab( [ 'launcher' => $launcher ] );
		if ( is_array( $validate_data ) ) {
			foreach ( $validate_data as $key => $validate ) {
				$validate_data[ $key ] = [ current( $validate ) ];
			}
			wp_send_json_error( [
				'message'     => __( 'Settings not saved!', 'wll-loyalty-launcher' ),
				'field_error' => $validate_data
			] );
		}
		update_option( 'wll_launcher_icon_settings', [ 'launcher' => $launcher ] );
		wp_send_json_success( [ 'message' => __( 'Settings saved!', 'wll-loyalty-launcher' ) ] );
	}
}