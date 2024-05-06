<?php
/**
 * The template to display custom header from the ThemeREX Addons Layouts
 *
 * @package FABRICA
 * @since FABRICA 1.0.06
 */

$fabrica_header_css   = '';
$fabrica_header_image = get_header_image();
$fabrica_header_video = fabrica_get_header_video();
if ( ! empty( $fabrica_header_image ) && fabrica_trx_addons_featured_image_override( is_singular() || fabrica_storage_isset( 'blog_archive' ) || is_category() ) ) {
	$fabrica_header_image = fabrica_get_current_mode_image( $fabrica_header_image );
}

$fabrica_header_id = fabrica_get_custom_header_id();
$fabrica_header_meta = get_post_meta( $fabrica_header_id, 'trx_addons_options', true );
if ( ! empty( $fabrica_header_meta['margin'] ) ) {
	fabrica_add_inline_css( sprintf( '.page_content_wrap{padding-top:%s}', esc_attr( fabrica_prepare_css_value( $fabrica_header_meta['margin'] ) ) ) );
}

?><header class="top_panel top_panel_custom top_panel_custom_<?php echo esc_attr( $fabrica_header_id ); ?> top_panel_custom_<?php echo esc_attr( sanitize_title( get_the_title( $fabrica_header_id ) ) ); ?>
				<?php
				echo ! empty( $fabrica_header_image ) || ! empty( $fabrica_header_video )
					? ' with_bg_image'
					: ' without_bg_image';
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

	// Custom header's layout
	do_action( 'fabrica_action_show_layout', $fabrica_header_id );

	// Header widgets area
	get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/header-widgets' ) );

	?>
</header>
