<?php

namespace WLL\App\Helper;
defined( 'ABSPATH' ) || exit;

class Util {
	public static function isAdminSide() {
		return Input::get( 'is_admin_side' ) === 'true';
	}

	public static function renderTemplate( string $file, array $data = [], bool $display = true ) {
		$content = '';
		if ( file_exists( $file ) ) {
			ob_start();
			extract( $data );
			include $file;
			$content = ob_get_clean();
		}
		if ( ! $display ) {
			return $content;
		}
		echo $content;
	}

	public static function isJson( $string ) {
		json_decode( $string );

		return ( json_last_error() == JSON_ERROR_NONE );
	}
}