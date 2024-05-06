<?php
/**
 * Information about this theme
 *
 * @package FABRICA
 * @since FABRICA 1.0.30
 */


if ( ! function_exists( 'fabrica_about_after_switch_theme' ) ) {
	add_action( 'after_switch_theme', 'fabrica_about_after_switch_theme', 1000 );
	/**
	 * Update option 'fabrica_about_page' after switch a theme to redirect to the page 'About Theme' on next page load.
	 *
	 * Hooks: add_action( 'after_switch_theme', 'fabrica_about_after_switch_theme', 1000 );
	 */
	function fabrica_about_after_switch_theme() {
		update_option( 'fabrica_about_page', 1 );
	}
}

if ( ! function_exists( 'fabrica_about_after_setup_theme' ) ) {
	add_action( 'init', 'fabrica_about_after_setup_theme', 1000 );
	/**
	 * Redirect to the page 'About Theme' after switch a theme.
	 *
	 * Hooks: add_action( 'init', 'fabrica_about_after_setup_theme', 1000 );
	 */
	function fabrica_about_after_setup_theme() {
		if ( ! defined( 'WP_CLI' ) && get_option( 'fabrica_about_page' ) == 1 ) {
			update_option( 'fabrica_about_page', 0 );
			wp_safe_redirect( admin_url() . 'themes.php?page=fabrica_about' );
			exit();
		} else {
			if ( fabrica_get_value_gp( 'page' ) == 'fabrica_about' && fabrica_exists_trx_addons() ) {
				wp_safe_redirect( admin_url() . 'admin.php?page=trx_addons_theme_panel' );
				exit();
			}
		}
	}
}

if ( ! function_exists( 'fabrica_about_add_menu_items' ) ) {
	add_action( 'admin_menu', 'fabrica_about_add_menu_items' );
	/**
	 * Add the item 'About Theme' to the admin menu 'Appearance'.
	 *
	 * Hooks: add_action( 'admin_menu', 'fabrica_about_add_menu_items' );
	 */
	function fabrica_about_add_menu_items() {
		if ( ! fabrica_exists_trx_addons() ) {
			$theme_slug  = get_template();
			$theme_name  = wp_get_theme( $theme_slug )->get( 'Name' ) . ( FABRICA_THEME_FREE ? ' ' . esc_html__( 'Free', 'fabrica' ) : '' );
			add_theme_page(
				// Translators: Add theme name to the page title
				sprintf( esc_html__( 'About %s', 'fabrica' ), $theme_name ),    //page_title
				// Translators: Add theme name to the menu title
				sprintf( esc_html__( 'About %s', 'fabrica' ), $theme_name ),    //menu_title
				'manage_options',                                               //capability
				'fabrica_about',                                                //menu_slug
				'fabrica_about_page_builder'                                    //callback
			);
		}
	}
}

if ( ! function_exists( 'fabrica_about_enqueue_scripts' ) ) {
	add_action( 'admin_enqueue_scripts', 'fabrica_about_enqueue_scripts' );
	/**
	 * Load a page-specific scripts and styles for the page 'About'
	 *
	 * Hooks: add_action( 'admin_enqueue_scripts', 'fabrica_about_enqueue_scripts' );
	 */
	function fabrica_about_enqueue_scripts() {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : false;
		if ( ! empty( $screen->id ) && false !== strpos( $screen->id, '_page_fabrica_about' ) ) {
			// Scripts
			if ( ! fabrica_exists_trx_addons() && function_exists( 'fabrica_plugins_installer_enqueue_scripts' ) ) {
				fabrica_plugins_installer_enqueue_scripts();
			}
			// Styles
			$fdir = fabrica_get_file_url( 'theme-specific/theme-about/theme-about.css' );
			if ( '' != $fdir ) {
				wp_enqueue_style( 'fabrica-about', $fdir, array(), null );
			}
		}
	}
}

if ( ! function_exists( 'fabrica_about_page_builder' ) ) {
	/**
	 * Build the page 'About Theme'
	 */
	function fabrica_about_page_builder() {
		$theme_slug = get_template();
		$theme      = wp_get_theme( $theme_slug );
		?>
		<div class="fabrica_about">

			<?php do_action( 'fabrica_action_theme_about_start', $theme ); ?>

			<?php do_action( 'fabrica_action_theme_about_before_logo', $theme ); ?>

			<div class="fabrica_about_logo">
				<?php
				$logo = fabrica_get_file_url( 'theme-specific/theme-about/icon.jpg' );
				if ( empty( $logo ) ) {
					$logo = fabrica_get_file_url( 'screenshot.jpg' );
				}
				if ( ! empty( $logo ) ) {
					?>
					<img src="<?php echo esc_url( $logo ); ?>">
					<?php
				}
				?>
			</div>

			<?php do_action( 'fabrica_action_theme_about_before_title', $theme ); ?>

			<h1 class="fabrica_about_title">
			<?php
				echo esc_html(
					sprintf(
						// Translators: Add theme name and version to the 'Welcome' message
						__( 'Welcome to %1$s %2$s v.%3$s', 'fabrica' ),
						$theme->get( 'Name' ),
						FABRICA_THEME_FREE ? __( 'Free', 'fabrica' ) : '',
						$theme->get( 'Version' )
					)
				);
			?>
			</h1>

			<?php do_action( 'fabrica_action_theme_about_before_description', $theme ); ?>

			<div class="fabrica_about_description">
				<p>
					<?php
					echo wp_kses_data( __( 'In order to continue, please install and activate <b>ThemeREX Addons plugin</b>.', 'fabrica' ) );
					?>
					<sup>*</sup>
				</p>
			</div>

			<?php do_action( 'fabrica_action_theme_about_before_buttons', $theme ); ?>

			<div class="fabrica_about_buttons">
				<?php fabrica_plugins_installer_get_button_html( 'trx_addons' ); ?>
			</div>

			<?php do_action( 'fabrica_action_theme_about_before_buttons', $theme ); ?>

			<div class="fabrica_about_notes">
				<p>
					<sup>*</sup>
					<?php
					echo wp_kses_data( __( "<i>ThemeREX Addons plugin</i> will allow you to install recommended plugins, demo content, and improve the theme's functionality overall with multiple theme options.", 'fabrica' ) );
					?>
				</p>
			</div>

			<?php do_action( 'fabrica_action_theme_about_end', $theme ); ?>

		</div>
		<?php
	}
}

if ( ! function_exists( 'fabrica_about_page_disable_tgmpa_notice' ) ) {
	add_filter( 'tgmpa_show_admin_notice_capability', 'fabrica_about_page_disable_tgmpa_notice' );
	/**
	 * Hide a TGMPA notice on the page 'About Theme'
	 *
	 * @param $cap  Capability of the current page.
	 *
	 * @return string  A filtered capability.
	 */
	function fabrica_about_page_disable_tgmpa_notice($cap) {
		if ( fabrica_get_value_gp( 'page' ) == 'fabrica_about' ) {
			$cap = 'unfiltered_upload';
		}
		return $cap;
	}
}

require_once FABRICA_THEME_DIR . 'includes/plugins-installer/plugins-installer.php';
