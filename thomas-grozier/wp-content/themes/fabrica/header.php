<?php
/**
 * The Header: Logo and main menu
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js<?php
	// Class scheme_xxx need in the <html> as context for the <body>!
	echo ' scheme_' . esc_attr( fabrica_get_theme_option( 'color_scheme' ) );
?>">

<head>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

	<?php
	if ( function_exists( 'wp_body_open' ) ) {
		wp_body_open();
	} else {
		do_action( 'wp_body_open' );
	}
	do_action( 'fabrica_action_before_body' );
	?>

	<div class="<?php echo esc_attr( apply_filters( 'fabrica_filter_body_wrap_class', 'body_wrap' ) ); ?>" <?php do_action('fabrica_action_body_wrap_attributes'); ?>>

		<?php do_action( 'fabrica_action_before_page_wrap' ); ?>

		<div class="<?php echo esc_attr( apply_filters( 'fabrica_filter_page_wrap_class', 'page_wrap' ) ); ?>" <?php do_action('fabrica_action_page_wrap_attributes'); ?>>

			<?php do_action( 'fabrica_action_page_wrap_start' ); ?>

			<?php
			$fabrica_full_post_loading = ( fabrica_is_singular( 'post' ) || fabrica_is_singular( 'attachment' ) ) && fabrica_get_value_gp( 'action' ) == 'full_post_loading';
			$fabrica_prev_post_loading = ( fabrica_is_singular( 'post' ) || fabrica_is_singular( 'attachment' ) ) && fabrica_get_value_gp( 'action' ) == 'prev_post_loading';

			// Don't display the header elements while actions 'full_post_loading' and 'prev_post_loading'
			if ( ! $fabrica_full_post_loading && ! $fabrica_prev_post_loading ) {

				// Short links to fast access to the content, sidebar and footer from the keyboard
				?>
				<a class="fabrica_skip_link skip_to_content_link" href="#content_skip_link_anchor" tabindex="<?php echo esc_attr( apply_filters( 'fabrica_filter_skip_links_tabindex', 1 ) ); ?>"><?php esc_html_e( "Skip to content", 'fabrica' ); ?></a>
				<?php if ( fabrica_sidebar_present() ) { ?>
				<a class="fabrica_skip_link skip_to_sidebar_link" href="#sidebar_skip_link_anchor" tabindex="<?php echo esc_attr( apply_filters( 'fabrica_filter_skip_links_tabindex', 1 ) ); ?>"><?php esc_html_e( "Skip to sidebar", 'fabrica' ); ?></a>
				<?php } ?>
				<a class="fabrica_skip_link skip_to_footer_link" href="#footer_skip_link_anchor" tabindex="<?php echo esc_attr( apply_filters( 'fabrica_filter_skip_links_tabindex', 1 ) ); ?>"><?php esc_html_e( "Skip to footer", 'fabrica' ); ?></a>

				<?php
				do_action( 'fabrica_action_before_header' );

				// Header
				$fabrica_header_type = fabrica_get_theme_option( 'header_type' );
				if ( 'custom' == $fabrica_header_type && ! fabrica_is_layouts_available() ) {
					$fabrica_header_type = 'default';
				}
				get_template_part( apply_filters( 'fabrica_filter_get_template_part', "templates/header-" . sanitize_file_name( $fabrica_header_type ) ) );

				// Side menu
				if ( in_array( fabrica_get_theme_option( 'menu_side' ), array( 'left', 'right' ) ) ) {
					get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/header-navi-side' ) );
				}

				// Mobile menu
				get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/header-navi-mobile' ) );

				do_action( 'fabrica_action_after_header' );

			}
			?>

			<?php do_action( 'fabrica_action_before_page_content_wrap' ); ?>

			<div class="page_content_wrap<?php
				if ( fabrica_is_off( fabrica_get_theme_option( 'remove_margins' ) ) ) {
					if ( empty( $fabrica_header_type ) ) {
						$fabrica_header_type = fabrica_get_theme_option( 'header_type' );
					}
					if ( 'custom' == $fabrica_header_type && fabrica_is_layouts_available() ) {
						$fabrica_header_id = fabrica_get_custom_header_id();
						if ( $fabrica_header_id > 0 ) {
							$fabrica_header_meta = fabrica_get_custom_layout_meta( $fabrica_header_id );
							if ( ! empty( $fabrica_header_meta['margin'] ) ) {
								?> page_content_wrap_custom_header_margin<?php
							}
						}
					}
					$fabrica_footer_type = fabrica_get_theme_option( 'footer_type' );
					if ( 'custom' == $fabrica_footer_type && fabrica_is_layouts_available() ) {
						$fabrica_footer_id = fabrica_get_custom_footer_id();
						if ( $fabrica_footer_id ) {
							$fabrica_footer_meta = fabrica_get_custom_layout_meta( $fabrica_footer_id );
							if ( ! empty( $fabrica_footer_meta['margin'] ) ) {
								?> page_content_wrap_custom_footer_margin<?php
							}
						}
					}
				}
				do_action( 'fabrica_action_page_content_wrap_class', $fabrica_prev_post_loading );
				?>"<?php
				if ( apply_filters( 'fabrica_filter_is_prev_post_loading', $fabrica_prev_post_loading ) ) {
					?> data-single-style="<?php echo esc_attr( fabrica_get_theme_option( 'single_style' ) ); ?>"<?php
				}
				do_action( 'fabrica_action_page_content_wrap_data', $fabrica_prev_post_loading );
			?>>
				<?php
				do_action( 'fabrica_action_page_content_wrap', $fabrica_full_post_loading || $fabrica_prev_post_loading );

				// Single posts banner
				if ( apply_filters( 'fabrica_filter_single_post_header', fabrica_is_singular( 'post' ) || fabrica_is_singular( 'attachment' ) ) ) {
					if ( $fabrica_prev_post_loading ) {
						if ( fabrica_get_theme_option( 'posts_navigation_scroll_which_block' ) != 'article' ) {
							do_action( 'fabrica_action_between_posts' );
						}
					}
					// Single post thumbnail and title
					$fabrica_path = apply_filters( 'fabrica_filter_get_template_part', 'templates/single-styles/' . fabrica_get_theme_option( 'single_style' ) );
					if ( fabrica_get_file_dir( $fabrica_path . '.php' ) != '' ) {
						get_template_part( $fabrica_path );
					}
				}

				// Widgets area above page
				$fabrica_body_style   = fabrica_get_theme_option( 'body_style' );
				$fabrica_widgets_name = fabrica_get_theme_option( 'widgets_above_page' );
				$fabrica_show_widgets = ! fabrica_is_off( $fabrica_widgets_name ) && is_active_sidebar( $fabrica_widgets_name );
				if ( $fabrica_show_widgets ) {
					if ( 'fullscreen' != $fabrica_body_style ) {
						?>
						<div class="content_wrap">
							<?php
					}
					fabrica_create_widgets_area( 'widgets_above_page' );
					if ( 'fullscreen' != $fabrica_body_style ) {
						?>
						</div>
						<?php
					}
				}

				// Content area
				do_action( 'fabrica_action_before_content_wrap' );
				?>
				<div class="content_wrap<?php echo 'fullscreen' == $fabrica_body_style ? '_fullscreen' : ''; ?>">

					<?php do_action( 'fabrica_action_content_wrap_start' ); ?>

					<div class="content">
						<?php
						do_action( 'fabrica_action_page_content_start' );

						// Skip link anchor to fast access to the content from keyboard
						?>
						<a id="content_skip_link_anchor" class="fabrica_skip_link_anchor" href="#"></a>
						<?php
						// Single posts banner between prev/next posts
						if ( ( fabrica_is_singular( 'post' ) || fabrica_is_singular( 'attachment' ) )
							&& $fabrica_prev_post_loading 
							&& fabrica_get_theme_option( 'posts_navigation_scroll_which_block' ) == 'article'
						) {
							do_action( 'fabrica_action_between_posts' );
						}

						// Widgets area above content
						fabrica_create_widgets_area( 'widgets_above_content' );

						do_action( 'fabrica_action_page_content_start_text' );
