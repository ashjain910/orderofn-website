<?php
/**
 * The template 'Style 1' to displaying related posts
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */

$fabrica_link        = get_permalink();
$fabrica_post_format = get_post_format();
$fabrica_post_format = empty( $fabrica_post_format ) ? 'standard' : str_replace( 'post-format-', '', $fabrica_post_format );
?><div id="post-<?php the_ID(); ?>" <?php post_class( 'related_item post_format_' . esc_attr( $fabrica_post_format ) ); ?> data-post-id="<?php the_ID(); ?>">
	<?php
	fabrica_show_post_featured(
		array(
			'thumb_size'    => apply_filters( 'fabrica_filter_related_thumb_size', fabrica_get_thumb_size( (int) fabrica_get_theme_option( 'related_posts' ) == 1 ? 'huge' : 'big' ) ),
			'post_info'     => '<div class="post_header entry-header">'
									. '<div class="post_categories">' . wp_kses( fabrica_get_post_categories( '' ), 'fabrica_kses_content' ) . '</div>'
									. '<h6 class="post_title entry-title"><a href="' . esc_url( $fabrica_link ) . '">'
										. wp_kses_data( '' == get_the_title() ? esc_html__( '- No title -', 'fabrica' ) : get_the_title() )
									. '</a></h6>'
									. ( in_array( get_post_type(), array( 'post', 'attachment' ) )
											? '<div class="post_meta"><a href="' . esc_url( $fabrica_link ) . '" class="post_meta_item post_date">' . wp_kses_data( fabrica_get_date() ) . '</a></div>'
											: '' )
								. '</div>',
		)
	);
	?>
</div>
