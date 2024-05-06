<?php
/**
 * The template to display the background video in the header
 *
 * @package FABRICA
 * @since FABRICA 1.0.14
 */
$fabrica_header_video = fabrica_get_header_video();
$fabrica_embed_video  = '';
if ( ! empty( $fabrica_header_video ) && ! fabrica_is_from_uploads( $fabrica_header_video ) ) {
	if ( fabrica_is_youtube_url( $fabrica_header_video ) && preg_match( '/[=\/]([^=\/]*)$/', $fabrica_header_video, $matches ) && ! empty( $matches[1] ) ) {
		?><div id="background_video" data-youtube-code="<?php echo esc_attr( $matches[1] ); ?>"></div>
		<?php
	} else {
		?>
		<div id="background_video"><?php fabrica_show_layout( fabrica_get_embed_video( $fabrica_header_video ) ); ?></div>
		<?php
	}
}
