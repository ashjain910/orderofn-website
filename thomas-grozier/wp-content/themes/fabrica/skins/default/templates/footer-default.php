<?php
/**
 * The template to display default site footer
 *
 * @package FABRICA
 * @since FABRICA 1.0.10
 */

?>
<footer class="footer_wrap footer_default
<?php
$fabrica_footer_scheme = fabrica_get_theme_option( 'footer_scheme' );
if ( ! empty( $fabrica_footer_scheme ) && ! fabrica_is_inherit( $fabrica_footer_scheme  ) ) {
	echo ' scheme_' . esc_attr( $fabrica_footer_scheme );
}
?>
				">
	<?php

	// Footer widgets area
	get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/footer-widgets' ) );

	// Logo
	get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/footer-logo' ) );

	// Socials
	get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/footer-socials' ) );

	// Copyright area
	get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/footer-copyright' ) );

	?>
</footer><!-- /.footer_wrap -->
