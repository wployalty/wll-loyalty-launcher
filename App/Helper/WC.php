<?php

namespace WLL\App\Helper;
defined( 'ABSPATH' ) || exit;

class WC {
	/**
	 * Add admin notice.
	 *
	 * @param string $message Message.
	 * @param string $status Status.
	 *
	 * @return void
	 */
	public static function adminNotice( string $message, string $status = 'success' ) {
		add_action( 'admin_notices', function () use ( $message, $status ) {
			?>
            <div class="notice notice-<?php echo esc_attr( $status ); ?>">
                <p><?php echo wp_kses_post( $message ); ?></p>
            </div>
			<?php
		}, 1 );
	}

	/**
	 * Get list of files and directories within a specified folder.
	 *
	 * @param string $folder The folder path to retrieve files and directories from.
	 * @param int $levels The maximum levels of subdirectories to traverse.
	 * @param array $exclusions An array of file names to exclude from the result.
	 *
	 * @return array|bool An array containing the list of files and directories, or false if unable to open the folder.
	 */
	public static function getDirFileLists( $folder = '', $levels = 100, $exclusions = array() ) {
		if ( empty( $folder ) ) {
			return false;
		}

		$folder = trailingslashit( $folder );
		if ( ! $levels ) {
			return false;
		}

		$files = array();

		$dir = @opendir( $folder );

		if ( $dir ) {
			while ( ( $file = readdir( $dir ) ) !== false ) {
				// Skip current and parent folder links.
				if ( in_array( $file, array( '.', '..' ), true ) ) {
					continue;
				}

				// Skip hidden and excluded files.
				if ( '.' === $file[0] || in_array( $file, $exclusions, true ) ) {
					continue;
				}

				if ( is_dir( $folder . $file ) ) {
					$files2 = list_files( $folder . $file, $levels - 1 );
					if ( $files2 ) {
						$files = array_merge( $files, $files2 );
					} else {
						$files[] = $folder . $file . '/';
					}
				} else {
					$files[] = $folder . $file;
				}
			}

			closedir( $dir );
		}

		return $files;
	}

	/**
	 * Check the validity of a security nonce and the admin privilege.
	 *
	 * @param string $nonce_name The name of the nonce.
	 *
	 * @return bool
	 */
	public static function isSecurityValid( string $nonce_name = '' ): bool {
		$wdr_nonce = Input::get( 'wll_nonce' );
		if ( ! self::hasAdminPrivilege() || ! self::verifyNonce( $wdr_nonce, $nonce_name ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Has admin privilege.
	 *
	 * @return bool
	 */
	public static function hasAdminPrivilege(): bool {
		//return current_user_can( 'manage_woocommerce' );
		return current_user_can( 'manage_options' );
	}

	/**
	 * Verify nonce.
	 *
	 * @param string $nonce Nonce.
	 * @param string $action Action.
	 *
	 * @return bool
	 */
	public static function verifyNonce( string $nonce, string $action = '' ): bool {
		if ( empty( $nonce ) || empty( $action ) ) {
			return false;
		}

		return wp_verify_nonce( $nonce, $action );
	}

	/**
	 * Create nonce for woocommerce.
	 *
	 * @param string $action
	 *
	 * @return false|string
	 */
	public static function createNonce( string $action = '' ) {
		if ( empty( $action ) ) {
			return false;
		}

		return wp_create_nonce( $action );
	}

	public static function getCleanHtml( $html ) {
		try {
			$html         = html_entity_decode( $html );
			$html         = preg_replace( '/(<(script|style|iframe)\b[^>]*>).*?(<\/\2>)/is', "$1$3", $html );
			$allowed_html = array(
				'br'     => array(),
				'strong' => array(),
				'span'   => array( 'class' => array() ),
				'div'    => array( 'class' => array() ),
				'p'      => array( 'class' => array() ),
				'b'      => array( 'class' => array() ),
				'i'      => array( 'class' => array() ),
			);

			return wp_kses( $html, $allowed_html );
		} catch ( \Exception $e ) {
			return '';
		}
	}

	public static function convertDateFormat( $date, $format = '' ) {
		if ( empty( $format ) ) {
			$format = get_option( 'date_format', 'Y-m-d H:i:s' );
		}
		if ( empty( $date ) ) {
			return null;
		}
		$date             = new \DateTime( $date );
		$converted_format = $date->format( $format );
		if ( apply_filters( 'wlr_translate_display_date', false ) ) {
			$time             = strtotime( $converted_format );
			$converted_format = date_i18n( $format, $time );
		}

		return $converted_format;
	}

	public static function canShowBirthdateField() {
		$is_one_time_birthdate_edit = Settings::get( 'is_one_time_birthdate_edit', 'wlr_settings', 'no' );
		$show_birthdate             = true;
		if ( $is_one_time_birthdate_edit == 'no' ) {
			$user_email    = Loyalty::getLoginUserEmail();
			$user          = Loyalty::getLoyaltyUserByEmail( $user_email );
			$birthday_date = is_object( $user ) && ! empty( $user->birthday_date ) && $user->birthday_date != '0000-00-00' ? $user->birthday_date : ( is_object( $user ) && ! empty( $user->birth_date ) ? self::beforeDisplayDate( $user->birth_date, 'Y-m-d' ) : '' );
			if ( ! empty( $birthday_date ) && $birthday_date != '0000-00-00' ) {
				$show_birthdate = false;
			}
		}

		return $show_birthdate;
	}

	public static function beforeDisplayDate( $date, $format = '' ) {
		if ( empty( $format ) ) {
			$format = get_option( 'date_format', 'Y-m-d H:i:s' );
		}
		if ( empty( $date ) ) {
			return null;
		}
		if ( (int) $date != $date ) {
			return $date;
		}
		//return $this->convert_utc_to_wp_time(date('Y-m-d H:i:s', $date), $format);
		$converted_time = self::convertUTCtoWP( date( 'Y-m-d H:i:s', $date ), $format );
		if ( apply_filters( 'wlr_translate_display_date', false ) ) {
			$time           = strtotime( $converted_time );
			$converted_time = date_i18n( $format, $time );
		}

		return $converted_time;
	}

	public static function convertUTCtoWP( $datetime, $format = 'Y-m-d H:i:s', $modify = '' ) {
		try {
			$timezone     = new \DateTimeZone( 'UTC' );
			$current_time = new \DateTime( $datetime, $timezone );
			if ( ! empty( $modify ) ) {
				$current_time->modify( $modify );
			}
			$wp_time_zone = new \DateTimeZone( self::getWPZone() );
			$current_time->setTimezone( $wp_time_zone );
			$converted_time = $current_time->format( $format );
		} catch ( \Exception $e ) {
			$converted_time = $datetime;
		}

		return $converted_time;
	}

	public static function getWPZone() {
		if ( ! function_exists( 'wp_timezone_string' ) ) {
			$timezone_string = get_option( 'timezone_string' );
			if ( $timezone_string ) {
				return $timezone_string;
			}
			$offset   = (float) get_option( 'gmt_offset' );
			$hours    = (int) $offset;
			$minutes  = ( $offset - $hours );
			$sign     = ( $offset < 0 ) ? '-' : '+';
			$abs_hour = abs( $hours );
			$abs_mins = abs( $minutes * 60 );

			return sprintf( '%s%02d:%02d', $sign, $abs_hour, $abs_mins );
		}

		return wp_timezone_string();
	}

	public static function getCustomPrice( $amount, $with_symbol = true, $currency = '' ) {
		$currency        = self::getDefaultWoocommerceCurrency( $currency );
		$original_amount = $amount;
		if ( $with_symbol ) {
			$currency_symbol = self::getCurrencySymbols( $currency );
			$amount          = number_format( $amount, wc_get_price_decimals(), wc_get_price_decimal_separator(), wc_get_price_thousand_separator() );
			$price_format    = get_woocommerce_price_format();
			$formatted_price = sprintf( $price_format, '<span class="woocommerce-Price-currencySymbol">' . $currency_symbol . '</span>', $amount );
			$amount          = '<span class="woocommerce-Price-amount amount"><bdi>' . $formatted_price . '</bdi></span>';
		}

		return apply_filters( 'wlr_custom_price_convert', $amount, $original_amount, $with_symbol, $currency );
	}

	public static function getDefaultWoocommerceCurrency( $currency = '' ) {
		if ( empty( $currency ) ) {
			$currency = get_woocommerce_currency();
		}

		return apply_filters( 'wlr_custom_default_currency', $currency );
	}

	public static function getCurrencySymbols( $currency = '' ) {
		if ( empty( $currency ) ) {
			return $currency;
		}
		$symbols = get_woocommerce_currency_symbols();

		return isset( $symbols[ $currency ] ) ? $symbols[ $currency ] : '';
	}

	public static function convertPrice( $amount, $with_symbol = true, $currency = '' ) {
		$original_currency = $currency;
		$original_amount   = $amount;
		if ( $with_symbol ) {
			$currency_symbol = self::getCurrencySymbols( $original_currency );
			$amount          = number_format( $amount, wc_get_price_decimals(), wc_get_price_decimal_separator(), wc_get_price_thousand_separator() );
			$price_format    = get_woocommerce_price_format();
			$formatted_price = sprintf( $price_format, '<span class="woocommerce-Price-currencySymbol">' . $currency_symbol . '</span>', $amount );
			$amount          = '<span class="woocommerce-Price-amount amount"><bdi>' . $formatted_price . '</bdi></span>';
		}

		return apply_filters( 'wlr_custom_price_convert', $amount, $original_amount, $with_symbol, $original_currency );
	}
}