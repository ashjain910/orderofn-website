<?php
/**
 * The template to display the widgets area in the footer
 *
 * @package FABRICA
 * @since FABRICA 1.0.10
 */

// Footer sidebar
$fabrica_footer_name    = fabrica_get_theme_option( 'footer_widgets' );
$fabrica_footer_present = ! fabrica_is_off( $fabrica_footer_name ) && is_active_sidebar( $fabrica_footer_name );
if ( $fabrica_footer_present ) {
	fabrica_storage_set( 'current_sidebar', 'footer' );
	$fabrica_footer_wide = fabrica_get_theme_option( 'footer_wide' );
	ob_start();
	if ( is_active_sidebar( $fabrica_footer_name ) ) {
		dynamic_sidebar( $fabrica_footer_name );
	}
	$fabrica_out = trim( ob_get_contents() );
	ob_end_clean();
	if ( ! empty( $fabrica_out ) ) {
		$fabrica_out          = preg_replace( "/<\\/aside>[\r\n\s]*<aside/", '</aside><aside', $fabrica_out );
		$fabrica_need_columns = true;   //or check: strpos($fabrica_out, 'columns_wrap')===false;
		if ( $fabrica_need_columns ) {
			$fabrica_columns = max( 0, (int) fabrica_get_theme_option( 'footer_columns' ) );			
			if ( 0 == $fabrica_columns ) {
				$fabrica_columns = min( 4, max( 1, fabrica_tags_count( $fabrica_out, 'aside' ) ) );
			}
			if ( $fabrica_columns > 1 ) {
				$fabrica_out = preg_replace( '/<aside([^>]*)class="widget/', '<aside$1class="column-1_' . esc_attr( $fabrica_columns ) . ' widget', $fabrica_out );
			} else {
				$fabrica_need_columns = false;
			}
		}
		?>
		<div class="footer_widgets_wrap widget_area<?php echo ! empty( $fabrica_footer_wide ) ? ' footer_fullwidth' : ''; ?> sc_layouts_row sc_layouts_row_type_normal">
			<?php do_action( 'fabrica_action_before_sidebar_wrap', 'footer' ); ?>
			<div class="footer_widgets_inner widget_area_inner">
				<?php
				if ( ! $fabrica_footer_wide ) {
					?>
					<div class="content_wrap">
					<?php
				}
				if ( $fabrica_need_columns ) {
					?>
					<div class="columns_wrap">
					<?php
				}
				do_action( 'fabrica_action_before_sidebar', 'footer' );
				fabrica_show_layout( $fabrica_out );
				do_action( 'fabrica_action_after_sidebar', 'footer' );
				if ( $fabrica_need_columns ) {
					?>
					</div><!-- /.columns_wrap -->
					<?php
				}
				if ( ! $fabrica_footer_wide ) {
					?>
					</div><!-- /.content_wrap -->
					<?php
				}
				?>
			</div><!-- /.footer_widgets_inner -->
			<?php do_action( 'fabrica_action_after_sidebar_wrap', 'footer' ); ?>
		</div><!-- /.footer_widgets_wrap -->
		<?php
	}
}
