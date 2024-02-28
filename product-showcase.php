<?php
/**
 * Plugin Name:       Product Showcase
 * Description:       A block to customize and show your online store products. Sapphire-IT make is
 * easy to show the products you want to show.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Sapphire IT
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       sphr-recent-post
 *
 * @package           product-showcase
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Get All Product
 *
 * @param array $attributes array of props [explicite description].
 *
 * @return string
 */
function product_showcase_block( $attributes ) {
	$args = array(
		'post_type'      => 'product',
		'post_status'    => 'publish',
		'orderby'        => $attributes['orderBy'],
		'order'          => $attributes['order'],
		'posts_per_page' => $attributes['postsPerPage'],
	);

	if ( isset( $attributes['categories'] ) ) {
		$args['category__in'] = array_column( $attributes['categories'], 'id' );
	}

	$wpcp_product_showcase = new WP_Query( $args );
	ob_start();
	?>
		<div <?php get_block_wrapper_attributes(); ?>>
		<section class="wpcp-product-slider-wrapper">
			<div class="wpcp-product-slider">
				<div class="swiper-wrapper flex-display has-<?php echo esc_attr( $attributes['columns'] ); ?>-columns">
					<?php

					while ( $wpcp_product_showcase->have_posts() ) {
						$wpcp_product_showcase->the_post();

						global $product;

						$post_thumbnail_id = $product->get_image_id();
						if ( $post_thumbnail_id ) {
							$product_image_url = wp_get_attachment_url( $post_thumbnail_id );
						}
						$wpcpps_product_price = $product->get_price_html() ? $product->get_price_html() : 'Out of stock';

						?>

						<div class="swiper-slide">
							<div class="product wpcp-product">
								<a href="<?php echo wp_kses_post( get_the_permalink() ); ?>"><img src="<?php echo esc_url( $product_image_url ); ?>"></a>
								<div class="product-info">
									<h4 class="product-title"><?php the_title(); ?></h4>
									<p class="product-price"> Price: <?php echo wp_kses_post( $wpcpps_product_price ); ?></p>
									<?php
									$add_to_cart = do_shortcode( '[add_to_cart id="' . $product->get_id() . '" show_price="false" style="" class="wpcp-add-to-cart"]' );
									echo wp_kses_post( $add_to_cart );
									?>

								</div>
							</div>
						</div>
						<?php
					}
					wp_reset_postdata();
					?>
				</div>

				<!-- If we need navigation buttons -->
				<div class="swiper-button-prev"></div>
				<div class="swiper-button-next"></div>

				<!-- If we need pagination -->
				<div class="swiper-pagination"></div>


			</div>
		</section>
		</div>

		<?php
		return ob_get_clean();
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function sphr_product_showcase_block_init() {
	register_block_type( __DIR__ . '/build', array( 'render_callback' => 'product_showcase_block' ) );
}
add_action( 'init', 'sphr_product_showcase_block_init' );
