<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: //codex.wordpress.org/Template_Hierarchy
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */

$fabrica_template = apply_filters( 'fabrica_filter_get_template_part', fabrica_blog_archive_get_template() );

if ( ! empty( $fabrica_template ) && 'index' != $fabrica_template ) {

	get_template_part( $fabrica_template );

} else {

	fabrica_storage_set( 'blog_archive', true );

	get_header();

	if ( have_posts() ) {

		// Query params
		$fabrica_stickies   = is_home()
								|| ( in_array( fabrica_get_theme_option( 'post_type' ), array( '', 'post' ) )
									&& (int) fabrica_get_theme_option( 'parent_cat' ) == 0
									)
										? get_option( 'sticky_posts' )
										: false;
		$fabrica_post_type  = fabrica_get_theme_option( 'post_type' );
		$fabrica_args       = array(
								'blog_style'     => fabrica_get_theme_option( 'blog_style' ),
								'post_type'      => $fabrica_post_type,
								'taxonomy'       => fabrica_get_post_type_taxonomy( $fabrica_post_type ),
								'parent_cat'     => fabrica_get_theme_option( 'parent_cat' ),
								'posts_per_page' => fabrica_get_theme_option( 'posts_per_page' ),
								'sticky'         => fabrica_get_theme_option( 'sticky_style' ) == 'columns'
															&& is_array( $fabrica_stickies )
															&& count( $fabrica_stickies ) > 0
															&& get_query_var( 'paged' ) < 1
								);

		fabrica_blog_archive_start();

		do_action( 'fabrica_action_blog_archive_start' );

		if ( is_author() ) {
			do_action( 'fabrica_action_before_page_author' );
			get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/author-page' ) );
			do_action( 'fabrica_action_after_page_author' );
		}

		if ( fabrica_get_theme_option( 'show_filters' ) ) {
			do_action( 'fabrica_action_before_page_filters' );
			fabrica_show_filters( $fabrica_args );
			do_action( 'fabrica_action_after_page_filters' );
		} else {
			do_action( 'fabrica_action_before_page_posts' );
			fabrica_show_posts( array_merge( $fabrica_args, array( 'cat' => $fabrica_args['parent_cat'] ) ) );
			do_action( 'fabrica_action_after_page_posts' );
		}

		do_action( 'fabrica_action_blog_archive_end' );

		fabrica_blog_archive_end();

	} else {

		if ( is_search() ) {
			get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/content', 'none-search' ), 'none-search' );
		} else {
			get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/content', 'none-archive' ), 'none-archive' );
		}
	}

	get_footer();
}
