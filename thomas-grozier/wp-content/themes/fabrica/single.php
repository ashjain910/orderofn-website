<?php
/**
 * The template to display single post
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */

// Full post loading
$full_post_loading          = fabrica_get_value_gp( 'action' ) == 'full_post_loading';

// Prev post loading
$prev_post_loading          = fabrica_get_value_gp( 'action' ) == 'prev_post_loading';
$prev_post_loading_type     = fabrica_get_theme_option( 'posts_navigation_scroll_which_block' );

// Position of the related posts
$fabrica_related_position   = fabrica_get_theme_option( 'related_position' );

// Type of the prev/next post navigation
$fabrica_posts_navigation   = fabrica_get_theme_option( 'posts_navigation' );
$fabrica_prev_post          = false;
$fabrica_prev_post_same_cat = fabrica_get_theme_option( 'posts_navigation_scroll_same_cat' );

// Rewrite style of the single post if current post loading via AJAX and featured image and title is not in the content
if ( ( $full_post_loading 
		|| 
		( $prev_post_loading && 'article' == $prev_post_loading_type )
	) 
	&& 
	! in_array( fabrica_get_theme_option( 'single_style' ), array( 'style-6' ) )
) {
	fabrica_storage_set_array( 'options_meta', 'single_style', 'style-6' );
}

do_action( 'fabrica_action_prev_post_loading', $prev_post_loading, $prev_post_loading_type );

get_header();

while ( have_posts() ) {

	the_post();

	// Type of the prev/next post navigation
	if ( 'scroll' == $fabrica_posts_navigation ) {
		$fabrica_prev_post = get_previous_post( $fabrica_prev_post_same_cat );  // Get post from same category
		if ( ! $fabrica_prev_post && $fabrica_prev_post_same_cat ) {
			$fabrica_prev_post = get_previous_post( false );                    // Get post from any category
		}
		if ( ! $fabrica_prev_post ) {
			$fabrica_posts_navigation = 'links';
		}
	}

	// Override some theme options to display featured image, title and post meta in the dynamic loaded posts
	if ( $full_post_loading || ( $prev_post_loading && $fabrica_prev_post ) ) {
		fabrica_sc_layouts_showed( 'featured', false );
		fabrica_sc_layouts_showed( 'title', false );
		fabrica_sc_layouts_showed( 'postmeta', false );
	}

	// If related posts should be inside the content
	if ( strpos( $fabrica_related_position, 'inside' ) === 0 ) {
		ob_start();
	}

	// Display post's content
	get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/content', 'single-' . fabrica_get_theme_option( 'single_style' ) ), 'single-' . fabrica_get_theme_option( 'single_style' ) );

	// If related posts should be inside the content
	if ( strpos( $fabrica_related_position, 'inside' ) === 0 ) {
		$fabrica_content = ob_get_contents();
		ob_end_clean();

		ob_start();
		do_action( 'fabrica_action_related_posts' );
		$fabrica_related_content = ob_get_contents();
		ob_end_clean();

		if ( ! empty( $fabrica_related_content ) ) {
			$fabrica_related_position_inside = max( 0, min( 9, fabrica_get_theme_option( 'related_position_inside' ) ) );
			if ( 0 == $fabrica_related_position_inside ) {
				$fabrica_related_position_inside = mt_rand( 1, 9 );
			}

			$fabrica_p_number         = 0;
			$fabrica_related_inserted = false;
			$fabrica_in_block         = false;
			$fabrica_content_start    = strpos( $fabrica_content, '<div class="post_content' );
			$fabrica_content_end      = strrpos( $fabrica_content, '</div>' );

			for ( $i = max( 0, $fabrica_content_start ); $i < min( strlen( $fabrica_content ) - 3, $fabrica_content_end ); $i++ ) {
				if ( $fabrica_content[ $i ] != '<' ) {
					continue;
				}
				if ( $fabrica_in_block ) {
					if ( strtolower( substr( $fabrica_content, $i + 1, 12 ) ) == '/blockquote>' ) {
						$fabrica_in_block = false;
						$i += 12;
					}
					continue;
				} else if ( strtolower( substr( $fabrica_content, $i + 1, 10 ) ) == 'blockquote' && in_array( $fabrica_content[ $i + 11 ], array( '>', ' ' ) ) ) {
					$fabrica_in_block = true;
					$i += 11;
					continue;
				} else if ( 'p' == $fabrica_content[ $i + 1 ] && in_array( $fabrica_content[ $i + 2 ], array( '>', ' ' ) ) ) {
					$fabrica_p_number++;
					if ( $fabrica_related_position_inside == $fabrica_p_number ) {
						$fabrica_related_inserted = true;
						$fabrica_content = ( $i > 0 ? substr( $fabrica_content, 0, $i ) : '' )
											. $fabrica_related_content
											. substr( $fabrica_content, $i );
					}
				}
			}
			if ( ! $fabrica_related_inserted ) {
				if ( $fabrica_content_end > 0 ) {
					$fabrica_content = substr( $fabrica_content, 0, $fabrica_content_end ) . $fabrica_related_content . substr( $fabrica_content, $fabrica_content_end );
				} else {
					$fabrica_content .= $fabrica_related_content;
				}
			}
		}

		fabrica_show_layout( $fabrica_content );
	}

	// Comments
	do_action( 'fabrica_action_before_comments' );
	comments_template();
	do_action( 'fabrica_action_after_comments' );

	// Related posts
	if ( 'below_content' == $fabrica_related_position
		&& ( 'scroll' != $fabrica_posts_navigation || fabrica_get_theme_option( 'posts_navigation_scroll_hide_related' ) == 0 )
		&& ( ! $full_post_loading || fabrica_get_theme_option( 'open_full_post_hide_related' ) == 0 )
	) {
		do_action( 'fabrica_action_related_posts' );
	}

	// Post navigation: type 'scroll'
	if ( 'scroll' == $fabrica_posts_navigation && ! $full_post_loading ) {
		?>
		<div class="nav-links-single-scroll"
			data-post-id="<?php echo esc_attr( get_the_ID( $fabrica_prev_post ) ); ?>"
			data-post-link="<?php echo esc_attr( get_permalink( $fabrica_prev_post ) ); ?>"
			data-post-title="<?php the_title_attribute( array( 'post' => $fabrica_prev_post ) ); ?>"
			<?php do_action( 'fabrica_action_nav_links_single_scroll_data', $fabrica_prev_post ); ?>
		></div>
		<?php
	}
}

get_footer();
