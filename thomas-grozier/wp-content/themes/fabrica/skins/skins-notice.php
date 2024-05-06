<?php
/**
 * The template to display Admin notices
 *
 * @package FABRICA
 * @since FABRICA 1.0.64
 */

$fabrica_skins_url  = get_admin_url( null, 'admin.php?page=trx_addons_theme_panel#trx_addons_theme_panel_section_skins' );
$fabrica_skins_args = get_query_var( 'fabrica_skins_notice_args' );
?>
<div class="fabrica_admin_notice fabrica_skins_notice notice notice-info is-dismissible" data-notice="skins">
	<?php
	// Theme image
	$fabrica_theme_img = fabrica_get_file_url( 'screenshot.jpg' );
	if ( '' != $fabrica_theme_img ) {
		?>
		<div class="fabrica_notice_image"><img src="<?php echo esc_url( $fabrica_theme_img ); ?>" alt="<?php esc_attr_e( 'Theme screenshot', 'fabrica' ); ?>"></div>
		<?php
	}

	// Title
	?>
	<h3 class="fabrica_notice_title">
		<?php esc_html_e( 'New skins are available', 'fabrica' ); ?>
	</h3>
	<?php

	// Description
	$fabrica_total      = $fabrica_skins_args['update'];	// Store value to the separate variable to avoid warnings from ThemeCheck plugin!
	$fabrica_skins_msg  = $fabrica_total > 0
							// Translators: Add new skins number
							? '<strong>' . sprintf( _n( '%d new version', '%d new versions', $fabrica_total, 'fabrica' ), $fabrica_total ) . '</strong>'
							: '';
	$fabrica_total      = $fabrica_skins_args['free'];
	$fabrica_skins_msg .= $fabrica_total > 0
							? ( ! empty( $fabrica_skins_msg ) ? ' ' . esc_html__( 'and', 'fabrica' ) . ' ' : '' )
								// Translators: Add new skins number
								. '<strong>' . sprintf( _n( '%d free skin', '%d free skins', $fabrica_total, 'fabrica' ), $fabrica_total ) . '</strong>'
							: '';
	$fabrica_total      = $fabrica_skins_args['pay'];
	$fabrica_skins_msg .= $fabrica_skins_args['pay'] > 0
							? ( ! empty( $fabrica_skins_msg ) ? ' ' . esc_html__( 'and', 'fabrica' ) . ' ' : '' )
								// Translators: Add new skins number
								. '<strong>' . sprintf( _n( '%d paid skin', '%d paid skins', $fabrica_total, 'fabrica' ), $fabrica_total ) . '</strong>'
							: '';
	?>
	<div class="fabrica_notice_text">
		<p>
			<?php
			// Translators: Add new skins info
			echo wp_kses_data( sprintf( __( "We are pleased to announce that %s are available for your theme", 'fabrica' ), $fabrica_skins_msg ) );
			?>
		</p>
	</div>
	<?php

	// Buttons
	?>
	<div class="fabrica_notice_buttons">
		<?php
		// Link to the theme dashboard page
		?>
		<a href="<?php echo esc_url( $fabrica_skins_url ); ?>" class="button button-primary"><i class="dashicons dashicons-update"></i> 
			<?php
			// Translators: Add theme name
			esc_html_e( 'Go to Skins manager', 'fabrica' );
			?>
		</a>
	</div>
</div>
