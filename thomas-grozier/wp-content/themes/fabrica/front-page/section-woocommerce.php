<?php
$fabrica_woocommerce_sc = fabrica_get_theme_option( 'front_page_woocommerce_products' );
if ( ! empty( $fabrica_woocommerce_sc ) ) {
	?><div class="front_page_section front_page_section_woocommerce<?php
		$fabrica_scheme = fabrica_get_theme_option( 'front_page_woocommerce_scheme' );
		if ( ! empty( $fabrica_scheme ) && ! fabrica_is_inherit( $fabrica_scheme ) ) {
			echo ' scheme_' . esc_attr( $fabrica_scheme );
		}
		echo ' front_page_section_paddings_' . esc_attr( fabrica_get_theme_option( 'front_page_woocommerce_paddings' ) );
		if ( fabrica_get_theme_option( 'front_page_woocommerce_stack' ) ) {
			echo ' sc_stack_section_on';
		}
	?>"
			<?php
			$fabrica_css      = '';
			$fabrica_bg_image = fabrica_get_theme_option( 'front_page_woocommerce_bg_image' );
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
		$fabrica_anchor_icon = fabrica_get_theme_option( 'front_page_woocommerce_anchor_icon' );
		$fabrica_anchor_text = fabrica_get_theme_option( 'front_page_woocommerce_anchor_text' );
		if ( ( ! empty( $fabrica_anchor_icon ) || ! empty( $fabrica_anchor_text ) ) && shortcode_exists( 'trx_sc_anchor' ) ) {
			echo do_shortcode(
				'[trx_sc_anchor id="front_page_section_woocommerce"'
											. ( ! empty( $fabrica_anchor_icon ) ? ' icon="' . esc_attr( $fabrica_anchor_icon ) . '"' : '' )
											. ( ! empty( $fabrica_anchor_text ) ? ' title="' . esc_attr( $fabrica_anchor_text ) . '"' : '' )
											. ']'
			);
		}
	?>
		<div class="front_page_section_inner front_page_section_woocommerce_inner
			<?php
			if ( fabrica_get_theme_option( 'front_page_woocommerce_fullheight' ) ) {
				echo ' fabrica-full-height sc_layouts_flex sc_layouts_columns_middle';
			}
			?>
				"
				<?php
				$fabrica_css      = '';
				$fabrica_bg_mask  = fabrica_get_theme_option( 'front_page_woocommerce_bg_mask' );
				$fabrica_bg_color_type = fabrica_get_theme_option( 'front_page_woocommerce_bg_color_type' );
				if ( 'custom' == $fabrica_bg_color_type ) {
					$fabrica_bg_color = fabrica_get_theme_option( 'front_page_woocommerce_bg_color' );
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
			<div class="front_page_section_content_wrap front_page_section_woocommerce_content_wrap content_wrap woocommerce">
				<?php
				// Content wrap with title and description
				$fabrica_caption     = fabrica_get_theme_option( 'front_page_woocommerce_caption' );
				$fabrica_description = fabrica_get_theme_option( 'front_page_woocommerce_description' );
				if ( ! empty( $fabrica_caption ) || ! empty( $fabrica_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
					// Caption
					if ( ! empty( $fabrica_caption ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
						?>
						<h2 class="front_page_section_caption front_page_section_woocommerce_caption front_page_block_<?php echo ! empty( $fabrica_caption ) ? 'filled' : 'empty'; ?>">
						<?php
							echo wp_kses( $fabrica_caption, 'fabrica_kses_content' );
						?>
						</h2>
						<?php
					}

					// Description (text)
					if ( ! empty( $fabrica_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
						?>
						<div class="front_page_section_description front_page_section_woocommerce_description front_page_block_<?php echo ! empty( $fabrica_description ) ? 'filled' : 'empty'; ?>">
						<?php
							echo wp_kses( wpautop( $fabrica_description ), 'fabrica_kses_content' );
						?>
						</div>
						<?php
					}
				}

				// Content (widgets)
				?>
				<div class="front_page_section_output front_page_section_woocommerce_output list_products shop_mode_thumbs">
					<?php
					if ( 'products' == $fabrica_woocommerce_sc ) {
						$fabrica_woocommerce_sc_ids      = fabrica_get_theme_option( 'front_page_woocommerce_products_per_page' );
						$fabrica_woocommerce_sc_per_page = count( explode( ',', $fabrica_woocommerce_sc_ids ) );
					} else {
						$fabrica_woocommerce_sc_per_page = max( 1, (int) fabrica_get_theme_option( 'front_page_woocommerce_products_per_page' ) );
					}
					$fabrica_woocommerce_sc_columns = max( 1, min( $fabrica_woocommerce_sc_per_page, (int) fabrica_get_theme_option( 'front_page_woocommerce_products_columns' ) ) );
					echo do_shortcode(
						"[{$fabrica_woocommerce_sc}"
										. ( 'products' == $fabrica_woocommerce_sc
												? ' ids="' . esc_attr( $fabrica_woocommerce_sc_ids ) . '"'
												: '' )
										. ( 'product_category' == $fabrica_woocommerce_sc
												? ' category="' . esc_attr( fabrica_get_theme_option( 'front_page_woocommerce_products_categories' ) ) . '"'
												: '' )
										. ( 'best_selling_products' != $fabrica_woocommerce_sc
												? ' orderby="' . esc_attr( fabrica_get_theme_option( 'front_page_woocommerce_products_orderby' ) ) . '"'
													. ' order="' . esc_attr( fabrica_get_theme_option( 'front_page_woocommerce_products_order' ) ) . '"'
												: '' )
										. ' per_page="' . esc_attr( $fabrica_woocommerce_sc_per_page ) . '"'
										. ' columns="' . esc_attr( $fabrica_woocommerce_sc_columns ) . '"'
						. ']'
					);
					?>
				</div>
			</div>
		</div>
	</div>
	<?php
}
