<?php
/**
 * The template to display the logo or the site name and the slogan in the Header
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */

$fabrica_args = get_query_var( 'fabrica_logo_args' );

// Site logo
$fabrica_logo_type   = isset( $fabrica_args['type'] ) ? $fabrica_args['type'] : '';
$fabrica_logo_image  = fabrica_get_logo_image( $fabrica_logo_type );
$fabrica_logo_text   = fabrica_is_on( fabrica_get_theme_option( 'logo_text' ) ) ? get_bloginfo( 'name' ) : '';
$fabrica_logo_slogan = get_bloginfo( 'description', 'display' );
if ( ! empty( $fabrica_logo_image['logo'] ) || ! empty( $fabrica_logo_text ) ) {
	?><a class="sc_layouts_logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
		<?php
		if ( ! empty( $fabrica_logo_image['logo'] ) ) {
			if ( empty( $fabrica_logo_type ) && function_exists( 'the_custom_logo' ) && is_numeric($fabrica_logo_image['logo']) && (int) $fabrica_logo_image['logo'] > 0 ) {
				the_custom_logo();
			} else {
				$fabrica_attr = fabrica_getimagesize( $fabrica_logo_image['logo'] );
				echo '<img src="' . esc_url( $fabrica_logo_image['logo'] ) . '"'
						. ( ! empty( $fabrica_logo_image['logo_retina'] ) ? ' srcset="' . esc_url( $fabrica_logo_image['logo_retina'] ) . ' 2x"' : '' )
						. ' alt="' . esc_attr( $fabrica_logo_text ) . '"'
						. ( ! empty( $fabrica_attr[3] ) ? ' ' . wp_kses_data( $fabrica_attr[3] ) : '' )
						. '>';
			}
		} else {
			fabrica_show_layout( fabrica_prepare_macros( $fabrica_logo_text ), '<span class="logo_text">', '</span>' );
			fabrica_show_layout( fabrica_prepare_macros( $fabrica_logo_slogan ), '<span class="logo_slogan">', '</span>' );
		}
		?>
	</a>
	<?php
}
