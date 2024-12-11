<?php

namespace WLL\App\Controller;

use WLL\App\Helper\Loyalty;
use WLL\App\Helper\Util;
use WLL\App\Helper\WC;
use Wlr\App\Controllers\Site\CustomerPage;
use Wlr\App\Models\UserRewards;

defined( 'ABSPATH' ) or die;

class Member {
	public static function getEarnCampaigns() {
		if ( ! WC::isSecurityValid( 'render_page_nonce' ) ) {
			wp_send_json_error( [ 'message' => __( 'Basic check failed', 'wll-loyalty-launcher' ) ] );
		}
		if ( ! Util::isAdminSide() ) {
			wp_send_json_success( Loyalty::getCampaigns() );
		}
		wp_send_json_success( [ 'earn_points' => Loyalty::getDummyCampaigns() ] );
	}

	public static function getAvailableRedeemReward() {
		if ( ! WC::isSecurityValid( 'render_page_nonce' ) ) {
			wp_send_json_error( [ 'message' => __( 'Basic check failed', 'wll-loyalty-launcher' ) ] );
		}
		if ( ! Util::isAdminSide() ) {
			$user_email        = Loyalty::getLoginUserEmail();
			$available_rewards = CustomerPage::getAvailableRewards( $user_email );
			if ( empty( $available_rewards ) ) {
				wp_send_json_success( [
					'redeem_data' => [],
					'message'     => sprintf( __( 'No %s found!', 'wp-loyalty-rules' ), Loyalty::getRewardLabel( 3 ) )
				] );
			}
			foreach ( $available_rewards as $user_reward ) {
				$user_reward->name        = ! empty( $user_reward->name ) ? __( $user_reward->name, 'wp-loyalty-rules' ) : '';
				$user_reward->description = ! empty( $user_reward->description ) ? __( $user_reward->description, 'wp-loyalty-rules' ) : '';
				$user_reward->button_text = __( 'Redeem', 'wp-loyalty-rules' );
				$user_reward->action_text = Loyalty::getUserRewardText( $user_reward );
				if ( ! empty( $user_reward->discount_code ) ) {
					$user_reward->button_text = "";
					$user_reward->action_text = Loyalty::getUserCouponText( $user_reward );
				}
				$user_reward->is_point_convertion_reward = false;
				$user_reward->is_redirect_to_coupon      = true;
				if ( isset( $user_reward->discount_type ) && $user_reward->discount_type == 'points_conversion' && isset( $user_reward->reward_table ) && $user_reward->reward_table != 'user_reward' ) {
					$user_reward->is_point_convertion_reward = true;
					$user_reward->is_redirect_to_coupon      = false;
				}
				$user_reward->expiry_date_text = "";
				if ( ! empty( $user_reward->expiry_date ) && ! empty( $user_reward->discount_code ) ) {
					$user_reward->expiry_date_text = sprintf( __( 'Expires on %s', "wp-loyalty-rules" ), $user_reward->expiry_date );
				}
				if ( empty( $user_reward->discount_code ) ) {
					$user_reward->is_show_reward = 1;
				}
			}
			$available_rewards = apply_filters( 'wll_before_launcher_user_rewards_data', $available_rewards, $user_email );
			$customer_page     = new \Wlr\App\Controllers\Site\CustomerPage();
			$user              = Loyalty::getLoyaltyUserByEmail( $user_email );
			$available_rewards = $customer_page->processRewardList( $available_rewards, [ 'wp_user' => $user ] );
			foreach ( $available_rewards as &$user_reward ) {
				if ( isset( $user_reward->discount_type ) && $user_reward->discount_type == 'points_conversion' && isset( $user_reward->reward_table ) && $user_reward->reward_table != 'user_reward' ) {
					$user_reward->discount_value = ( $user_reward->coupon_type == 'percent' ) ? $user_reward->discount_value : WC::getCustomPrice( $user_reward->discount_value, false );
				}
			}
			wp_send_json_success( [ 'redeem_data' => $available_rewards, ] );
		}
		wp_send_json_success( [ 'redeem_data' => Loyalty::getDummyRewardList() ] );
	}

	public static function getEarnedCoupons() {
		if ( ! WC::isSecurityValid( 'render_page_nonce' ) ) {
			wp_send_json_error( [ 'message' => __( 'Basic check failed', 'wll-loyalty-launcher' ) ] );
		}
		if ( ! Util::isAdminSide() ) {
			$user_rewards   = new UserRewards();
			$user_email     = Loyalty::getLoginUserEmail();
			$coupon_rewards = $user_rewards->getCustomerCouponRewardByEmail( $user_email, [
				'limit'  => - 1,
				'offset' => 0
			] );
			$customer_page  = new \Wlr\App\Controllers\Site\CustomerPage();
			$coupon_rewards = $customer_page->processRewardList( $coupon_rewards );
			if ( empty( $coupon_rewards ) ) {
				wp_send_json_success( [
					'redeem_coupons' => [],
					'message'        => __( 'No coupons found!', 'wp-loyalty-rules' )
				] );
			}
			$coupon_rewards = array_values( $coupon_rewards );// For React, key must start from 0
			foreach ( $coupon_rewards as &$coupon_reward ) {
				$coupon_reward->reward_table = 'user_reward';
			}
			wp_send_json_success( [
				'redeem_coupons' => $coupon_rewards,
				'message'        => ''
			] );
		}
		wp_send_json_success( [
			'redeem_coupons' => Loyalty::getDummyCouponData(),
			'message'        => ''
		] );
	}

	public static function getRewardOpportunities() {
		if ( ! WC::isSecurityValid( 'render_page_nonce' ) ) {
			wp_send_json_error( [ 'message' => __( 'Basic check failed', 'wll-loyalty-launcher' ) ] );
		}
		if ( ! Util::isAdminSide() ) {
			wp_send_json_success( Loyalty::getRewardOpportunities() );
		}
		wp_send_json_success( [ 'reward_opportunity' => Loyalty::getDummyRewardOpportunities() ] );
	}
}