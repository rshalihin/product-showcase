import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element'
import { useSelect } from '@wordpress/data';
import './editor.scss';
import { PanelBody, RangeControl, QueryControls } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const { columns, postsPerPage, layout, filter, order, orderBy, pagination, categories } = attributes;

	const cateIds = categories && categories.length > 0 ? categories.map(cat => cat.id) : [];
	const products = useSelect((select) => {
		return select('core').getEntityRecords('postType', 'product', { per_page: postsPerPage, _embed: true, order, orderby: orderBy, categories: cateIds });
	}, [postsPerPage, order, orderBy, categories]);

	// Get All categories
	const allCate = useSelect((select) => {
		return select('core').getEntityRecords('taxonomy', 'category', { par_page: 999, })
	}, []);

	const cateSuggestions = {};
	// add all categories in cateSuggestions object
	if (allCate) {
		for (let i = 0; i < allCate.length; i++) {
			const cate = allCate[i];
			cateSuggestions[cate.name] = cate;
		}
	};

	// update categories as user per user selections
	const onCategoryChanges = (values) => {
		// Find Invalide user input category
		const hasNoSuggestions = values.some((value) => typeof value === 'string' && !cateSuggestions[value]);
		// return if Invalide input
		if (hasNoSuggestions) return;
		// Get Valide input
		const updateCategories = values.map((token) => {
			return typeof token === 'string' ? cateSuggestions[token] : token;
		});
		// Update category.
		setAttributes({ categories: updateCategories });

	}

	const onColumnChange = (newNumberColumn) => {
		setAttributes({ columns: newNumberColumn });
	};

	const onPostsPerPageChange = (newPostsPerPage) => {
		setAttributes({ postsPerPage: newPostsPerPage });
	};

	console.log(products);

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<RangeControl label={__('Columns', 'product-showcase')} min={1} max={6} value={columns} onChange={onColumnChange} />
					<QueryControls
						numberOfItems={postsPerPage}
						onNumberOfItemsChange={onPostsPerPageChange}
						minItems={2}
						maxItems={50}
						orderBy={orderBy}
						onOrderByChange={(value) => setAttributes({ orderBy: value })}
						order={order}
						onOrderChange={(value) => setAttributes({ order: value })}
						categorySuggestions={cateSuggestions}
						selectedCategories={categories}
						onCategoryChange={onCategoryChanges}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>
				<section className="wpcp-product-slider-wrapper">
					<div className="wpcp-product-slider">
						<div className={`swiper-wrapper flex-display has-${columns}-columns`}>
							{products && products.map((product) => {
								const featuerImage = product._embedded && product._embedded['wp:featuredmedia'] && product._embedded['wp:featuredmedia'].length > 0 && product._embedded['wp:featuredmedia'][0];
								return (
									<div className="swiper-slide" key={product.id}>
										<div className="product wpcp-product">
											<a href={product.link}>
												{featuerImage && <img src={featuerImage.source_url} alt='' />}
											</a>
											<div className="product-info">
												<h4 className="product-title">
													{product.title.rendered ?
														<RawHTML>{product.title.rendered}</RawHTML>
														: __("No Title", "product-showcase")
													}
												</h4>
												<a className='button product_type_variable add_to_cart_button' target="_blank" rel="noreferrer" href={product.link}>Add to Cart</a>

											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</section>

			</div>
		</>
	);
}
