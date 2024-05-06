<?php
/**
 * The template to display default site header
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */

$fabrica_header_css   = '';
$fabrica_header_image = get_header_image();
$fabrica_header_video = fabrica_get_header_video();
if ( ! empty( $fabrica_header_image ) && fabrica_trx_addons_featured_image_override( is_singular() || fabrica_storage_isset( 'blog_archive' ) || is_category() ) ) {
	$fabrica_header_image = fabrica_get_current_mode_image( $fabrica_header_image );
}

?><header class="top_panel top_panel_default
	<?php
	echo ! empty( $fabrica_header_image ) || ! empty( $fabrica_header_video ) ? ' with_bg_image' : ' without_bg_image';
	if ( '' != $fabrica_header_video ) {
		echo ' with_bg_video';
	}
	if ( '' != $fabrica_header_image ) {
		echo ' ' . esc_attr( fabrica_add_inline_css_class( 'background-image: url(' . esc_url( $fabrica_header_image ) . ');' ) );
	}
	if ( is_single() && has_post_thumbnail() ) {
		echo ' with_featured_image';
	}
	if ( fabrica_is_on( fabrica_get_theme_option( 'header_fullheight' ) ) ) {
		echo ' header_fullheight fabrica-full-height';
	}
	$fabrica_header_scheme = fabrica_get_theme_option( 'header_scheme' );
	if ( ! empty( $fabrica_header_scheme ) && ! fabrica_is_inherit( $fabrica_header_scheme  ) ) {
		echo ' scheme_' . esc_attr( $fabrica_header_scheme );
	}
	?>
">
	<?php

	// Background video
	if ( ! empty( $fabrica_header_video ) ) {
		get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/header-video' ) );
	}

	// Main menu
	get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/header-navi' ) );

	// Mobile header
	if ( fabrica_is_on( fabrica_get_theme_option( 'header_mobile_enabled' ) ) ) {
		get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/header-mobile' ) );
	}

	// Page title and breadcrumbs area
	if ( ! is_single() ) {
		get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/header-title' ) );
	}

	// Header widgets area
	get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/header-widgets' ) );
	?>
</header>
