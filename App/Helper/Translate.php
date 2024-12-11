<?php

namespace WLL\App\Helper;

defined( 'ABSPATH' ) || exit;

class Translate {
	public static function getGuestDynamicStrings( &$new_strings ) {
		$content          = Settings::getSettings( 'content' );//saved data
		$d_guest          = [ 'content' => Guest::getGuestContentData( true ) ];
		$guest_input_data = [
			'content.guest.welcome.texts.title',
			'content.guest.welcome.texts.description',
			'content.guest.welcome.texts.have_account',
			'content.guest.welcome.texts.sign_in',
			'content.guest.welcome.button.text',
			'content.guest.points.earn.title',
			'content.guest.points.redeem.title',
			'content.guest.referrals.title',
			'content.guest.referrals.description',
		];
		foreach ( $guest_input_data as $g_key ) {
			$string = self::getString( $g_key, $d_guest, $content );
			if ( ! empty( $string ) ) {
				$new_strings[] = $string;
			}
		}
	}

	public static function getString( $key, $default, $saved ) {
		if ( strpos( $key, "." ) !== false ) {
			$identifiers = explode( ".", $key );//splitting keys for sub array values
			$value       = Settings::getOptValue( $saved, $identifiers );
			if ( empty( $value ) ) {
				$value = Settings::getOptValue( $default, $identifiers );
			}
		}

		return ( ! empty( $value ) ) ? $value : '';
	}

	public static function getMemberDynamicStrings( &$new_strings ) {
		$content = Settings::getSettings( 'content' );//saved data

		$d_member          = [ 'content' => Member::getMemberContentData( true ) ];
		$member_input_data = [
			'content.member.banner.texts.welcome',
			'content.member.banner.texts.points',
			'content.member.banner.texts.points_label',
			'content.member.banner.texts.points_content',
			'content.member.banner.texts.points_text',
			'content.member.points.earn.title',
			'content.member.points.redeem.title',
			'content.member.referrals.title',
			'content.member.referrals.description',
		];
		foreach ( $member_input_data as $m_key ) {
			$string = self::getString( $m_key, $d_member, $content );
			if ( ! empty( $string ) ) {
				$new_strings[] = $string;
			}
		}
	}

	public static function getLauncherDynamicStrings( &$new_strings ) {
		$launcher            = Settings::getSettings( 'launcher_button' );//saved data
		$d_launcher          = Settings::getLauncherButtonContentData( true );
		$launcher_input_data = [
			'launcher.appearance.text',
		];
		foreach ( $launcher_input_data as $l_key ) {
			$string = self::getString( $l_key, $d_launcher, $launcher );
			if ( ! empty( $string ) ) {
				$new_strings[] = $string;
			}
		}
	}

}