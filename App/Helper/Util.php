<?php

namespace WLL\App\Helper;
defined( 'ABSPATH' ) || exit;

class Util {
	public static function isAdminSite() {
		return Input::get( 'is_admin_side' ) === 'true';
	}
}