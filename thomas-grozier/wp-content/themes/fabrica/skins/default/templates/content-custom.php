<?php
/**
 * The custom template to display the content
 *
 * Used for index/archive/search.
 *
 * @package FABRICA
 * @since FABRICA 1.0.50
 */

$fabrica_template_args = get_query_var( 'fabrica_template_args' );
if ( is_array( $fabrica_template_args ) ) {
	$fabrica_columns    = empty( $fabrica_template_args['columns'] ) ? 2 : max( 1, $fabrica_template_args['columns'] );
	$fabrica_blog_style = array( $fabrica_template_args['type'], $fabrica_columns );
} else {
	$fabrica_template_args = array();
	$fabrica_blog_style = explode( '_', fabrica_get_theme_option( 'blog_style' ) );
	$fabrica_columns    = empty( $fabrica_blog_style[1] ) ? 2 : max( 1, $fabrica_blog_style[1] );
}
$fabrica_blog_id       = fabrica_get_custom_blog_id( join( '_', $fabrica_blog_style ) );
$fabrica_blog_style[0] = str_replace( 'blog-custom-', '', $fabrica_blog_style[0] );
$fabrica_expanded      = ! fabrica_sidebar_present() && fabrica_get_theme_option( 'expand_content' ) == 'expand';
$fabrica_components    = ! empty( $fabrica_template_args['meta_parts'] )
							? ( is_array( $fabrica_template_args['meta_parts'] )
								? join( ',', $fabrica_template_args['meta_parts'] )
								: $fabrica_template_args['meta_parts']
								)
							: fabrica_array_get_keys_by_value( fabrica_get_theme_option( 'meta_parts' ) );
$fabrica_post_format   = get_post_format();
$fabrica_post_format   = empty( $fabrica_post_format ) ? 'standard' : str_replace( 'post-format-', '', $fabrica_post_format );

$fabrica_blog_meta     = fabrica_get_custom_layout_meta( $fabrica_blog_id );
$fabrica_custom_style  = ! empty( $fabrica_blog_meta['scripts_required'] ) ? $fabrica_blog_meta['scripts_required'] : 'none';

if ( ! empty( $fabrica_template_args['slider'] ) || $fabrica_columns > 1 || ! fabrica_is_off( $fabrica_custom_style ) ) {
	?><div class="
		<?php
		if ( ! empty( $fabrica_template_args['slider'] ) ) {
			echo 'slider-slide swiper-slide';
		} else {
			echo esc_attr( ( fabrica_is_off( $fabrica_custom_style ) ? 'column' : sprintf( '%1$s_item %1$s_item', $fabrica_custom_style ) ) . "-1_{$fabrica_columns}" );
		}
		?>
	">
	<?php
}
?>
<article id="post-<?php the_ID(); ?>" data-post-id="<?php the_ID(); ?>"
	<?php
	post_class(
			'post_item post_item_container post_format_' . esc_attr( $fabrica_post_format )
					. ' post_layout_custom post_layout_custom_' . esc_attr( $fabrica_columns )
					. ' post_layout_' . esc_attr( $fabrica_blog_style[0] )
					. ' post_layout_' . esc_attr( $fabrica_blog_style[0] ) . '_' . esc_attr( $fabrica_columns )
					. ( ! fabrica_is_off( $fabrica_custom_style )
						? ' post_layout_' . esc_attr( $fabrica_custom_style )
							. ' post_layout_' . esc_attr( $fabrica_custom_style ) . '_' . esc_attr( $fabrica_columns )
						: ''
						)
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
	// Custom layout
	do_action( 'fabrica_action_show_layout', $fabrica_blog_id, get_the_ID() );
	?>
</article><?php
if ( ! empty( $fabrica_template_args['slider'] ) || $fabrica_columns > 1 || ! fabrica_is_off( $fabrica_custom_style ) ) {
	?></div><?php
	// Need opening PHP-tag above just after </div>, because <div> is a inline-block element (used as column)!
}
