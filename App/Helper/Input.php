<?php

namespace WLL\App\Helper;

use UnexpectedValueException;

defined( 'ABSPATH' ) || exit;

class Input {
	/**
	 * List of available input types.
	 * @var array
	 */
	protected static array $input_types = [
		'params',
		'query',
		'post',
		'cookie',
	];

	/**
	 * List of available sanitize callbacks.
	 * @var array
	 */
	protected static array $sanitize_callbacks = [
		'text'    => 'sanitize_text_field',
		'title'   => 'sanitize_title',
		'email'   => 'sanitize_email',
		'url'     => 'sanitize_url',
		'key'     => 'sanitize_key',
		'meta'    => 'sanitize_meta',
		'option'  => 'sanitize_option',
		'file'    => 'sanitize_file_name',
		'mime'    => 'sanitize_mime_type',
		'class'   => 'sanitize_html_class',
		'int'     => 'absint',
		'html'    => [ __CLASS__, 'sanitizeHtml' ],
		'content' => [ __CLASS__, 'sanitizeContent' ]
	];

	/**
	 * Get sanitized input form request.
	 *
	 * @param string $var Variable name.
	 * @param mixed $default Default value.
	 * @param string $type Input type.
	 * @param string|false $sanitize Sanitize type.
	 *
	 * @return mixed
	 */
	public static function get( string $var, $default = '', string $type = 'params', $sanitize = 'text' ) {
		if ( ! in_array( $type, self::$input_types ) ) {
			throw new UnexpectedValueException( 'Expected a valid type on get method' );
		}
		switch ( $type ) {
			case 'params':
				// it will sanitize in sanitize function
				//phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
				return isset( $_REQUEST[ $var ] ) ? self::sanitize( $_REQUEST[ $var ], $sanitize ) : $default;
			case 'query':
				// it will sanitize in sanitize function
				//phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
				return isset( $_GET[ $var ] ) ? self::sanitize( $_GET[ $var ], $sanitize ) : $default;
			case 'post':
				// it will sanitize in sanitize function
				//phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
				return isset( $_POST[ $var ] ) ? self::sanitize( $_POST[ $var ], $sanitize ) : $default;
			case 'cookie':
				// it will sanitize in sanitize function
				//phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
				return isset( $_COOKIE[ $var ] ) ? self::sanitize( $_COOKIE[ $var ], $sanitize ) : $default;
			default:
				return $default;
		}
	}

	/**
	 * Sanitize inputs and values.
	 *
	 * @param string|array $value input value.
	 * @param string|false $type input type.
	 *
	 * @return string|array
	 */
	public static function sanitize( $value, $type = 'text' ) {
		if ( $type === false ) {
			return $value;
		}

		if ( ! array_key_exists( $type, self::$sanitize_callbacks ) ) {
			throw new UnexpectedValueException( 'Expected a valid type on sanitize method' );
		}

		if ( is_array( $value ) ) {
			return self::sanitizeRecursively( $value, self::$sanitize_callbacks[ $type ] );
		}

		return self::filterXss( call_user_func( self::$sanitize_callbacks[ $type ], $value ) );
	}

	/**
	 * Sanitize recursively.
	 *
	 * @param array $array Input array.
	 * @param string $callback Sanitize callback.
	 *
	 * @return array
	 */
	public static function sanitizeRecursively( array &$array, string $callback ): array {
		foreach ( $array as &$value ) {
			if ( is_array( $value ) ) {
				$value = self::sanitizeRecursively( $value, $callback );
			} else {
				$value = self::filterXss( call_user_func( $callback, $value ) );
			}
		}

		return $array;
	}

	/**
	 * Filter XSS.
	 *
	 * @param string $data Input string.
	 *
	 * @return string
	 */
	public static function filterXss( string $data ): string {
		if ( is_null( $data ) ) {
			return '';
		}
		// Fix &entity\n;
		$data = str_replace( [ '&amp;', '&lt;', '&gt;' ], [ '&amp;amp;', '&amp;lt;', '&amp;gt;' ], $data );
		$data = preg_replace( '/(&#*\w+)[\x00-\x20]+;/u', '$1;', $data );
		$data = preg_replace( '/(&#x*[0-9A-F]+);*/iu', '$1;', $data );
		$data = html_entity_decode( $data, ENT_COMPAT, 'UTF-8' );

		// Remove any attribute starting with "on" or xmlns
		$data = preg_replace( '#(<[^>]+?[\x00-\x20"\'])(?:on|xmlns)[^>]*+>#iu', '$1>', $data );

		// Remove javascript: and vbscript: protocols
		$data = preg_replace( '#([a-z]*)[\x00-\x20]*=[\x00-\x20]*([`\'"]*)[\x00-\x20]*j[\x00-\x20]*a[\x00-\x20]*v[\x00-\x20]*a[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2nojavascript...', $data );
		$data = preg_replace( '#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*v[\x00-\x20]*b[\x00-\x20]*s[\x00-\x20]*c[\x00-\x20]*r[\x00-\x20]*i[\x00-\x20]*p[\x00-\x20]*t[\x00-\x20]*:#iu', '$1=$2novbscript...', $data );
		$data = preg_replace( '#([a-z]*)[\x00-\x20]*=([\'"]*)[\x00-\x20]*-moz-binding[\x00-\x20]*:#u', '$1=$2nomozbinding...', $data );

		// Remove namespaced elements (we do not need them)
		$data = preg_replace( '#</*\w+:\w[^>]*+>#i', '', $data );

		// Remove really unwanted tags
		do {
			$old_data = $data;
			$data     = preg_replace( '#</*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|i(?:frame|layer)|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|title|xml)[^>]*+>#i', '', $data );
		} while ( $old_data !== $data );

		return is_string( $data ) ? $data : '';
	}

	/**
	 * Sanitize text and allow some basic HTML tags and attributes.
	 *
	 * @param string $value HTML value.
	 *
	 * @return string
	 */
	public static function sanitizeHtml( string $value ): string {
		return wp_kses( $value, (array) apply_filters( 'wll_allowed_html_elements_and_attributes', [
			'br'     => [],
			'strong' => [],
			'span'   => [ 'class' => true, 'style' => true ],
			'div'    => [ 'class' => true, 'style' => true ],
			'p'      => [ 'class' => true, 'style' => true ],
			'table'  => [ 'class' => true, 'style' => true, 'border' => true ],
			'tr'     => [ 'class' => true, 'style' => true, 'border' => true ],
			'th'     => [ 'class' => true, 'style' => true, 'border' => true ],
			'td'     => [ 'class' => true, 'style' => true, 'border' => true ],
			'h1'     => [ 'class' => true ],
			'h2'     => [ 'class' => true ],
			'h3'     => [ 'class' => true ],
			'h4'     => [ 'class' => true ]
		] ) );
	}

	/**
	 * Sanitize text and allow HTML without input tags and attributes.
	 *
	 * @param string $value Content.
	 *
	 * @return string
	 */
	public static function sanitizeContent( string $value ): string {
		return wp_kses_post( $value );
	}

}
