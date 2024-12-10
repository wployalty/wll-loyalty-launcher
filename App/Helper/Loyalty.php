<?php

namespace WLL\App\Helper;

use Wlr\App\Models\Users;

defined( 'ABSPATH' ) || exit;

class Loyalty {
	/**
	 * Retrieves the label for a given point value.
	 *
	 * @param int $point The point value to retrieve the label for.
	 * @param bool $label_translate Whether to translate the label. Default is true.
	 *
	 * @return string The label for the specified point value.
	 */
	public static function getPointLabel( $point, $label_translate = true ) {
		$settings = get_option( 'wlr_settings', [] );
		$singular = ! empty( $settings['wlr_point_singular_label'] ) ? $settings['wlr_point_singular_label'] : 'point';
		if ( $label_translate ) {
			$singular = __( $singular, 'wp-loyalty-rules' );
		}
		$plural = ! empty( $settings['wlr_point_label'] ) ? $settings['wlr_point_label'] : 'points';
		if ( $label_translate ) {
			$plural = __( $plural, 'wp-loyalty-rules' );
		}
		$point_label = ( $point == 0 || $point > 1 ) ? $plural : $singular;

		return apply_filters( 'wlr_get_point_label', $point_label, $point );
	}

	public static function getUserPoint( string $user_email ) {
		if ( empty( $user_email ) ) {
			return 0;
		}
		$user = self::getLoyaltyUserByEmail( $user_email );

		return ! empty( $user ) ? $user->points : 0;
	}

	public static function getLoyaltyUserByEmail( string $user_email ) {
		if ( empty( $user_email ) ) {
			return '';
		}
		$user_model = new Users();
		global $wpdb;
		$query = $wpdb->prepare( "user_email = %s", sanitize_email( $user_email ) );

		return $user_model->getWhere( $query );
	}

	public static function getUserDetails() {
		$user_email = self::getLoginUserEmail();
		if ( empty( $user_email ) ) {
			return new \stdClass();
		}
		$customer_page = new \Wlr\App\Controllers\Site\CustomerPage();

		return $customer_page->getPageUserDetails( $user_email, 'launcher' );
	}

	public static function getLoginUserEmail() {
		$login_user = self::getLoginUser();

		return ! empty( $login_user ) ? $login_user->user_email : '';
	}

	public static function getLoginUser() {
		return function_exists( wp_get_current_user() ) ? wp_get_current_user() : false;
	}

	public static function getReferralUrl( $code = '' ) {
		if ( empty( $code ) ) {
			$user_email = self::getLoginUserEmail();
			$user       = self::getLoyaltyUserByEmail( $user_email );
			$code       = ! empty( $user ) && ! empty( $user->refer_code ) ? $user->refer_code : '';
		}
		$url = '';
		if ( ! empty( $code ) ) {
			$url = site_url() . '?wlr_ref=' . $code;
		}

		return apply_filters( 'wlr_get_referral_url', $url, $code );
	}

	public static function getSocialIconList( $user_email, $url ) {
		if ( empty( $user_email ) || empty( $url ) ) {
			return [];
		}
		$customer_page      = new \Wlr\App\Controllers\Site\CustomerPage();
		$social_share_lists = $customer_page->getSocialShareList( $user_email, $url );
		$social_icon_list   = [];
		foreach ( $social_share_lists as $key => &$social_share_list ) {
			$social_icon_list[] = array_merge( $social_share_list, [ 'action_type' => $key ] );
		}

		return $social_icon_list;
	}

	public static function isPro() {
		return apply_filters( 'wlr_is_pro', false );
	}
}