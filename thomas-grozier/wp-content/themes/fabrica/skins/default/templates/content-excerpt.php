<?php
/**
 * The default template to display the content
 *
 * Used for index/archive/search.
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */

$fabrica_template_args = get_query_var( 'fabrica_template_args' );
$fabrica_columns = 1;
if ( is_array( $fabrica_template_args ) ) {
	$fabrica_columns    = empty( $fabrica_template_args['columns'] ) ? 1 : max( 1, $fabrica_template_args['columns'] );
	$fabrica_blog_style = array( $fabrica_template_args['type'], $fabrica_columns );
	if ( ! empty( $fabrica_template_args['slider'] ) ) {
		?><div class="slider-slide swiper-slide">
		<?php
	} elseif ( $fabrica_columns > 1 ) {
	    $fabrica_columns_class = fabrica_get_column_class( 1, $fabrica_columns, ! empty( $fabrica_template_args['columns_tablet']) ? $fabrica_template_args['columns_tablet'] : '', ! empty($fabrica_template_args['columns_mobile']) ? $fabrica_template_args['columns_mobile'] : '' );
		?>
		<div class="<?php echo esc_attr( $fabrica_columns_class ); ?>">
		<?php
	}
} else {
	$fabrica_template_args = array();
}
$fabrica_expanded    = ! fabrica_sidebar_present() && fabrica_get_theme_option( 'expand_content' ) == 'expand';
$fabrica_post_format = get_post_format();
$fabrica_post_format = empty( $fabrica_post_format ) ? 'standard' : str_replace( 'post-format-', '', $fabrica_post_format );
?>
<article id="post-<?php the_ID(); ?>" data-post-id="<?php the_ID(); ?>"
	<?php
	post_class( 'post_item post_item_container post_layout_excerpt post_format_' . esc_attr( $fabrica_post_format ) );
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
			'thumb_size' => ! empty( $fabrica_template_args['thumb_size'] )
							? $fabrica_template_args['thumb_size']
							: fabrica_get_thumb_size( strpos( fabrica_get_theme_option( 'body_style' ), 'full' ) !== false
								? 'full'
								: ( $fabrica_expanded 
									? 'huge' 
									: 'big' 
									)
								),
		),
		'content-excerpt',
		$fabrica_template_args
	) );

	// Title and post meta
	$fabrica_show_title = get_the_title() != '';
	$fabrica_show_meta  = count( $fabrica_components ) > 0 && ! in_array( $fabrica_hover, array( 'border', 'pull', 'slide', 'fade', 'info' ) );

	if ( $fabrica_show_title ) {
		?>
		<div class="post_header entry-header">
			<?php
			// Post title
			if ( apply_filters( 'fabrica_filter_show_blog_title', true, 'excerpt' ) ) {
				do_action( 'fabrica_action_before_post_title' );
				if ( empty( $fabrica_template_args['no_links'] ) ) {
					the_title( sprintf( '<h3 class="post_title entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h3>' );
				} else {
					the_title( '<h3 class="post_title entry-title">', '</h3>' );
				}
				do_action( 'fabrica_action_after_post_title' );
			}
			?>
		</div><!-- .post_header -->
		<?php
	}

	// Post content
	if ( apply_filters( 'fabrica_filter_show_blog_excerpt', empty( $fabrica_template_args['hide_excerpt'] ) && fabrica_get_theme_option( 'excerpt_length' ) > 0, 'excerpt' ) ) {
		?>
		<div class="post_content entry-content">
			<?php

			// Post meta
			if ( apply_filters( 'fabrica_filter_show_blog_meta', $fabrica_show_meta, $fabrica_components, 'excerpt' ) ) {
				if ( count( $fabrica_components ) > 0 ) {
					do_action( 'fabrica_action_before_post_meta' );
					fabrica_show_post_meta(
						apply_filters(
							'fabrica_filter_post_meta_args', array(
								'components' => join( ',', $fabrica_components ),
								'seo'        => false,
								'echo'       => true,
							), 'excerpt', 1
						)
					);
					do_action( 'fabrica_action_after_post_meta' );
				}
			}

			if ( fabrica_get_theme_option( 'blog_content' ) == 'fullpost' ) {
				// Post content area
				?>
				<div class="post_content_inner">
					<?php
					do_action( 'fabrica_action_before_full_post_content' );
					the_content( '' );
					do_action( 'fabrica_action_after_full_post_content' );
					?>
				</div>
				<?php
				// Inner pages
				wp_link_pages(
					array(
						'before'      => '<div class="page_links"><span class="page_links_title">' . esc_html__( 'Pages:', 'fabrica' ) . '</span>',
						'after'       => '</div>',
						'link_before' => '<span>',
						'link_after'  => '</span>',
						'pagelink'    => '<span class="screen-reader-text">' . esc_html__( 'Page', 'fabrica' ) . ' </span>%',
						'separator'   => '<span class="screen-reader-text">, </span>',
					)
				);
			} else {
				// Post content area
				fabrica_show_post_content( $fabrica_template_args, '<div class="post_content_inner">', '</div>' );
			}

			// More button
			if ( apply_filters( 'fabrica_filter_show_blog_readmore',  ! isset( $fabrica_template_args['more_button'] ) || ! empty( $fabrica_template_args['more_button'] ), 'excerpt' ) ) {
				if ( empty( $fabrica_template_args['no_links'] ) ) {
					do_action( 'fabrica_action_before_post_readmore' );
					if ( fabrica_get_theme_option( 'blog_content' ) != 'fullpost' ) {
						fabrica_show_post_more_link( $fabrica_template_args, '<p>', '</p>' );
					} else {
						fabrica_show_post_comments_link( $fabrica_template_args, '<p>', '</p>' );
					}
					do_action( 'fabrica_action_after_post_readmore' );
				}
			}

			?>
		</div><!-- .entry-content -->
		<?php
	}
	?>
</article>
<?php

if ( is_array( $fabrica_template_args ) ) {
	if ( ! empty( $fabrica_template_args['slider'] ) || $fabrica_columns > 1 ) {
		?>
		</div>
		<?php
	}
}
