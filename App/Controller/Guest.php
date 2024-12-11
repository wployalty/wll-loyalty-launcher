<?php

namespace WLL\App\Controller;

use WLL\App\Helper\Loyalty;
use WLL\App\Helper\Util;
use WLL\App\Helper\WC;

defined( 'ABSPATH' ) or die;

class Guest {
	public static function getEarnCampaigns() {
		if ( ! WC::isSecurityValid( 'render_page_nonce' ) ) {
			wp_send_json_error( [ 'message' => __( 'Basic check failed', 'wll-loyalty-launcher' ) ] );
		}
		if ( ! Util::isAdminSide() ) {
			wp_send_json_success( Loyalty::getCampaigns() );
		}
		wp_send_json_success( [ 'earn_points' => Loyalty::getDummyCampaigns() ] );
	}

	public static function getRedeemRewards() {
		if ( ! WC::isSecurityValid( 'render_page_nonce' ) ) {
			wp_send_json_error( [ 'message' => __( 'Basic check failed', 'wll-loyalty-launcher' ) ] );
		}
		if ( ! Util::isAdminSide() ) {
			$user_email    = Loyalty::getLoginUserEmail();
			$customer_page = new \Wlr\App\Controllers\Site\CustomerPage();
			$rewards       = $customer_page->getRewardList();
			if ( ! empty( $rewards ) && is_array( $rewards ) ) {
				foreach ( $rewards as $reward ) {
					$reward->name        = ! empty( $reward->name ) ? __( $reward->name, 'wp-loyalty-rules' ) : '';
					$reward->description = ! empty( $reward->description ) ? __( $reward->description, 'wp-loyalty-rules' ) : '';
					$reward->action_text = Loyalty::getUserRewardText( $reward );
				}
			}
			$message     = empty( $rewards ) ? sprintf( __( 'No %s found!', 'wp-loyalty-rules' ), Loyalty::getRewardLabel( 3 ) ) : '';
			$reward_list = apply_filters( 'wll_before_launcher_rewards_data', $rewards, $user_email );
			wp_send_json_success( [ 'redeem_data' => $reward_list, 'message' => $message ] );
		}
		wp_send_json_success( [ 'redeem_data' => Loyalty::getDummyRewardList() ] );
	}

}