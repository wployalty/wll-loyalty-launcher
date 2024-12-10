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
}