<?php
/**
 * The template to display the main menu
 *
 * @package FABRICA
 * @since FABRICA 1.0
 */
?>
<div class="top_panel_navi sc_layouts_row sc_layouts_row_type_compact sc_layouts_row_fixed sc_layouts_row_fixed_always sc_layouts_row_delimiter
	<?php
	if ( fabrica_is_on( fabrica_get_theme_option( 'header_mobile_enabled' ) ) ) {
		?>
		sc_layouts_hide_on_mobile
		<?php
	}
	?>
">
	<div class="content_wrap">
		<div class="columns_wrap columns_fluid">
			<div class="sc_layouts_column sc_layouts_column_align_left sc_layouts_column_icons_position_left sc_layouts_column_fluid column-1_4">
				<div class="sc_layouts_item">
					<?php
					// Logo
					get_template_part( apply_filters( 'fabrica_filter_get_template_part', 'templates/header-logo' ) );
					?>
				</div>
			</div><div class="sc_layouts_column sc_layouts_column_align_right sc_layouts_column_icons_position_left sc_layouts_column_fluid column-3_4">
				<div class="sc_layouts_item">
					<?php
					// Main menu
					$fabrica_menu_main = fabrica_get_nav_menu( 'menu_main' );
					// Show any menu if no menu selected in the location 'menu_main'
					if ( fabrica_get_theme_setting( 'autoselect_menu' ) && empty( $fabrica_menu_main ) ) {
						$fabrica_menu_main = fabrica_get_nav_menu();
					}
					fabrica_show_layout(
						$fabrica_menu_main,
						'<nav class="menu_main_nav_area sc_layouts_menu sc_layouts_menu_default sc_layouts_hide_on_mobile"'
							. ' itemscope="itemscope" itemtype="' . esc_attr( fabrica_get_protocol( true ) ) . '//schema.org/SiteNavigationElement"'
							. '>',
						'</nav>'
					);
					// Mobile menu button
					?>
					<div class="sc_layouts_iconed_text sc_layouts_menu_mobile_button">
						<a class="sc_layouts_item_link sc_layouts_iconed_text_link" href="#">
							<span class="sc_layouts_item_icon sc_layouts_iconed_text_icon trx_addons_icon-menu"></span>
						</a>
					</div>
				</div><?php
				if ( fabrica_exists_trx_addons() ) {
					// Display cart button
					ob_start();
					do_action( 'fabrica_action_cart' );
					$fabrica_action_output = ob_get_contents();
					ob_end_clean();
					if ( ! empty( $fabrica_action_output ) ) {
						?><div class="sc_layouts_item">
							<?php
							fabrica_show_layout( $fabrica_action_output );
							?>
							</div><?php
					}					
					?><div class="sc_layouts_item">
						<?php
						// Display search field
						do_action(
							'fabrica_action_search',
							array(
								'style' => 'fullscreen',
								'class' => 'header_search',
								'ajax'  => false
							)
						);
						?>
					</div><?php
				}
				?>
			</div>
		</div><!-- /.columns_wrap -->
	</div><!-- /.content_wrap -->
</div><!-- /.top_panel_navi -->