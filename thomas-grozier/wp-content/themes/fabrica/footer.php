<?php
/**
 * The Footer: widgets area, logo, footer menu and socials
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */

							do_action( 'fabrica_action_page_content_end_text' );
							
							// Widgets area below the content
							fabrica_create_widgets_area( 'widgets_below_content' );
						
							do_action( 'fabrica_action_page_content_end' );
							?>
						</div>
						<?php
						
						do_action( 'fabrica_action_after_page_content' );

						// Show main sidebar
						get_sidebar();

						do_action( 'fabrica_action_content_wrap_end' );
						?>
					</div>
					<?php

					do_action( 'fabrica_action_after_content_wrap' );

					// Widgets area below the page and related posts below the page
					$fabrica_body_style = fabrica_get_theme_option( 'body_style' );
					$fabrica_widgets_name = fabrica_get_theme_option( 'widgets_below_page' );
					$fabrica_show_widgets = ! fabrica_is_off( $fabrica_widgets_name ) && is_active_sidebar( $fabrica_widgets_name );
					$fabrica_show_related = fabrica_is_single() && fabrica_get_theme_option( 'related_position' ) == 'below_page';
					if ( $fabrica_show_widgets || $fabrica_show_related ) {
						if ( 'fullscreen' != $fabrica_body_style ) {
							?>
							<div class="content_wrap">
							<?php
						}
						// Show related posts before footer
						if ( $fabrica_show_related ) {
							do_action( 'fabrica_action_related_posts' );
						}

						// Widgets area below page content
						if ( $fabrica_show_widgets ) {
							fabrica_create_widgets_area( 'widgets_below_page' );
						}
						if ( 'fullscreen' != $fabrica_body_style ) {
							?>
							</div>
							<?php
						}
					}
					do_action( 'fabrica_action_page_content_wrap_end' );
					?>
			</div>
			<?php
			do_action( 'fabrica_action_after_page_content_wrap' );

			// Don't display the footer elements while actions 'full_post_loading' and 'prev_post_loading'
			if ( ( ! fabrica_is_singular( 'post' ) && ! fabrica_is_singular( 'attachment' ) ) || ! in_array ( fabrica_get_value_gp( 'action' ), array( 'full_post_loading', 'prev_post_loading' ) ) ) {
				
				// Skip link anchor to fast access to the footer from keyboard
				?>
				<a id="footer_skip_link_anchor" class="fabrica_skip_link_anchor" href="#"></a>
				<?php

				do_action( 'fabrica_action_before_footer' );

				// Footer
				$fabrica_footer_type = fabrica_get_theme_option( 'footer_type' );
				if ( 'custom' == $fabrica_footer_type && ! fabrica_is_layouts_available() ) {
					$fabrica_footer_type = 'default';
				}
				get_template_part( apply_filters( 'fabrica_filter_get_template_part', "templates/footer-" . sanitize_file_name( $fabrica_footer_type ) ) );

				do_action( 'fabrica_action_after_footer' );

			}
			?>

			<?php do_action( 'fabrica_action_page_wrap_end' ); ?>

		</div>

		<?php do_action( 'fabrica_action_after_page_wrap' ); ?>

	</div>

	<?php do_action( 'fabrica_action_after_body' ); ?>

	<?php wp_footer(); ?>

</body>
</html>