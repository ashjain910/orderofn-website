<?php
/* M Chart support functions
------------------------------------------------------------------------------- */


// Check if plugin installed and activated
if ( ! function_exists( 'fabrica_exists_m_chart' ) ) {
	function fabrica_exists_m_chart() {
		return class_exists( 'M_Chart' );
	}
}

// Theme init priorities:
// 9 - register other filters (for installer, etc.)
if ( ! function_exists( 'fabrica_m_chart_theme_setup9' ) ) {
	add_action( 'after_setup_theme', 'fabrica_m_chart_theme_setup9', 9 );
	function fabrica_m_chart_theme_setup9() {
		if ( fabrica_exists_m_chart() ) {
			add_action( 'wp_enqueue_scripts', 'fabrica_m_chart_frontend_scripts', 1100 );
			add_action( 'trx_addons_action_load_scripts_front_m_chart', 'fabrica_m_chart_frontend_scripts', 10, 1 );

			add_filter( 'fabrica_filter_merge_styles', 'fabrica_m_chart_merge_styles' );
			add_filter( 'fabrica_filter_merge_scripts', 'fabrica_m_chart_merge_scripts' );
		}
		if ( is_admin() ) {
            add_filter( 'fabrica_filter_tgmpa_required_plugins', 'fabrica_m_chart_tgmpa_required_plugins' );
        }
	}
}

// Filter to add in the required plugins list
if ( ! function_exists( 'fabrica_m_chart_tgmpa_required_plugins' ) ) {    
    function fabrica_m_chart_tgmpa_required_plugins( $list = array() ) {
        if ( fabrica_storage_isset( 'required_plugins', 'm-chart' ) && fabrica_storage_get_array( 'required_plugins', 'm-chart', 'install' ) !== false ) {
            $list[] = array(
                'name'     => fabrica_storage_get_array( 'required_plugins', 'm-chart', 'title' ),
                'slug'     => 'm-chart',
                'required' => false,
            );
        }
        if ( fabrica_storage_isset( 'required_plugins', 'm-chart-highcharts-library' ) && fabrica_storage_get_array( 'required_plugins', 'm-chart-highcharts-library', 'install' ) !== false ) {
            $path = fabrica_get_plugin_source_path( 'plugins/m-chart-highcharts-library/m-chart-highcharts-library.zip' );
			if ( ! empty( $path ) || fabrica_get_theme_setting( 'tgmpa_upload' ) ) {
				$list[] = array(
					'name'     => fabrica_storage_get_array( 'required_plugins', 'm-chart-highcharts-library', 'title' ),
					'slug'     => 'm-chart-highcharts-library',
					'source'   => ! empty( $path ) ? $path : 'upload://m-chart-highcharts-library.zip',
					'version'  => '1.2.3',
					'required' => false,
				);
			}
        }
        return $list;
    }
}


// Styles & Scripts
//------------------------------------------------------------------------
// Enqueue custom scripts
if ( ! function_exists( 'fabrica_m_chart_frontend_scripts' ) ) {
	//Handler of the add_action( 'wp_enqueue_scripts', 'fabrica_m_chart_frontend_scripts', 1100 );
	//Handler of the add_action( 'trx_addons_action_load_scripts_front_m_chart', 'fabrica_m_chart_frontend_scripts', 10, 1 );
	function fabrica_m_chart_frontend_scripts( $force = false ) {
		static $loaded = false;
		if ( ! $loaded && (
			current_action() == 'wp_enqueue_scripts' && fabrica_need_frontend_scripts( 'm_chart' )
			||
			current_action() != 'wp_enqueue_scripts' && $force === true
			)
		) {
			$loaded = true;
			$fabrica_url = fabrica_get_file_url( 'plugins/m-chart/m-chart.css' );
			if ( '' != $fabrica_url ) {
				wp_enqueue_style( 'fabrica-m-chart', $fabrica_url, array(), null );
			}
			$fabrica_url = fabrica_get_file_url( 'plugins/m-chart/m-chart.js' );
			if ( '' != $fabrica_url ) {
				wp_enqueue_script( 'fabrica-m-chart', $fabrica_url, array( 'jquery', 'highcharts' ), null, true );
			}
		}
	}
}

// Merge custom styles
if ( ! function_exists( 'fabrica_m_chart_merge_styles' ) ) {
	//Handler of the add_filter('fabrica_filter_merge_styles', 'fabrica_m_chart_merge_styles');
	function fabrica_m_chart_merge_styles( $list ) {
		$list[ 'plugins/m-chart/m-chart.css' ] = true;
		return $list;
	}
}

// Merge custom scripts
if ( ! function_exists( 'fabrica_m_chart_merge_scripts' ) ) {
	//Handler of the add_filter('fabrica_filter_merge_scripts', 'fabrica_m_chart_merge_scripts');
	function fabrica_m_chart_merge_scripts( $list ) {
		$list[ 'plugins/m-chart/m-chart.js' ] = true;
		return $list;
	}
}

// Merge custom scripts
if ( ! function_exists( 'fabrica_m_chart_script_deps' ) ) {
	 add_filter('trx_addons_filter_script_deps', 'fabrica_m_chart_script_deps');
	function fabrica_m_chart_script_deps( $list ) {
		if ( fabrica_exists_m_chart() ) {
			array_push($list, 'highcharts');
		}
		return $list;
	}
}

// Add plugin-specific colors and fonts to the custom CSS
if ( fabrica_exists_m_chart() ) {
	require_once fabrica_get_file_dir( 'plugins/m-chart/m-chart-style.php' );
}

// Load required styles and scripts for the frontend
if ( !function_exists( 'fabrica_m_chart_load_scripts_front' ) ) {
	add_action( "wp_enqueue_scripts", 'fabrica_m_chart_load_scripts_front', 20 );
	add_action( 'trx_addons_action_pagebuilder_preview_scripts', 'fabrica_m_chart_load_scripts_front', 10, 1 );
	function fabrica_m_chart_load_scripts_front( $force = false ) {
		static $loaded = false;
		if ( ! fabrica_exists_m_chart() || !fabrica_exists_trx_addons() ) return;
		$debug    = trx_addons_is_on( trx_addons_get_option( 'debug_mode' ) );
		$optimize = ! trx_addons_is_off( trx_addons_get_option( 'optimize_css_and_js_loading' ) );
		$preview_elm = trx_addons_is_preview( 'elementor' );
		$preview_gb  = trx_addons_is_preview( 'gutenberg' );
		$theme_full  = current_theme_supports( 'styles-and-scripts-full-merged' );
		$need        = ! $loaded && ( ! $preview_elm || $debug ) && ! $preview_gb && $optimize && (
						$force === true
							|| ( $preview_elm && $debug )
							|| trx_addons_sc_check_in_content( array(
									'sc' => 'm_chart',
									'entries' => array(
												array( 'type' => 'sc',  'sc' => 'chart' ),
												//array( 'type' => 'gb',  'sc' => 'wp:trx-addons/charts' ),// This sc is not exists for GB
												array( 'type' => 'elm', 'sc' => '"widgetType":"chart"' ),
												array( 'type' => 'elm', 'sc' => '"shortcode":"[chart' ),
									)
								) ) );
		if ( ! $loaded && ! $preview_gb && ( ( ! $optimize && $debug ) || ( $optimize && $need ) ) ) {
			$loaded = true;
			do_action( 'trx_addons_action_load_scripts_front', $force, 'm_chart' );
		}
		if ( ! $loaded && $preview_elm && $optimize && ! $debug && ! $theme_full ) {
			do_action( 'trx_addons_action_load_scripts_front', false, 'm_chart', 2 );
		}
	}
}

// Load styles and scripts if present in the cache of the menu or layouts or finally in the whole page output
if ( !function_exists( 'fabrica_m_chart_check_in_html_output' ) ) {
	add_action( 'trx_addons_action_check_page_content', 'fabrica_m_chart_check_in_html_output', 10, 1 );
	function fabrica_m_chart_check_in_html_output( $content = '' ) {
		if ( fabrica_exists_m_chart()
			&& ! trx_addons_need_frontend_scripts( 'm_chart' )
			&& ! trx_addons_is_off( trx_addons_get_option( 'optimize_css_and_js_loading' ) )
		) {
			$checklist = apply_filters( 'trx_addons_filter_check_in_html', array(
							'class=[\'"][^\'"]*m-chart',
							),
							'm_chart'
						);
			foreach ( $checklist as $item ) {
				if ( preg_match( "#{$item}#", $content, $matches ) ) {
					fabrica_m_chart_load_scripts_front( true );
					break;
				}
			}
		}
		return $content;
	}
}

// Remove plugin-specific styles if present in the page head output
if ( !function_exists( 'fabrica_m_chart_filter_head_output' ) ) {
	add_filter( 'trx_addons_filter_page_head', 'fabrica_m_chart_filter_head_output', 10, 1 );
	function fabrica_m_chart_filter_head_output( $content = '' ) {
		if ( fabrica_exists_m_chart()
			&& trx_addons_get_option( 'optimize_css_and_js_loading' ) == 'full'
			&& ! trx_addons_is_preview()
			&& ! trx_addons_need_frontend_scripts( 'm_chart' )
			&& apply_filters( 'trx_addons_filter_remove_3rd_party_styles', true, 'm_chart' )
		) {
			$content = preg_replace( '#<link[^>]*href=[\'"][^\'"]*/m-chart/[^>]*>#', '', $content );
		}
		return $content;
	}
}

// Remove plugin-specific styles and scripts if present in the page body output
if ( !function_exists( 'fabrica_m_chart_filter_body_output' ) ) {
	add_filter( 'trx_addons_filter_page_content', 'fabrica_m_chart_filter_body_output', 10, 1 );
	function fabrica_m_chart_filter_body_output( $content = '' ) {
		if ( fabrica_exists_m_chart()
			&& trx_addons_get_option( 'optimize_css_and_js_loading' ) == 'full'
			&& ! trx_addons_is_preview()
			&& ! trx_addons_need_frontend_scripts( 'm_chart' )
			&& apply_filters( 'trx_addons_filter_remove_3rd_party_styles', true, 'm_chart' )
		) {
			$content = preg_replace( '#<link[^>]*href=[\'"][^\'"]*/m-chart/[^>]*>#', '', $content );
			$content = preg_replace( '#<script[^>]*src=[\'"][^\'"]*/m-chart/[^>]*>[\\s\\S]*</script>#U', '', $content );
			$content = preg_replace( '#<script[^>]*id=[\'"]m-chart[^>]*>[\\s\\S]*</script>#U', '', $content );
		}
		return $content;
	}
}


// Other
//------------------------------------------------------------------------
// This filter hook is triggered after all of the Highcharts/Chart.js chart args for a given chart have been generated.
if ( ! function_exists( 'fabrica_m_chart_chart_args' ) ) {
	add_filter( 'm_chart_chart_args', 'fabrica_m_chart_chart_args', 10, 4 );
	function fabrica_m_chart_chart_args( $chart_args, $post, $post_meta, $args ) {
		// Type: Columns & Pie & Polar
		if ( in_array( $chart_args['chart']['type'], array( 'column', 'pie', 'polar', 'area', 'spline', 'line' ) )  ) {		
			$chart_args['colors'] = array(
				fabrica_get_scheme_color( 'text_link' ),
				fabrica_get_scheme_color( 'text_link2' ),
				fabrica_get_scheme_color( 'text_link3' ),
				fabrica_get_scheme_color( 'text_dark' ),
			);
		}
		return $chart_args;
	}
}


// One-click import support
//------------------------------------------------------------------------
// Set plugin's specific importer options
if ( !function_exists( 'fabrica_m_chart_importer_set_options' ) ) {
	add_filter( 'trx_addons_filter_importer_options',	'fabrica_m_chart_importer_set_options' );
	function fabrica_m_chart_importer_set_options($options=array()) {
		if ( fabrica_exists_m_chart()  && in_array('m-chart', $options['required_plugins']) ) {
			$options['additional_options'][]	= 'm-chart%';
		}
		return $options;
	}
}