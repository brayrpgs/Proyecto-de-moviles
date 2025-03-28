import sequelize from '../config/db';
import Product from './Product';
import Image from './Image';
import ProductImage from './ProductImage';

// Initialize needed models (because of relations)
Product.initialize();
Image.initialize();
ProductImage.initialize();

// Creating the relations
Product.associate({ Image, ProductImage });
Image.associate({ Product, ProductImage });

export {
  sequelize,
  Product,
  Image,
  ProductImage,
};