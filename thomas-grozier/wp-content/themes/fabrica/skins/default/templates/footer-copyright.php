<?php
/**
 * The template to display the copyright info in the footer
 *
 * @package FABRICA
 * @since FABRICA 1.0.10
 */

// Copyright area
?> 
<div class="footer_copyright_wrap
<?php
$fabrica_copyright_scheme = fabrica_get_theme_option( 'copyright_scheme' );
if ( ! empty( $fabrica_copyright_scheme ) && ! fabrica_is_inherit( $fabrica_copyright_scheme  ) ) {
	echo ' scheme_' . esc_attr( $fabrica_copyright_scheme );
}
?>
				">
	<div class="footer_copyright_inner">
		<div class="content_wrap">
			<div class="copyright_text">
			<?php
				$fabrica_copyright = fabrica_get_theme_option( 'copyright' );
			if ( ! empty( $fabrica_copyright ) ) {
				// Replace {{Y}} or {Y} with the current year
				$fabrica_copyright = str_replace( array( '{{Y}}', '{Y}' ), date( 'Y' ), $fabrica_copyright );
				// Replace {{...}} and ((...)) on the <i>...</i> and <b>...</b>
				$fabrica_copyright = fabrica_prepare_macros( $fabrica_copyright );
				// Display copyright
				echo wp_kses( nl2br( $fabrica_copyright ), 'fabrica_kses_content' );
			}
			?>
			</div>
		</div>
	</div>
</div>
