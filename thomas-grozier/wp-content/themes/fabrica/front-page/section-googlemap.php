<div class="front_page_section front_page_section_googlemap<?php
	$fabrica_scheme = fabrica_get_theme_option( 'front_page_googlemap_scheme' );
	if ( ! empty( $fabrica_scheme ) && ! fabrica_is_inherit( $fabrica_scheme ) ) {
		echo ' scheme_' . esc_attr( $fabrica_scheme );
	}
	echo ' front_page_section_paddings_' . esc_attr( fabrica_get_theme_option( 'front_page_googlemap_paddings' ) );
	if ( fabrica_get_theme_option( 'front_page_googlemap_stack' ) ) {
		echo ' sc_stack_section_on';
	}
?>"
		<?php
		$fabrica_css      = '';
		$fabrica_bg_image = fabrica_get_theme_option( 'front_page_googlemap_bg_image' );
		if ( ! empty( $fabrica_bg_image ) ) {
			$fabrica_css .= 'background-image: url(' . esc_url( fabrica_get_attachment_url( $fabrica_bg_image ) ) . ');';
		}
		if ( ! empty( $fabrica_css ) ) {
			echo ' style="' . esc_attr( $fabrica_css ) . '"';
		}
		?>
>
<?php
	// Add anchor
	$fabrica_anchor_icon = fabrica_get_theme_option( 'front_page_googlemap_anchor_icon' );
	$fabrica_anchor_text = fabrica_get_theme_option( 'front_page_googlemap_anchor_text' );
if ( ( ! empty( $fabrica_anchor_icon ) || ! empty( $fabrica_anchor_text ) ) && shortcode_exists( 'trx_sc_anchor' ) ) {
	echo do_shortcode(
		'[trx_sc_anchor id="front_page_section_googlemap"'
									. ( ! empty( $fabrica_anchor_icon ) ? ' icon="' . esc_attr( $fabrica_anchor_icon ) . '"' : '' )
									. ( ! empty( $fabrica_anchor_text ) ? ' title="' . esc_attr( $fabrica_anchor_text ) . '"' : '' )
									. ']'
	);
}
?>
	<div class="front_page_section_inner front_page_section_googlemap_inner
		<?php
		$fabrica_layout = fabrica_get_theme_option( 'front_page_googlemap_layout' );
		echo ' front_page_section_layout_' . esc_attr( $fabrica_layout );
		if ( fabrica_get_theme_option( 'front_page_googlemap_fullheight' ) ) {
			echo ' fabrica-full-height sc_layouts_flex sc_layouts_columns_middle';
		}
		?>
		"
			<?php
			$fabrica_css      = '';
			$fabrica_bg_mask  = fabrica_get_theme_option( 'front_page_googlemap_bg_mask' );
			$fabrica_bg_color_type = fabrica_get_theme_option( 'front_page_googlemap_bg_color_type' );
			if ( 'custom' == $fabrica_bg_color_type ) {
				$fabrica_bg_color = fabrica_get_theme_option( 'front_page_googlemap_bg_color' );
			} elseif ( 'scheme_bg_color' == $fabrica_bg_color_type ) {
				$fabrica_bg_color = fabrica_get_scheme_color( 'bg_color', $fabrica_scheme );
			} else {
				$fabrica_bg_color = '';
			}
			if ( ! empty( $fabrica_bg_color ) && $fabrica_bg_mask > 0 ) {
				$fabrica_css .= 'background-color: ' . esc_attr(
					1 == $fabrica_bg_mask ? $fabrica_bg_color : fabrica_hex2rgba( $fabrica_bg_color, $fabrica_bg_mask )
				) . ';';
			}
			if ( ! empty( $fabrica_css ) ) {
				echo ' style="' . esc_attr( $fabrica_css ) . '"';
			}
			?>
	>
		<div class="front_page_section_content_wrap front_page_section_googlemap_content_wrap
		<?php
		if ( 'fullwidth' != $fabrica_layout ) {
			echo ' content_wrap';
		}
		?>
		">
			<?php
			// Content wrap with title and description
			$fabrica_caption     = fabrica_get_theme_option( 'front_page_googlemap_caption' );
			$fabrica_description = fabrica_get_theme_option( 'front_page_googlemap_description' );
			if ( ! empty( $fabrica_caption ) || ! empty( $fabrica_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				if ( 'fullwidth' == $fabrica_layout ) {
					?>
					<div class="content_wrap">
					<?php
				}
					// Caption
				if ( ! empty( $fabrica_caption ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
					?>
					<h2 class="front_page_section_caption front_page_section_googlemap_caption front_page_block_<?php echo ! empty( $fabrica_caption ) ? 'filled' : 'empty'; ?>">
					<?php
					echo wp_kses( $fabrica_caption, 'fabrica_kses_content' );
					?>
					</h2>
					<?php
				}

					// Description (text)
				if ( ! empty( $fabrica_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
					?>
					<div class="front_page_section_description front_page_section_googlemap_description front_page_block_<?php echo ! empty( $fabrica_description ) ? 'filled' : 'empty'; ?>">
					<?php
					echo wp_kses( wpautop( $fabrica_description ), 'fabrica_kses_content' );
					?>
					</div>
					<?php
				}
				if ( 'fullwidth' == $fabrica_layout ) {
					?>
					</div>
					<?php
				}
			}

			// Content (text)
			$fabrica_content = fabrica_get_theme_option( 'front_page_googlemap_content' );
			if ( ! empty( $fabrica_content ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				if ( 'columns' == $fabrica_layout ) {
					?>
					<div class="front_page_section_columns front_page_section_googlemap_columns columns_wrap">
						<div class="column-1_3">
					<?php
				} elseif ( 'fullwidth' == $fabrica_layout ) {
					?>
					<div class="content_wrap">
					<?php
				}

				?>
				<div class="front_page_section_content front_page_section_googlemap_content front_page_block_<?php echo ! empty( $fabrica_content ) ? 'filled' : 'empty'; ?>">
				<?php
					echo wp_kses( $fabrica_content, 'fabrica_kses_content' );
				?>
				</div>
				<?php

				if ( 'columns' == $fabrica_layout ) {
					?>
					</div><div class="column-2_3">
					<?php
				} elseif ( 'fullwidth' == $fabrica_layout ) {
					?>
					</div>
					<?php
				}
			}

			// Widgets output
			?>
			<div class="front_page_section_output front_page_section_googlemap_output">
				<?php
				if ( is_active_sidebar( 'front_page_googlemap_widgets' ) ) {
					dynamic_sidebar( 'front_page_googlemap_widgets' );
				} elseif ( current_user_can( 'edit_theme_options' ) ) {
					if ( ! fabrica_exists_trx_addons() ) {
						fabrica_customizer_need_trx_addons_message();
					} else {
						fabrica_customizer_need_widgets_message( 'front_page_googlemap_caption', 'ThemeREX Addons - Google map' );
					}
				}
				?>
			</div>
			<?php

			if ( 'columns' == $fabrica_layout && ( ! empty( $fabrica_content ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) ) {
				?>
				</div></div>
				<?php
			}
			?>
		</div>
	</div>
</div>
