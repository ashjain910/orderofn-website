<?php
// Add plugin-specific colors and fonts to the custom CSS
if ( ! function_exists( 'fabrica_cf7_get_css' ) ) {
	add_filter( 'fabrica_filter_get_css', 'fabrica_cf7_get_css', 10, 2 );
	function fabrica_cf7_get_css( $css, $args ) {
		if ( isset( $css['fonts'] ) && isset( $args['fonts'] ) ) {
			$fonts         = $args['fonts'];
			$css['fonts'] .= <<<CSS

		
CSS;
		}

		return $css;
	}
}
