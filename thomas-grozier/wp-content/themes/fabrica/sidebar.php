<?php
/**
 * The Sidebar containing the main widget areas.
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */

if ( fabrica_sidebar_present() ) {
	
	$fabrica_sidebar_type = fabrica_get_theme_option( 'sidebar_type' );
	if ( 'custom' == $fabrica_sidebar_type && ! fabrica_is_layouts_available() ) {
		$fabrica_sidebar_type = 'default';
	}
	
	// Catch output to the buffer
	ob_start();
	if ( 'default' == $fabrica_sidebar_type ) {
		// Default sidebar with widgets
		$fabrica_sidebar_name = fabrica_get_theme_option( 'sidebar_widgets' );
		fabrica_storage_set( 'current_sidebar', 'sidebar' );
		if ( is_active_sidebar( $fabrica_sidebar_name ) ) {
			dynamic_sidebar( $fabrica_sidebar_name );
		}
	} else {
		// Custom sidebar from Layouts Builder
		$fabrica_sidebar_id = fabrica_get_custom_sidebar_id();
		do_action( 'fabrica_action_show_layout', $fabrica_sidebar_id );
	}
	$fabrica_out = trim( ob_get_contents() );
	ob_end_clean();
	
	// If any html is present - display it
	if ( ! empty( $fabrica_out ) ) {
		$fabrica_sidebar_position    = fabrica_get_theme_option( 'sidebar_position' );
		$fabrica_sidebar_position_ss = fabrica_get_theme_option( 'sidebar_position_ss' );
		?>
		<div class="sidebar widget_area
			<?php
			echo ' ' . esc_attr( $fabrica_sidebar_position );
			echo ' sidebar_' . esc_attr( $fabrica_sidebar_position_ss );
			echo ' sidebar_' . esc_attr( $fabrica_sidebar_type );

			$fabrica_sidebar_scheme = apply_filters( 'fabrica_filter_sidebar_scheme', fabrica_get_theme_option( 'sidebar_scheme' ) );
			if ( ! empty( $fabrica_sidebar_scheme ) && ! fabrica_is_inherit( $fabrica_sidebar_scheme ) && 'custom' != $fabrica_sidebar_type ) {
				echo ' scheme_' . esc_attr( $fabrica_sidebar_scheme );
			}
			?>
		" role="complementary">
			<?php

			// Skip link anchor to fast access to the sidebar from keyboard
			?>
			<a id="sidebar_skip_link_anchor" class="fabrica_skip_link_anchor" href="#"></a>
			<?php

			do_action( 'fabrica_action_before_sidebar_wrap', 'sidebar' );

			// Button to show/hide sidebar on mobile
			if ( in_array( $fabrica_sidebar_position_ss, array( 'above', 'float' ) ) ) {
				$fabrica_title = apply_filters( 'fabrica_filter_sidebar_control_title', 'float' == $fabrica_sidebar_position_ss ? esc_html__( 'Show Sidebar', 'fabrica' ) : '' );
				$fabrica_text  = apply_filters( 'fabrica_filter_sidebar_control_text', 'above' == $fabrica_sidebar_position_ss ? esc_html__( 'Show Sidebar', 'fabrica' ) : '' );
				?>
				<a href="#" class="sidebar_control" title="<?php echo esc_attr( $fabrica_title ); ?>"><?php echo esc_html( $fabrica_text ); ?></a>
				<?php
			}
			?>
			<div class="sidebar_inner">
				<?php
				do_action( 'fabrica_action_before_sidebar', 'sidebar' );
				fabrica_show_layout( preg_replace( "/<\/aside>[\r\n\s]*<aside/", '</aside><aside', $fabrica_out ) );
				do_action( 'fabrica_action_after_sidebar', 'sidebar' );
				?>
			</div>
			<?php

			do_action( 'fabrica_action_after_sidebar_wrap', 'sidebar' );

			?>
		</div>
		<div class="clearfix"></div>
		<?php
	}
}
