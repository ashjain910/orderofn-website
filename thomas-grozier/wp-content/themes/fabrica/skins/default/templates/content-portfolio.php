<?php
/**
 * The Portfolio template to display the content
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

$fabrica_post_format = get_post_format();
$fabrica_post_format = empty( $fabrica_post_format ) ? 'standard' : str_replace( 'post-format-', '', $fabrica_post_format );

?><div class="
<?php
if ( ! empty( $fabrica_template_args['slider'] ) ) {
	echo ' slider-slide swiper-slide';
} else {
	echo ( fabrica_is_blog_style_use_masonry( $fabrica_blog_style[0] ) ? 'masonry_item masonry_item-1_' . esc_attr( $fabrica_columns ) : esc_attr( $fabrica_columns_class ));
}
?>
"><article id="post-<?php the_ID(); ?>" 
	<?php
	post_class(
		'post_item post_item_container post_format_' . esc_attr( $fabrica_post_format )
		. ' post_layout_portfolio'
		. ' post_layout_portfolio_' . esc_attr( $fabrica_columns )
		. ( 'portfolio' != $fabrica_blog_style[0] ? ' ' . esc_attr( $fabrica_blog_style[0] )  . '_' . esc_attr( $fabrica_columns ) : '' )
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

	$fabrica_hover   = ! empty( $fabrica_template_args['hover'] ) && ! fabrica_is_inherit( $fabrica_template_args['hover'] )
								? $fabrica_template_args['hover']
								: fabrica_get_theme_option( 'image_hover' );

	if ( 'dots' == $fabrica_hover ) {
		$fabrica_post_link = empty( $fabrica_template_args['no_links'] )
								? ( ! empty( $fabrica_template_args['link'] )
									? $fabrica_template_args['link']
									: get_permalink()
									)
								: '';
		$fabrica_target    = ! empty( $fabrica_post_link ) && false === strpos( $fabrica_post_link, home_url() )
								? ' target="_blank" rel="nofollow"'
								: '';
	}
	
	// Meta parts
	$fabrica_components = ! empty( $fabrica_template_args['meta_parts'] )
							? ( is_array( $fabrica_template_args['meta_parts'] )
								? $fabrica_template_args['meta_parts']
								: explode( ',', $fabrica_template_args['meta_parts'] )
								)
							: fabrica_array_get_keys_by_value( fabrica_get_theme_option( 'meta_parts' ) );

	// Featured image
	fabrica_show_post_featured( apply_filters( 'fabrica_filter_args_featured',
        array(
			'hover'         => $fabrica_hover,
			'no_links'      => ! empty( $fabrica_template_args['no_links'] ),
			'thumb_size'    => ! empty( $fabrica_template_args['thumb_size'] )
								? $fabrica_template_args['thumb_size']
								: fabrica_get_thumb_size(
									fabrica_is_blog_style_use_masonry( $fabrica_blog_style[0] )
										? (	strpos( fabrica_get_theme_option( 'body_style' ), 'full' ) !== false || $fabrica_columns < 3
											? 'masonry-big'
											: 'masonry'
											)
										: (	strpos( fabrica_get_theme_option( 'body_style' ), 'full' ) !== false || $fabrica_columns < 3
											? 'square'
											: 'square'
											)
								),
			'thumb_bg' => fabrica_is_blog_style_use_masonry( $fabrica_blog_style[0] ) ? false : true,
			'show_no_image' => true,
			'meta_parts'    => $fabrica_components,
			'class'         => 'dots' == $fabrica_hover ? 'hover_with_info' : '',
			'post_info'     => 'dots' == $fabrica_hover
										? '<div class="post_info"><h5 class="post_title">'
											. ( ! empty( $fabrica_post_link )
												? '<a href="' . esc_url( $fabrica_post_link ) . '"' . ( ! empty( $target ) ? $target : '' ) . '>'
												: ''
												)
												. esc_html( get_the_title() ) 
											. ( ! empty( $fabrica_post_link )
												? '</a>'
												: ''
												)
											. '</h5></div>'
										: '',
            'thumb_ratio'   => 'info' == $fabrica_hover ?  '100:102' : '',
        ),
        'content-portfolio',
        $fabrica_template_args
    ) );
	?>
</article></div><?php
// Need opening PHP-tag above, because <article> is a inline-block element (used as column)!