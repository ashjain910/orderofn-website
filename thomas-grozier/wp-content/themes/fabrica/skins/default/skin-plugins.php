<?php
/**
 * Required plugins
 *
 * @package FABRICA
 * @since FABRICA 1.76.0
 */

// THEME-SUPPORTED PLUGINS
// If plugin not need - remove its settings from next array
//----------------------------------------------------------
$fabrica_theme_required_plugins_groups = array(
	'core'          => esc_html__( 'Core', 'fabrica' ),
	'page_builders' => esc_html__( 'Page Builders', 'fabrica' ),
	'ecommerce'     => esc_html__( 'E-Commerce & Donations', 'fabrica' ),
	'socials'       => esc_html__( 'Socials and Communities', 'fabrica' ),
	'events'        => esc_html__( 'Events and Appointments', 'fabrica' ),
	'content'       => esc_html__( 'Content', 'fabrica' ),
	'other'         => esc_html__( 'Other', 'fabrica' ),
);
$fabrica_theme_required_plugins        = array(
	'trx_addons'                 => array(
		'title'       => esc_html__( 'ThemeREX Addons', 'fabrica' ),
		'description' => esc_html__( "Will allow you to install recommended plugins, demo content, and improve the theme's functionality overall with multiple theme options", 'fabrica' ),
		'required'    => true,
		'logo'        => 'trx_addons.png',
		'group'       => $fabrica_theme_required_plugins_groups['core'],
	),
	'elementor'                  => array(
		'title'       => esc_html__( 'Elementor', 'fabrica' ),
		'description' => esc_html__( "Is a beautiful PageBuilder, even the free version of which allows you to create great pages using a variety of modules.", 'fabrica' ),
		'required'    => false,
		'logo'        => 'elementor.png',
		'group'       => $fabrica_theme_required_plugins_groups['page_builders'],
	),
	'gutenberg'                  => array(
		'title'       => esc_html__( 'Gutenberg', 'fabrica' ),
		'description' => esc_html__( "It's a posts editor coming in place of the classic TinyMCE. Can be installed and used in parallel with Elementor", 'fabrica' ),
		'required'    => false,
		'install'     => false,          // Do not offer installation of the plugin in the Theme Dashboard and TGMPA
		'logo'        => 'gutenberg.png',
		'group'       => $fabrica_theme_required_plugins_groups['page_builders'],
	),
	'js_composer'                => array(
		'title'       => esc_html__( 'WPBakery PageBuilder', 'fabrica' ),
		'description' => esc_html__( "Popular PageBuilder which allows you to create excellent pages", 'fabrica' ),
		'required'    => false,
		'install'     => false,          // Do not offer installation of the plugin in the Theme Dashboard and TGMPA
		'logo'        => 'js_composer.jpg',
		'group'       => $fabrica_theme_required_plugins_groups['page_builders'],
	),
	'woocommerce'                => array(
		'title'       => esc_html__( 'WooCommerce', 'fabrica' ),
		'description' => esc_html__( "Connect the store to your website and start selling now", 'fabrica' ),
		'required'    => false,
		'logo'        => 'woocommerce.png',
		'group'       => $fabrica_theme_required_plugins_groups['ecommerce'],
	),
	'elegro-payment'             => array(
		'title'       => esc_html__( 'Elegro Crypto Payment', 'fabrica' ),
		'description' => esc_html__( "Extends WooCommerce Payment Gateways with an elegro Crypto Payment", 'fabrica' ),
		'required'    => false,
		'logo'        => 'elegro-payment.png',
		'group'       => $fabrica_theme_required_plugins_groups['ecommerce'],
	),
	'm-chart'              => array(
		'title'       => esc_html__( 'M Chart', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'logo'        => fabrica_get_file_url( 'plugins/m-chart/m-chart.png' ),
		'group'       => $fabrica_theme_required_plugins_groups['other'],
	),
	'm-chart-highcharts-library'              => array(
		'title'       => esc_html__( 'M Chart Highcharts Library', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'logo'        => fabrica_get_file_url( 'plugins/m-chart/m-chart.png' ),
		'group'       => $fabrica_theme_required_plugins_groups['other'],
	),
	'instagram-feed'             => array(
		'title'       => esc_html__( 'Instagram Feed', 'fabrica' ),
		'description' => esc_html__( "Displays the latest photos from your profile on Instagram", 'fabrica' ),
		'required'    => false,
		'logo'        => 'instagram-feed.png',
		'group'       => $fabrica_theme_required_plugins_groups['socials'],
	),
	'mailchimp-for-wp'           => array(
		'title'       => esc_html__( 'MailChimp for WP', 'fabrica' ),
		'description' => esc_html__( "Allows visitors to subscribe to newsletters", 'fabrica' ),
		'required'    => false,
		'logo'        => 'mailchimp-for-wp.png',
		'group'       => $fabrica_theme_required_plugins_groups['socials'],
	),
	'booked'                     => array(
		'title'       => esc_html__( 'Booked Appointments', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'install'     => false, 
		'logo'        => 'booked.png',
		'group'       => $fabrica_theme_required_plugins_groups['events'],
	),
	'quickcal'                     => array(
		'title'       => esc_html__( 'QuickCal', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'install'     => false, 
		'logo'        => 'quickcal.png',
		'group'       => $fabrica_theme_required_plugins_groups['events'],
	),
	'the-events-calendar'        => array(
		'title'       => esc_html__( 'The Events Calendar', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'install'     => false, 
		'logo'        => 'the-events-calendar.png',
		'group'       => $fabrica_theme_required_plugins_groups['events'],
	),
	'contact-form-7'             => array(
		'title'       => esc_html__( 'Contact Form 7', 'fabrica' ),
		'description' => esc_html__( "CF7 allows you to create an unlimited number of contact forms", 'fabrica' ),
		'required'    => false,
		'logo'        => 'contact-form-7.png',
		'group'       => $fabrica_theme_required_plugins_groups['content'],
	),

	'latepoint'                  => array(
		'title'       => esc_html__( 'LatePoint', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'install'     => false, 
		'logo'        => fabrica_get_file_url( 'plugins/latepoint/latepoint.png' ),
		'group'       => $fabrica_theme_required_plugins_groups['events'],
	),
	'advanced-popups'                  => array(
		'title'       => esc_html__( 'Advanced Popups', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'logo'        => fabrica_get_file_url( 'plugins/advanced-popups/advanced-popups.jpg' ),
		'group'       => $fabrica_theme_required_plugins_groups['content'],
	),
	'devvn-image-hotspot'                  => array(
		'title'       => esc_html__( 'Image Hotspot by DevVN', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'install'     => false, 
		'logo'        => fabrica_get_file_url( 'plugins/devvn-image-hotspot/devvn-image-hotspot.png' ),
		'group'       => $fabrica_theme_required_plugins_groups['content'],
	),
	'ti-woocommerce-wishlist'                  => array(
		'title'       => esc_html__( 'TI WooCommerce Wishlist', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'logo'        => fabrica_get_file_url( 'plugins/ti-woocommerce-wishlist/ti-woocommerce-wishlist.png' ),
		'group'       => $fabrica_theme_required_plugins_groups['ecommerce'],
	),
	'woo-smart-quick-view'                  => array(
		'title'       => esc_html__( 'WPC Smart Quick View for WooCommerce', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'install'     => false, 
		'logo'        => fabrica_get_file_url( 'plugins/woo-smart-quick-view/woo-smart-quick-view.png' ),
		'group'       => $fabrica_theme_required_plugins_groups['ecommerce'],
	),
	'twenty20'                  => array(
		'title'       => esc_html__( 'Twenty20 Image Before-After', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'install'     => false, 
		'logo'        => fabrica_get_file_url( 'plugins/twenty20/twenty20.png' ),
		'group'       => $fabrica_theme_required_plugins_groups['content'],
	),
	'essential-grid'             => array(
		'title'       => esc_html__( 'Essential Grid', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'install'     => false,
		'logo'        => 'essential-grid.png',
		'group'       => $fabrica_theme_required_plugins_groups['content'],
	),
	'revslider'                  => array(
		'title'       => esc_html__( 'Revolution Slider', 'fabrica' ),
		'description' => '',
		'required'    => false,
		'logo'        => 'revslider.png',
		'group'       => $fabrica_theme_required_plugins_groups['content'],
	),
	'sitepress-multilingual-cms' => array(
		'title'       => esc_html__( 'WPML - Sitepress Multilingual CMS', 'fabrica' ),
		'description' => esc_html__( "Allows you to make your website multilingual", 'fabrica' ),
		'required'    => false,
		'install'     => false,      // Do not offer installation of the plugin in the Theme Dashboard and TGMPA
		'logo'        => 'sitepress-multilingual-cms.png',
		'group'       => $fabrica_theme_required_plugins_groups['content'],
	),
	'wp-gdpr-compliance'         => array(
		'title'       => esc_html__( 'Cookie Information', 'fabrica' ),
		'description' => esc_html__( "Allow visitors to decide for themselves what personal data they want to store on your site", 'fabrica' ),
		'required'    => false,
		'logo'        => 'wp-gdpr-compliance.png',
		'group'       => $fabrica_theme_required_plugins_groups['other'],
	),
	'trx_updater'                => array(
		'title'       => esc_html__( 'ThemeREX Updater', 'fabrica' ),
		'description' => esc_html__( "Update theme and theme-specific plugins from developer's upgrade server.", 'fabrica' ),
		'required'    => false,
		'logo'        => 'trx_updater.png',
		'group'       => $fabrica_theme_required_plugins_groups['other'],
	),
);

if ( FABRICA_THEME_FREE ) {
	unset( $fabrica_theme_required_plugins['js_composer'] );
	unset( $fabrica_theme_required_plugins['booked'] );
	unset( $fabrica_theme_required_plugins['quickcal'] );
	unset( $fabrica_theme_required_plugins['the-events-calendar'] );
	unset( $fabrica_theme_required_plugins['calculated-fields-form'] );
	unset( $fabrica_theme_required_plugins['essential-grid'] );
	unset( $fabrica_theme_required_plugins['revslider'] );
	unset( $fabrica_theme_required_plugins['sitepress-multilingual-cms'] );
	unset( $fabrica_theme_required_plugins['trx_updater'] );
	unset( $fabrica_theme_required_plugins['trx_popup'] );
}

// Add plugins list to the global storage
fabrica_storage_set( 'required_plugins', $fabrica_theme_required_plugins );
