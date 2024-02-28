import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';

registerBlockType('sphr-it/product-showcase', {
	edit: Edit,
	save,
});
