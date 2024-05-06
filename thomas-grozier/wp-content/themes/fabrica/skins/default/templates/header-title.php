<?php
/**
 * The template to display the page title and breadcrumbs
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */

// Page (category, tag, archive, author) title

if ( fabrica_need_page_title() ) {
	fabrica_sc_layouts_showed( 'title', true );
	fabrica_sc_layouts_showed( 'postmeta', true );
	?>
	<div class="top_panel_title sc_layouts_row sc_layouts_row_type_normal">
		<div class="content_wrap">
			<div class="sc_layouts_column sc_layouts_column_align_center">
				<div class="sc_layouts_item">
					<div class="sc_layouts_title sc_align_center">
						<?php
						// Post meta on the single post
						if ( is_single() ) {
							?>
							<div class="sc_layouts_title_meta">
							<?php
								fabrica_show_post_meta(
									apply_filters(
										'fabrica_filter_post_meta_args', array(
											'components' => join( ',', fabrica_array_get_keys_by_value( fabrica_get_theme_option( 'meta_parts' ) ) ),
											'counters'   => join( ',', fabrica_array_get_keys_by_value( fabrica_get_theme_option( 'counters' ) ) ),
											'seo'        => fabrica_is_on( fabrica_get_theme_option( 'seo_snippets' ) ),
										), 'header', 1
									)
								);
							?>
							</div>
							<?php
						}

						// Blog/Post title
						?>
						<div class="sc_layouts_title_title">
							<?php
							$fabrica_blog_title           = fabrica_get_blog_title();
							$fabrica_blog_title_text      = '';
							$fabrica_blog_title_class     = '';
							$fabrica_blog_title_link      = '';
							$fabrica_blog_title_link_text = '';
							if ( is_array( $fabrica_blog_title ) ) {
								$fabrica_blog_title_text      = $fabrica_blog_title['text'];
								$fabrica_blog_title_class     = ! empty( $fabrica_blog_title['class'] ) ? ' ' . $fabrica_blog_title['class'] : '';
								$fabrica_blog_title_link      = ! empty( $fabrica_blog_title['link'] ) ? $fabrica_blog_title['link'] : '';
								$fabrica_blog_title_link_text = ! empty( $fabrica_blog_title['link_text'] ) ? $fabrica_blog_title['link_text'] : '';
							} else {
								$fabrica_blog_title_text = $fabrica_blog_title;
							}
							?>
							<h1 itemprop="headline" class="sc_layouts_title_caption<?php echo esc_attr( $fabrica_blog_title_class ); ?>">
								<?php
								$fabrica_top_icon = fabrica_get_term_image_small();
								if ( ! empty( $fabrica_top_icon ) ) {
									$fabrica_attr = fabrica_getimagesize( $fabrica_top_icon );
									?>
									<img src="<?php echo esc_url( $fabrica_top_icon ); ?>" alt="<?php esc_attr_e( 'Site icon', 'fabrica' ); ?>"
										<?php
										if ( ! empty( $fabrica_attr[3] ) ) {
											fabrica_show_layout( $fabrica_attr[3] );
										}
										?>
									>
									<?php
								}
								echo wp_kses_data( $fabrica_blog_title_text );
								?>
							</h1>
							<?php
							if ( ! empty( $fabrica_blog_title_link ) && ! empty( $fabrica_blog_title_link_text ) ) {
								?>
								<a href="<?php echo esc_url( $fabrica_blog_title_link ); ?>" class="theme_button theme_button_small sc_layouts_title_link"><?php echo esc_html( $fabrica_blog_title_link_text ); ?></a>
								<?php
							}

							// Category/Tag description
							if ( ! is_paged() && ( is_category() || is_tag() || is_tax() ) ) {
								the_archive_description( '<div class="sc_layouts_title_description">', '</div>' );
							}

							?>
						</div>
						<?php

						// Breadcrumbs
						ob_start();
						do_action( 'fabrica_action_breadcrumbs' );
						$fabrica_breadcrumbs = ob_get_contents();
						ob_end_clean();
						fabrica_show_layout( $fabrica_breadcrumbs, '<div class="sc_layouts_title_breadcrumbs">', '</div>' );
						?>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php
}
