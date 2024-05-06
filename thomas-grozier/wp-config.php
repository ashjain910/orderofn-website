<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'UB7]Ip?I`~M7h{dj#Ood5*YNx:[gxcn=ao~B&YcJr4$RCA;+<-zx0X<r:hT;F-)6' );
define( 'SECURE_AUTH_KEY',  'g;z33Cuo)W E;#$C]Hq{%?Yi?&Qi0p`JGv@`|intU6J WS|v:fBf*f,,:T%/iYe4' );
define( 'LOGGED_IN_KEY',    'bErzsO9<}yWy,gBU6Zz!7H7.hBCd`QoP5cSP<w!}TxYilNF5-_af8Io(Iq]$*)cu' );
define( 'NONCE_KEY',        'O;pARV^FJ3<;t%.W`AT+W&lf7e%QKuB5AF{Pw5LS[d55bQ#UgfBy#PgmNDqYKhXy' );
define( 'AUTH_SALT',        '[u%t]wBSl)*]=SC$tPm/wT*p -7g:~4UfKd`A0Ze#m:[tABJ|e1Nu_8wg62bDR>J' );
define( 'SECURE_AUTH_SALT', '_H-|5JZfVI}`?|*2LnnJy[8o9;gmeM3osTYS7W^VZ5(FX2pB{1J-)Z{5$iOSN@T9' );
define( 'LOGGED_IN_SALT',   'vExqw]AiR*hW1Jm1(3_,Wx`oN}ea7Cq8$cBSl?!aBV#b1cS>_d~Z[xS|Ne79,p%#' );
define( 'NONCE_SALT',       'w#~CoeNRzu>;FU(z0s7bVJ?Eq#e7j0q_y5b6aV)uLblle7!U8mB1Gzpy*0Bhg1;l' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
