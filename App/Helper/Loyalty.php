<?php

namespace WLL\App\Helper;

use Wlr\App\Models\EarnCampaignTransactions;
use Wlr\App\Models\Users;

defined( 'ABSPATH' ) || exit;

class Loyalty {
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

	public static function isPro() {
		return apply_filters( 'wlr_is_pro', false );
	}

	public static function isBannedUser( $user_email = "" ) {
		if ( empty( $user_email ) ) {
			$user_email = Loyalty::getLoginUserEmail();
			if ( empty( $user_email ) ) {
				return false;
			}
		}
		$user    = get_user_by( 'email', $user_email );
		$user_id = ! empty( $user->ID ) ? $user->ID : 0;
		if ( ! apply_filters( 'wlr_before_add_to_loyalty_customer', true, $user_id, $user_email ) ) {
			return true;
		}

		$user_modal = new Users();
		global $wpdb;
		$where = $wpdb->prepare( "user_email = %s AND is_banned_user = %d ", array( $user_email, 1 ) );
		$user  = $user_modal->getWhere( $where, "*", true );

		return ( ! empty( $user ) && is_object( $user ) && isset( $user->is_banned_user ) );
	}

	public static function getLoginUserEmail() {
		$login_user = self::getLoginUser();

		return ! empty( $login_user ) ? $login_user->user_email : '';
	}

	public static function getLoginUser() {
		return function_exists( 'wp_get_current_user' ) ? wp_get_current_user() : false;
	}

	public static function getCampaigns() {
		$customer_page = new \Wlr\App\Controllers\Site\CustomerPage();
		$user_email    = self::getLoginUserEmail();
		$campaign_list = $customer_page->getCampaignList();

		if ( empty( $campaign_list ) || ! is_array( $campaign_list ) ) {
			return [
				'earn_points' => $campaign_list,
				'message'     => __( 'Create a first campaign.', 'wll-loyalty-launcher' )
			];
		}

		$message               = '';
		$is_show_campaign_list = [];
		$user                  = self::getUserDetails();
		foreach ( $campaign_list as &$active_campaigns ) {
			$active_campaigns->name                    = ! empty( $active_campaigns->name ) ? __( $active_campaigns->name, 'wll-loyalty-launcher' ) : '';
			$active_campaigns->description             = ! empty( $active_campaigns->description ) ? __( $active_campaigns->description, 'wll-loyalty-launcher' ) : '';
			$active_campaigns->campaign_title_discount = ! empty( $active_campaigns->campaign_title_discount ) ? __( $active_campaigns->campaign_title_discount, 'wll-loyalty-launcher' ) : '';
			if ( ! empty( $active_campaigns->action_type ) ) {
				self::getCampaignActions( $active_campaigns, $user );
			}
			if ( ! empty( $active_campaigns->action_type ) && $active_campaigns->action_type == 'birthday' ) {
				$active_campaigns->birthday_date_format = apply_filters( 'wlr_my_account_birthday_date_format', [
					'format'    => [ 'd', 'm', 'Y' ],
					'separator' => '-'
				] );
			}
			$is_show_campaign_list[] = $active_campaigns;
		}

		if ( count( $is_show_campaign_list ) == 0 ) {
			$message = __( 'Create a first campaign.', 'wll-loyalty-launcher' );
		}
		$campaign_list = apply_filters( 'wll_before_launcher_earn_points_data', array_values( $campaign_list ), $user_email );

		return [ 'earn_points' => $campaign_list, 'message' => $message ];
	}

	public static function getUserDetails() {
		$user_email = self::getLoginUserEmail();
		if ( empty( $user_email ) ) {
			return new \stdClass();
		}
		$customer_page = new \Wlr\App\Controllers\Site\CustomerPage();

		return $customer_page->getPageUserDetails( $user_email, 'launcher' );
	}

	public static function getCampaignActions( &$active_campaigns, $user ) {
		if ( empty( $active_campaigns ) || ! is_object( $active_campaigns ) ) {
			return;
		}

		$point_rule  = Util::isJson( $active_campaigns->point_rule ) ? json_decode( $active_campaigns->point_rule ) : new \stdClass();
		$user_email  = is_object( $user ) && ! empty( $user->user_email ) ? $user->user_email : '';
		$campaign_id = ! empty( $active_campaigns->id ) ? $active_campaigns->id : 0;
		$action_type = ! empty( $active_campaigns->action_type ) && is_string( $active_campaigns->action_type ) ? $active_campaigns->action_type : '';
		switch ( $action_type ) {
			case 'followup_share':
				$active_campaigns->share_url     = ! empty( $point_rule->share_url ) ? $point_rule->share_url : '';
				$active_campaigns->button_text   = __( 'Follow', 'wp-loyalty-rules' );
				$active_campaigns->is_achieved   = ! empty( $user_email ) && $campaign_id > 0 && self::isCampaignAchieved( $user_email, $campaign_id );
				$active_campaigns->achieved_text = $active_campaigns->is_achieved ? __( 'Earned', 'wp-loyalty-rules' ) : "";
				break;
			case 'birthday':
				$active_campaigns->is_allow_edit           = WC::canShowBirthdateField();
				$active_campaigns->birth_date              = ! empty( $user->birthday_date ) && $user->birthday_date != '0000-00-00' ? WC::convertDateFormat( $user->birthday_date, "Y-m-d" ) : ( ! empty( $user->birth_date ) ? WC::beforeDisplayDate( $user->birth_date, "Y-m-d" ) : '' );
				$active_campaigns->display_birth_date      = ! empty( $user->birthday_date ) && $user->birthday_date != '0000-00-00' ? WC::convertDateFormat( $user->birthday_date ) : ( ! empty( $user->birth_date ) ? WC::beforeDisplayDate( $user->birth_date ) : '' );
				$active_campaigns->user_can_edit_birthdate = ( isset( $user->id ) && $user->id > 0 );
				$active_campaigns->show_edit_birthday      = apply_filters( "wlr_allow_my_account_edit_birth_date", true, $active_campaigns->user_can_edit_birthdate, ! empty( $user ) ? $user : new \stdClass() );
				$active_campaigns->edit_text               = ! empty( $active_campaigns->birth_date ) ? __( 'Edit', 'wp-loyalty-rules' ) : __( 'Set', 'wp-loyalty-rules' );
				$active_campaigns->update_text             = __( 'Update', 'wp-loyalty-rules' );
				if ( isset( $point_rule->birthday_earn_type ) && ! empty( $point_rule->birthday_earn_type ) && $point_rule->birthday_earn_type == "update_birth_date" ) {
					$active_campaigns->is_achieved   = ! empty( $user_email ) && $campaign_id > 0 && self::isCampaignAchieved( $user_email, $campaign_id );
					$active_campaigns->achieved_text = $active_campaigns->is_achieved ? __( 'Earned', 'wp-loyalty-rules' ) : '';
				}
				break;
			case 'referral':
				$referral_url_check = ! empty( $user ) && is_object( $user ) && ! empty( $user->refer_code );
				if ( $referral_url_check ) {
					$active_campaigns->referral_url = self::getReferralUrl( $user->refer_code );
				}
				break;
			case 'facebook_share':
			case 'twitter_share':
			case 'whatsapp_share':
			case 'email_share':
				$referral_url_check = ! empty( $user ) && is_object( $user ) && ! empty( $user->refer_code );
				if ( $referral_url_check ) {
					$referral_url = self::getReferralUrl( $user->refer_code );
				}
				$social_actions = ( ! empty( $referral_url ) && ! empty( $user->user_email ) ) ? self::getSocialIconList( $user->user_email, $referral_url ) : [];
				foreach ( $social_actions as $social_action ) {
					if ( ! empty( $social_action['action_type'] ) && $social_action['action_type'] == $active_campaigns->action_type ) {
						$active_campaigns->action_url  = ! empty( $social_action['url'] ) ? $social_action['url'] : '';
						$active_campaigns->button_text = __( 'Share', 'wp-loyalty-rules' );
					}
				}
				$active_campaigns->is_achieved   = ! empty( $user_email ) && $campaign_id > 0 && self::isCampaignAchieved( $user_email, $campaign_id );
				$active_campaigns->achieved_text = $active_campaigns->is_achieved ? __( 'Earned', 'wp-loyalty-rules' ) : '';
				break;
			case 'signup':
				$is_member_user = ( isset( $user->id ) && $user->id > 0 );
				if ( ! $is_member_user ) {
					$active_campaigns->action_url  = get_permalink( get_option( 'woocommerce_myaccount_page_id' ) );
					$active_campaigns->button_text = __( 'Sign Up', 'wp-loyalty-rules' );
				}
				$active_campaigns->is_achieved   = ! empty( $user_email ) && $campaign_id > 0 && self::isCampaignAchieved( $user_email, $campaign_id );
				$active_campaigns->achieved_text = $active_campaigns->is_achieved ? __( 'Earned', 'wp-loyalty-rules' ) : '';
				break;
			default;
		}
	}

	public static function isCampaignAchieved( $user_email, $campaign_id ) {
		if ( empty( $user_email ) || ! is_string( $user_email ) || empty( $campaign_id ) || $campaign_id <= 0 ) {
			return false;
		}
		$campaign_transaction_model = new EarnCampaignTransactions();
		global $wpdb;
		$where  = $wpdb->prepare( 'user_email = %s AND campaign_id = %s', [ $user_email, $campaign_id ] );
		$result = $campaign_transaction_model->getWhere( $where, 'COUNT(*) as count', true );

		return ! empty( $result ) && isset( $result->count ) && ( $result->count > 0 );
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

	public static function getDummyCampaigns() {
		return [
			[
				'id'          => 1,
				'icon'        => 'point_for_purchase',
				'title'       => __( 'Point for purchase', 'wp-loyalty-rules' ),
				'description' => __( '+10 Points for every $1 spent', 'wp-loyalty-rules' )
			],
			[
				'id'          => 2,
				'icon'        => 'birthday',
				'title'       => __( 'Celebrate a birthday', 'wp-loyalty-rules' ),
				'description' => __( '+30 points', 'wp-loyalty-rules' )
			],
			[
				'id'          => 3,
				'icon'        => 'twitter_share',
				'title'       => __( 'Twitter Share', 'wp-loyalty-rules' ),
				'description' => __( '+70 points', 'wp-loyalty-rules' )
			],
			[
				'id'          => 4,
				'icon'        => 'facebook_share',
				'title'       => __( 'Follow on Facebook', 'wp-loyalty-rules' ),
				'description' => __( '+50 points', 'wp-loyalty-rules' )
			],
			[
				'id'          => 5,
				'icon'        => 'product_review',
				'title'       => __( 'Review a Product', 'wp-loyalty-rules' ),
				'description' => __( '+800 points', 'wp-loyalty-rules' )
			],
		];
	}

	public static function getUserRewardText( $user_reward ) {
		if ( empty( $user_reward ) || ! is_object( $user_reward ) ) {
			return '';
		}
		$text          = '';
		$discount_type = ! empty( $user_reward->discount_type ) ? $user_reward->discount_type : '';
		switch ( $discount_type ) {
			case 'fixed_cart':
			case 'points_conversion':
				if ( $user_reward->coupon_type == 'percent' ) {
					$text = ( $user_reward->reward_type == 'redeem_coupon' ) ? sprintf( __( '%s Off', 'wp-loyalty-rules' ), $user_reward->discount_value . '%' ) : sprintf( __( '%d %s = %s Off', 'wp-loyalty-rules' ), $user_reward->require_point, self::getPointLabel( $user_reward->require_point ), $user_reward->discount_value . '%' );
				} else {
					$discount_value = WC::getCustomPrice( $user_reward->discount_value );
					$text           = ( $user_reward->reward_type == 'redeem_coupon' ) ? sprintf( __( '%s Off', 'wp-loyalty-rules' ), $discount_value )
						: sprintf( __( '%d %s = %s Off', 'wp-loyalty-rules' ), $user_reward->require_point, self::getPointLabel( $user_reward->require_point ), $discount_value );
				}

				break;
			case 'percent':
				$text = ( $user_reward->reward_type == 'redeem_coupon' ) ? sprintf( __( '%d%s Off', 'wp-loyalty-rules' ), $user_reward->discount_value, '%' )
					: sprintf( __( '%d %s = %d%s Off', 'wp-loyalty-rules' ), $user_reward->require_point, self::getPointLabel( $user_reward->require_point ), $user_reward->discount_value, '%' );
				break;
			case 'free_product':
				$text = ( $user_reward->reward_type == 'redeem_coupon' ) ? __( 'Free product', 'wp-loyalty-rules' ) : __( $user_reward->require_point . ' ' . self::getPointLabel( $user_reward->require_point ), 'wp-loyalty-rules' );
				break;
			case 'free_shipping':
				$text = ( $user_reward->reward_type == 'redeem_coupon' ) ? __( 'Free shipping', 'wp-loyalty-rules' ) : __( $user_reward->require_point . ' ' . self::getPointLabel( $user_reward->require_point ), 'wp-loyalty-rules' );
				break;
		}

		return $text;
	}

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

	public static function getUserCouponText( $user_reward ) {
		if ( empty( $user_reward ) || ! is_object( $user_reward ) ) {
			return '';
		}
		$text           = '';
		$discount_value = ! empty( $user_reward->discount_value ) && ( $user_reward->discount_value != 0 ) ? ( $user_reward->discount_value ) : '';
		$discount_type  = ! empty( $user_reward->discount_type ) ? $user_reward->discount_type : '';
		switch ( $discount_type ) {
			case 'fixed_cart':
			case 'points_conversion':
				$text = WC::convertPrice( $discount_value, true, $user_reward->reward_currency );
				if ( $user_reward->coupon_type == 'percent' ) {
					$text = number_format( $discount_value, 2 ) . '%';
				}
				break;
			case 'percent':
				$text = round( $discount_value ) . '%';
				break;
			case 'free_product':
				$text = __( 'Free product', 'wp-loyalty-rules' );
				break;
			case 'free_shipping':
				$text = __( 'Free shipping', 'wp-loyalty-rules' );
				break;
		}

		return $text;
	}

	public static function getDummyRewardList() {
		return [
			[
				'id'          => 1,
				'icon'        => 'points_conversion',
				'title'       => __( 'Point conversion', 'wp-loyalty-rules' ),
				'description' => __( 'Covert point into coupons', 'wp-loyalty-rules' ),
				'action_text' => __( '10 points = $15.00 Off', 'wp-loyalty-rules' ),
			],
			[
				'id'          => 2,
				'icon'        => 'percent',
				'title'       => __( 'Percentage discount', 'wp-loyalty-rules' ),
				'description' => __( 'Redeem points and get percentage discount', 'wp-loyalty-rules' ),
				'action_text' => __( '100 points = 10% Off', 'wp-loyalty-rules' ),
			],
			[
				'id'          => 3,
				'icon'        => 'free_shipping',
				'title'       => __( 'Free shipping', 'wp-loyalty-rules' ),
				'description' => __( 'Redeem points and get free shipping', 'wp-loyalty-rules' ),
				'action_text' => __( 'free shipping', 'wp-loyalty-rules' ),
			],
			[
				'id'          => 4,
				'icon'        => 'fixed_cart',
				'title'       => __( 'Fixed discount', 'wp-loyalty-rules' ),
				'description' => __( 'Redeem points and get fixed discount', 'wp-loyalty-rules' ),
				'action_text' => __( '100 points = $10.00 Off', 'wp-loyalty-rules' ),
			],
		];
	}

	public static function getDummyCouponData() {
		return [
			[
				'id'           => 1,
				'icon'         => 'fixed_cart',
				'title'        => __( 'Fixed discount', 'wp-loyalty-rules' ),
				'description'  => __( 'Fixed discount description', 'wp-loyalty-rules' ),
				'expired_text' => __( 'Expires on 2024-04-12', 'wp-loyalty-rules' ),
				'coupon_code'  => "wlr-cd6-jrt-eaz",
				'action_text'  => __( '$10.00', 'wp-loyalty-rules' )
			],
			[
				'id'           => 2,
				'icon'         => 'percent',
				'title'        => __( 'Percentage discount', 'wp-loyalty-rules' ),
				'description'  => __( 'Percentage discount description', 'wp-loyalty-rules' ),
				'expired_text' => __( 'Expires on 2023-05-12', 'wp-loyalty-rules' ),
				'coupon_code'  => "wlr-wrs-m5a-y5q",
				'action_text'  => __( '10%', 'wp-loyalty-rules' )
			],
			[
				'id'           => 3,
				'icon'         => 'free_shipping',
				'title'        => __( 'Free Shipping', 'wp-loyalty-rules' ),
				'description'  => __( 'Free shipping description', 'wp-loyalty-rules' ),
				'expired_text' => "",
				'coupon_code'  => "wlr-zhn-4z6-efz",
				'action_text'  => __( 'Free shipping', 'wp-loyalty-rules' )
			],

		];
	}

	public static function getRewardOpportunities() {
		$user_email    = Loyalty::getLoginUserEmail();
		$is_guest      = empty( $user_email );
		$customer_page = new \Wlr\App\Controllers\Site\CustomerPage();
		$rewards       = $customer_page->getRewardList();
		if ( empty( $rewards ) || ! is_array( $rewards ) ) {
			return [
				'reward_opportunity' => [],
				'message'            => sprintf( __( 'No %s found!', 'wp-loyalty-rules' ), self::getRewardLabel( 3 ) )
			];
		}
		foreach ( $rewards as $reward ) {
			$reward->name        = ! empty( $reward->name ) ? __( $reward->name, 'wp-loyalty-rules' ) : '';
			$reward->description = ! empty( $reward->description ) ? __( $reward->description, 'wp-loyalty-rules' ) : '';
		}
		$message = "";
		if ( count( $rewards ) == 0 ) {
			$message = sprintf( __( 'No %s found!', 'wp-loyalty-rules' ), self::getRewardLabel( 3 ) );
		}

		return apply_filters( 'wll_before_launcher_reward_opportunities', [
			'reward_opportunity' => $rewards,
			'message'            => $message
		], $user_email, $is_guest );
	}

	public static function getRewardLabel( $reward_count = 0 ) {
		$setting_option = get_option( 'wlr_settings', [] );
		$singular       = ( ! empty( $setting_option['reward_singular_label'] ) ) ? __( $setting_option['reward_singular_label'], 'wp-loyalty-rules' ) : __( 'reward', 'wp-loyalty-rules' );
		$plural         = ( ! empty( $setting_option['reward_plural_label'] ) ) ? __( $setting_option['reward_plural_label'], 'wp-loyalty-rules' ) : __( 'rewards', 'wp-loyalty-rules' );
		$reward_label   = ( $reward_count == 0 || $reward_count > 1 ) ? $plural : $singular;

		return apply_filters( 'wlr_get_reward_label', $reward_label, $reward_count );
	}

	public static function getDummyRewardOpportunities() {
		return [
			[
				'id'          => 1,
				'icon'        => 'fixed_cart',
				'title'       => __( 'Fixed coupon discount', 'wp-loyalty-rules' ),
				'description' => __( 'Coupon reward', 'wp-loyalty-rules' ),
				'action_text' => '',
			],
			[
				'id'          => 2,
				'icon'        => 'percent',
				'title'       => __( 'Percentage discount', 'wp-loyalty-rules' ),
				'description' => __( 'Percentage discount', 'wp-loyalty-rules' ),
				'action_text' => '',
			],
			[
				'id'          => 3,
				'icon'        => 'free_product',
				'title'       => __( 'Free product', 'wp-loyalty-rules' ),
				'description' => __( 'Free product', 'wp-loyalty-rules' ),
				'action_text' => '',
			],
			[
				'id'          => 4,
				'icon'        => 'points_conversion',
				'title'       => __( 'Points conversion', 'wp-loyalty-rules' ),
				'description' => __( 'Points conversion', 'wp-loyalty-rules' ),
				'action_text' => '',
			],
		];
	}
}