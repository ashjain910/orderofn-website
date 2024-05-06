<?php
// Add plugin-specific colors and fonts to the custom CSS
if ( ! function_exists( 'fabrica_m_chart_get_css' ) ) {
	add_filter( 'fabrica_filter_get_css', 'fabrica_m_chart_get_css', 10, 2 );
	function fabrica_m_chart_get_css( $css, $args ) {
		if ( isset( $css['fonts'] ) && isset( $args['fonts'] ) ) {
			$fonts         = $args['fonts'];
			$css['fonts'] .= <<<CSS

.highcharts-legend-item text,
.highcharts-tooltip tspan {
	{$fonts['p_font-family']}
}

CSS;
		}

		return $css;
	}
}

// Load skin-specific functions
$fdir = fabrica_get_file_dir( 'plugins/m-chart/m-chart-skin.php' );
if ( ! empty( $fdir ) ) {
	require_once $fdir;
}

