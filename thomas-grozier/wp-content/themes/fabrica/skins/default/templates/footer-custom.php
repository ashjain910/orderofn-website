<?php
/**
 * The template to display default site footer
 *
 * @package FABRICA
 * @since FABRICA 1.0.10
 */

$fabrica_footer_id = fabrica_get_custom_footer_id();
$fabrica_footer_meta = get_post_meta( $fabrica_footer_id, 'trx_addons_options', true );
if ( ! empty( $fabrica_footer_meta['margin'] ) ) {
	fabrica_add_inline_css( sprintf( '.page_content_wrap{padding-bottom:%s}', esc_attr( fabrica_prepare_css_value( $fabrica_footer_meta['margin'] ) ) ) );
}
?>
<footer class="footer_wrap footer_custom footer_custom_<?php echo esc_attr( $fabrica_footer_id ); ?> footer_custom_<?php echo esc_attr( sanitize_title( get_the_title( $fabrica_footer_id ) ) ); ?>
						<?php
						$fabrica_footer_scheme = fabrica_get_theme_option( 'footer_scheme' );
						if ( ! empty( $fabrica_footer_scheme ) && ! fabrica_is_inherit( $fabrica_footer_scheme  ) ) {
							echo ' scheme_' . esc_attr( $fabrica_footer_scheme );
						}
						?>
						">
	<?php
	// Custom footer's layout
	do_action( 'fabrica_action_show_layout', $fabrica_footer_id );
	?>
</footer><!-- /.footer_wrap -->
