<?php
/**
 * The template to display the widgets area in the header
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */

// Header sidebar
$fabrica_header_name    = fabrica_get_theme_option( 'header_widgets' );
$fabrica_header_present = ! fabrica_is_off( $fabrica_header_name ) && is_active_sidebar( $fabrica_header_name );
if ( $fabrica_header_present ) {
	fabrica_storage_set( 'current_sidebar', 'header' );
	$fabrica_header_wide = fabrica_get_theme_option( 'header_wide' );
	ob_start();
	if ( is_active_sidebar( $fabrica_header_name ) ) {
		dynamic_sidebar( $fabrica_header_name );
	}
	$fabrica_widgets_output = ob_get_contents();
	ob_end_clean();
	if ( ! empty( $fabrica_widgets_output ) ) {
		$fabrica_widgets_output = preg_replace( "/<\/aside>[\r\n\s]*<aside/", '</aside><aside', $fabrica_widgets_output );
		$fabrica_need_columns   = strpos( $fabrica_widgets_output, 'columns_wrap' ) === false;
		if ( $fabrica_need_columns ) {
			$fabrica_columns = max( 0, (int) fabrica_get_theme_option( 'header_columns' ) );
			if ( 0 == $fabrica_columns ) {
				$fabrica_columns = min( 6, max( 1, fabrica_tags_count( $fabrica_widgets_output, 'aside' ) ) );
			}
			if ( $fabrica_columns > 1 ) {
				$fabrica_widgets_output = preg_replace( '/<aside([^>]*)class="widget/', '<aside$1class="column-1_' . esc_attr( $fabrica_columns ) . ' widget', $fabrica_widgets_output );
			} else {
				$fabrica_need_columns = false;
			}
		}
		?>
		<div class="header_widgets_wrap widget_area<?php echo ! empty( $fabrica_header_wide ) ? ' header_fullwidth' : ' header_boxed'; ?>">
			<?php do_action( 'fabrica_action_before_sidebar_wrap', 'header' ); ?>
			<div class="header_widgets_inner widget_area_inner">
				<?php
				if ( ! $fabrica_header_wide ) {
					?>
					<div class="content_wrap">
					<?php
				}
				if ( $fabrica_need_columns ) {
					?>
					<div class="columns_wrap">
					<?php
				}
				do_action( 'fabrica_action_before_sidebar', 'header' );
				fabrica_show_layout( $fabrica_widgets_output );
				do_action( 'fabrica_action_after_sidebar', 'header' );
				if ( $fabrica_need_columns ) {
					?>
					</div>	<!-- /.columns_wrap -->
					<?php
				}
				if ( ! $fabrica_header_wide ) {
					?>
					</div>	<!-- /.content_wrap -->
					<?php
				}
				?>
			</div>	<!-- /.header_widgets_inner -->
			<?php do_action( 'fabrica_action_after_sidebar_wrap', 'header' ); ?>
		</div>	<!-- /.header_widgets_wrap -->
		<?php
	}
}
