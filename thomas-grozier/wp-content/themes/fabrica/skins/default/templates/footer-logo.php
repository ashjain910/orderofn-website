<?php
/**
 * The template to display the site logo in the footer
 *
 * @package FABRICA
 * @since FABRICA 1.0.10
 */

// Logo
if ( fabrica_is_on( fabrica_get_theme_option( 'logo_in_footer' ) ) ) {
	$fabrica_logo_image = fabrica_get_logo_image( 'footer' );
	$fabrica_logo_text  = get_bloginfo( 'name' );
	if ( ! empty( $fabrica_logo_image['logo'] ) || ! empty( $fabrica_logo_text ) ) {
		?>
		<div class="footer_logo_wrap">
			<div class="footer_logo_inner">
				<?php
				if ( ! empty( $fabrica_logo_image['logo'] ) ) {
					$fabrica_attr = fabrica_getimagesize( $fabrica_logo_image['logo'] );
					echo '<a href="' . esc_url( home_url( '/' ) ) . '">'
							. '<img src="' . esc_url( $fabrica_logo_image['logo'] ) . '"'
								. ( ! empty( $fabrica_logo_image['logo_retina'] ) ? ' srcset="' . esc_url( $fabrica_logo_image['logo_retina'] ) . ' 2x"' : '' )
								. ' class="logo_footer_image"'
								. ' alt="' . esc_attr__( 'Site logo', 'fabrica' ) . '"'
								. ( ! empty( $fabrica_attr[3] ) ? ' ' . wp_kses_data( $fabrica_attr[3] ) : '' )
							. '>'
						. '</a>';
				} elseif ( ! empty( $fabrica_logo_text ) ) {
					echo '<h1 class="logo_footer_text">'
							. '<a href="' . esc_url( home_url( '/' ) ) . '">'
								. esc_html( $fabrica_logo_text )
							. '</a>'
						. '</h1>';
				}
				?>
			</div>
		</div>
		<?php
	}
}
