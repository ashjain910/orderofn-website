<?php
/**
 * The template to display the socials in the footer
 *
 * @package FABRICA
 * @since FABRICA 1.0.10
 */


// Socials
if ( fabrica_is_on( fabrica_get_theme_option( 'socials_in_footer' ) ) ) {
	$fabrica_output = fabrica_get_socials_links();
	if ( '' != $fabrica_output ) {
		?>
		<div class="footer_socials_wrap socials_wrap">
			<div class="footer_socials_inner">
				<?php fabrica_show_layout( $fabrica_output ); ?>
			</div>
		</div>
		<?php
	}
}
