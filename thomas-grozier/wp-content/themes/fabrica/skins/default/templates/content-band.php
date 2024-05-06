<?php
/**
 * 'Band' template to display the content
 *
 * Used for index/archive/search.
 *
 * @package FABRICA
 * @since FABRICA 1.71.0
 */

$fabrica_template_args = get_query_var( 'fabrica_template_args' );
if ( ! is_array( $fabrica_template_args ) ) {
	$fabrica_template_args = array(
								'type'    => 'band',
								'columns' => 1
								);
}

$fabrica_columns       = 1;

$fabrica_expanded      = ! fabrica_sidebar_present() && fabrica_get_theme_option( 'expand_content' ) == 'expand';

$fabrica_post_format   = get_post_format();
$fabrica_post_format   = empty( $fabrica_post_format ) ? 'standard' : str_replace( 'post-format-', '', $fabrica_post_format );

if ( is_array( $fabrica_template_args ) ) {
	$fabrica_columns    = empty( $fabrica_template_args['columns'] ) ? 1 : max( 1, $fabrica_template_args['columns'] );
	$fabrica_blog_style = array( $fabrica_template_args['type'], $fabrica_columns );
	if ( ! empty( $fabrica_template_args['slider'] ) ) {
		?><div class="slider-slide swiper-slide">
		<?php
	} elseif ( $fabrica_columns > 1 ) {
	    $fabrica_columns_class = fabrica_get_column_class( 1, $fabrica_columns, ! empty( $fabrica_template_args['columns_tablet']) ? $fabrica_template_args['columns_tablet'] : '', ! empty($fabrica_template_args['columns_mobile']) ? $fabrica_template_args['columns_mobile'] : '' );
				?><div class="<?php echo esc_attr( $fabrica_columns_class ); ?>"><?php
	}
}
?>
<article id="post-<?php the_ID(); ?>" data-post-id="<?php the_ID(); ?>"
	<?php
	post_class( 'post_item post_item_container post_layout_band post_format_' . esc_attr( $fabrica_post_format ) );
	fabrica_add_blog_animation( $fabrica_template_args );
	?>
>
	<?php

	// Sticky label
	if ( is_sticky() && ! is_paged() ) {
		?>
		<span class="post_label label_sticky"></span>
		<?php
	}

	// Featured image
	$fabrica_hover      = ! empty( $fabrica_template_args['hover'] ) && ! fabrica_is_inherit( $fabrica_template_args['hover'] )
							? $fabrica_template_args['hover']
							: fabrica_get_theme_option( 'image_hover' );
	$fabrica_components = ! empty( $fabrica_template_args['meta_parts'] )
							? ( is_array( $fabrica_template_args['meta_parts'] )
								? $fabrica_template_args['meta_parts']
								: array_map( 'trim', explode( ',', $fabrica_template_args['meta_parts'] ) )
								)
							: fabrica_array_get_keys_by_value( fabrica_get_theme_option( 'meta_parts' ) );
	fabrica_show_post_featured( apply_filters( 'fabrica_filter_args_featured',
		array(
			'no_links'   => ! empty( $fabrica_template_args['no_links'] ),
			'hover'      => $fabrica_hover,
			'meta_parts' => $fabrica_components,
			'thumb_bg'   => true,
			'thumb_ratio'   => '1:1',
			'thumb_size' => ! empty( $fabrica_template_args['thumb_size'] )
								? $fabrica_template_args['thumb_size']
								: fabrica_get_thumb_size( 
								in_array( $fabrica_post_format, array( 'gallery', 'audio', 'video' ) )
									? ( strpos( fabrica_get_theme_option( 'body_style' ), 'full' ) !== false
										? 'full'
										: ( $fabrica_expanded 
											? 'big' 
											: 'medium-square'
											)
										)
									: 'masonry-big'
								)
		),
		'content-band',
		$fabrica_template_args
	) );

	?><div class="post_content_wrap"><?php

		// Title and post meta
		$fabrica_show_title = get_the_title() != '';
		$fabrica_show_meta  = count( $fabrica_components ) > 0 && ! in_array( $fabrica_hover, array( 'border', 'pull', 'slide', 'fade', 'info' ) );
		if ( $fabrica_show_title ) {
			?>
			<div class="post_header entry-header">
				<?php
				// Categories
				if ( apply_filters( 'fabrica_filter_show_blog_categories', $fabrica_show_meta && in_array( 'categories', $fabrica_components ), array( 'categories' ), 'band' ) ) {
					do_action( 'fabrica_action_before_post_category' );
					?>
					<div class="post_category">
						<?php
						fabrica_show_post_meta( apply_filters(
															'fabrica_filter_post_meta_args',
															array(
																'components' => 'categories',
																'seo'        => false,
																'echo'       => true,
																'cat_sep'    => false,
																),
															'hover_' . $fabrica_hover, 1
															)
											);
						?>
					</div>
					<?php
					$fabrica_components = fabrica_array_delete_by_value( $fabrica_components, 'categories' );
					do_action( 'fabrica_action_after_post_category' );
				}
				// Post title
				if ( apply_filters( 'fabrica_filter_show_blog_title', true, 'band' ) ) {
					do_action( 'fabrica_action_before_post_title' );
					if ( empty( $fabrica_template_args['no_links'] ) ) {
						the_title( sprintf( '<h4 class="post_title entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h4>' );
					} else {
						the_title( '<h4 class="post_title entry-title">', '</h4>' );
					}
					do_action( 'fabrica_action_after_post_title' );
				}
				?>
			</div><!-- .post_header -->
			<?php
		}

		// Post content
		if ( ! isset( $fabrica_template_args['excerpt_length'] ) && ! in_array( $fabrica_post_format, array( 'gallery', 'audio', 'video' ) ) ) {
			$fabrica_template_args['excerpt_length'] = 13;
		}
		if ( apply_filters( 'fabrica_filter_show_blog_excerpt', empty( $fabrica_template_args['hide_excerpt'] ) && fabrica_get_theme_option( 'excerpt_length' ) > 0, 'band' ) ) {
			?>
			<div class="post_content entry-content">
				<?php
				// Post content area
				fabrica_show_post_content( $fabrica_template_args, '<div class="post_content_inner">', '</div>' );
				?>
			</div><!-- .entry-content -->
			<?php
		}
		// Post meta
		if ( apply_filters( 'fabrica_filter_show_blog_meta', $fabrica_show_meta, $fabrica_components, 'band' ) ) {
			if ( count( $fabrica_components ) > 0 ) {
				do_action( 'fabrica_action_before_post_meta' );
				fabrica_show_post_meta(
					apply_filters(
						'fabrica_filter_post_meta_args', array(
							'components' => join( ',', $fabrica_components ),
							'seo'        => false,
							'echo'       => true,
						), 'band', 1
					)
				);
				do_action( 'fabrica_action_after_post_meta' );
			}
		}
		// More button
		if ( apply_filters( 'fabrica_filter_show_blog_readmore', ! $fabrica_show_title || ! empty( $fabrica_template_args['more_button'] ), 'band' ) ) {
			if ( empty( $fabrica_template_args['no_links'] ) ) {
				do_action( 'fabrica_action_before_post_readmore' );
				fabrica_show_post_more_link( $fabrica_template_args, '<div class="more-wrap">', '</div>' );
				do_action( 'fabrica_action_after_post_readmore' );
			}
		}
		?>
	</div>
</article>
<?php

if ( is_array( $fabrica_template_args ) ) {
	if ( ! empty( $fabrica_template_args['slider'] ) || $fabrica_columns > 1 ) {
		?>
		</div>
		<?php
	}
}