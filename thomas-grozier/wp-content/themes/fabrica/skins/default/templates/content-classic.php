<?php
/**
 * The Classic template to display the content
 *
 * Used for index/archive/search.
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */

$fabrica_template_args = get_query_var( 'fabrica_template_args' );

if ( is_array( $fabrica_template_args ) ) {
	$fabrica_columns    = empty( $fabrica_template_args['columns'] ) ? 2 : max( 1, $fabrica_template_args['columns'] );
	$fabrica_blog_style = array( $fabrica_template_args['type'], $fabrica_columns );
    $fabrica_columns_class = fabrica_get_column_class( 1, $fabrica_columns, ! empty( $fabrica_template_args['columns_tablet']) ? $fabrica_template_args['columns_tablet'] : '', ! empty($fabrica_template_args['columns_mobile']) ? $fabrica_template_args['columns_mobile'] : '' );
} else {
	$fabrica_template_args = array();
	$fabrica_blog_style = explode( '_', fabrica_get_theme_option( 'blog_style' ) );
	$fabrica_columns    = empty( $fabrica_blog_style[1] ) ? 2 : max( 1, $fabrica_blog_style[1] );
    $fabrica_columns_class = fabrica_get_column_class( 1, $fabrica_columns );
}
$fabrica_expanded   = ! fabrica_sidebar_present() && fabrica_get_theme_option( 'expand_content' ) == 'expand';

$fabrica_post_format = get_post_format();
$fabrica_post_format = empty( $fabrica_post_format ) ? 'standard' : str_replace( 'post-format-', '', $fabrica_post_format );

?><div class="<?php
	if ( ! empty( $fabrica_template_args['slider'] ) ) {
		echo ' slider-slide swiper-slide';
	} else {
		echo ( fabrica_is_blog_style_use_masonry( $fabrica_blog_style[0] ) ? 'masonry_item masonry_item-1_' . esc_attr( $fabrica_columns ) : esc_attr( $fabrica_columns_class ) );
	}
?>"><article id="post-<?php the_ID(); ?>" data-post-id="<?php the_ID(); ?>"
	<?php
	post_class(
		'post_item post_item_container post_format_' . esc_attr( $fabrica_post_format )
				. ' post_layout_classic post_layout_classic_' . esc_attr( $fabrica_columns )
				. ' post_layout_' . esc_attr( $fabrica_blog_style[0] )
				. ' post_layout_' . esc_attr( $fabrica_blog_style[0] ) . '_' . esc_attr( $fabrica_columns )
	);
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
								: explode( ',', $fabrica_template_args['meta_parts'] )
								)
							: fabrica_array_get_keys_by_value( fabrica_get_theme_option( 'meta_parts' ) );

	fabrica_show_post_featured( apply_filters( 'fabrica_filter_args_featured',
		array(
			'thumb_size' => ! empty( $fabrica_template_args['thumb_size'] )
				? $fabrica_template_args['thumb_size']
				: fabrica_get_thumb_size(
					'classic' == $fabrica_blog_style[0]
						? ( strpos( fabrica_get_theme_option( 'body_style' ), 'full' ) !== false
								? ( $fabrica_columns > 2 ? 'big' : 'huge' )
								: ( $fabrica_columns > 2
									? ( $fabrica_expanded ? 'square' : 'square' )
									: ($fabrica_columns > 1 ? 'square' : ( $fabrica_expanded ? 'huge' : 'big' ))
									)
							)
						: ( strpos( fabrica_get_theme_option( 'body_style' ), 'full' ) !== false
								? ( $fabrica_columns > 2 ? 'masonry-big' : 'full' )
								: ($fabrica_columns === 1 ? ( $fabrica_expanded ? 'huge' : 'big' ) : ( $fabrica_columns <= 2 && $fabrica_expanded ? 'masonry-big' : 'masonry' ))
							)
			),
			'hover'      => $fabrica_hover,
			'meta_parts' => $fabrica_components,
			'no_links'   => ! empty( $fabrica_template_args['no_links'] ),
        ),
        'content-classic',
        $fabrica_template_args
    ) );

	// Title and post meta
	$fabrica_show_title = get_the_title() != '';
	$fabrica_show_meta  = count( $fabrica_components ) > 0 && ! in_array( $fabrica_hover, array( 'border', 'pull', 'slide', 'fade', 'info' ) );

	if ( $fabrica_show_title ) {
		?>
		<div class="post_header entry-header">
			<?php

			// Post meta
			if ( apply_filters( 'fabrica_filter_show_blog_meta', $fabrica_show_meta, $fabrica_components, 'classic' ) ) {
				if ( count( $fabrica_components ) > 0 ) {
					do_action( 'fabrica_action_before_post_meta' );
					fabrica_show_post_meta(
						apply_filters(
							'fabrica_filter_post_meta_args', array(
							'components' => join( ',', $fabrica_components ),
							'seo'        => false,
							'echo'       => true,
						), $fabrica_blog_style[0], $fabrica_columns
						)
					);
					do_action( 'fabrica_action_after_post_meta' );
				}
			}

			// Post title
			if ( apply_filters( 'fabrica_filter_show_blog_title', true, 'classic' ) ) {
				do_action( 'fabrica_action_before_post_title' );
				if ( empty( $fabrica_template_args['no_links'] ) ) {
					the_title( sprintf( '<h4 class="post_title entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h4>' );
				} else {
					the_title( '<h4 class="post_title entry-title">', '</h4>' );
				}
				do_action( 'fabrica_action_after_post_title' );
			}

			if( !in_array( $fabrica_post_format, array( 'quote', 'aside', 'link', 'status' ) ) ) {
				// More button
				if ( apply_filters( 'fabrica_filter_show_blog_readmore', ! $fabrica_show_title || ! empty( $fabrica_template_args['more_button'] ), 'classic' ) ) {
					if ( empty( $fabrica_template_args['no_links'] ) ) {
						do_action( 'fabrica_action_before_post_readmore' );
						fabrica_show_post_more_link( $fabrica_template_args, '<div class="more-wrap">', '</div>' );
						do_action( 'fabrica_action_after_post_readmore' );
					}
				}
			}
			?>
		</div><!-- .entry-header -->
		<?php
	}

	// Post content
	if( in_array( $fabrica_post_format, array( 'quote', 'aside', 'link', 'status' ) ) ) {
		ob_start();
		if (apply_filters('fabrica_filter_show_blog_excerpt', empty($fabrica_template_args['hide_excerpt']) && fabrica_get_theme_option('excerpt_length') > 0, 'classic')) {
			fabrica_show_post_content($fabrica_template_args, '<div class="post_content_inner">', '</div>');
		}
		// More button
		if(! empty( $fabrica_template_args['more_button'] )) {
			if ( empty( $fabrica_template_args['no_links'] ) ) {
				do_action( 'fabrica_action_before_post_readmore' );
				fabrica_show_post_more_link( $fabrica_template_args, '<div class="more-wrap">', '</div>' );
				do_action( 'fabrica_action_after_post_readmore' );
			}
		}
		$fabrica_content = ob_get_contents();
		ob_end_clean();
		fabrica_show_layout($fabrica_content, '<div class="post_content entry-content">', '</div><!-- .entry-content -->');
	}
	?>

</article></div><?php
// Need opening PHP-tag above, because <div> is a inline-block element (used as column)!
