import { Product, Image, ProductImage, sequelize } from '../models/index';
import { Op } from 'sequelize';

export class ProductService {
  
  async create(product: any, urlImages: any[]) {
    // Start a new transaction
    const transaction = await sequelize.transaction();
    
    try {
      const images: { id: number; url: string }[] = [];
  
      // 1. Process all images (find or create each one)
      for (const urlImage of urlImages) {
        const [image] = await Image.findOrCreate({
          where: { url: urlImage.url },
          defaults: urlImage,
          transaction
        });

        // 1.1 Just push non-repeated images (rows on db)
        const found = images.find(({ url }) => url === image.url);
        if (found != undefined){
          images.push(image);
        }
      }
  
      // 2. Create the new product
      const newProduct = await Product.create(product, { transaction });
  
      // 3. Create relationships in ProductImage table
      const productImages = images.map(image => ({
        productId: newProduct.id,
        imageId: image.id
      }));
      
      await ProductImage.bulkCreate(productImages, { transaction });
  
      // Commit the transaction if all operations succeeded
      await transaction.commit();
  
      // Return the product with its images
      return await Product.findByPk(newProduct.id, {
        include: [{ model: Image, as: 'images' }],
        transaction
      });
  
    } catch (error: any) {
      // Rollback if any operation fails
      await transaction.rollback();
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async read(page:number, size:number, queryParams: Record<string, any>) {
    try {
      // Variable for filters from extra params and only on those fields
      const where: Record<string, any> = {};
      const allowedFields = ['id', 'name', 'price', 'store', 'url_indentifier', 'isActive'];
  
      // Maping of filters
      for (const [key, value] of Object.entries(queryParams)) {
        if (allowedFields.includes(key)) {
          if (key === 'isActive') {
            where[key] = value === 'true'; // Convert string to boolean
          } 
          
          else if (key === 'id') {
            where[key] = value; // Exact match for IDs
          }

          else {
            where[key] = { [Op.iLike]: `%${value}%` }; // Case-insensitive search
          }
        }
      }
  
      return await Product.findAndCountAll({
        limit: size,
        offset: (page - 1) * size,
        attributes: ['urlIdentifier', 'name', 'price', 'typeCoin', 'store', 'tags', 'id','dateConsulted'],
        where: Object.keys(where).length > 0 ? where : undefined,
        include: [{
          model: Image,
          as: 'images' 
        }]
      });
    } catch(error:any) {
      throw new Error(error.message);
    }
  }

  async update(productId: number, productData: any, urlImages: any[]) {
    // Start a new transaction
    const transaction = await sequelize.transaction();
  
    try {
      // 1. Update the product basic information
      const [updatedRows] = await Product.update(productData, {
        where: { id: productId },
        transaction
      });
  
      if (updatedRows === 0) {
        throw new Error('Product not found');
      }
  
      // 2. Get current product-image relationships
      const currentProductImages = await ProductImage.findAll({
        where: { productId },
        include: [{ model: Image, as: 'image' }],
        transaction
      });
  
      // 3. Process new images array
      const newImages: { id: number; url: string }[] = [];
      for (const urlImage of urlImages) {
        const [image] = await Image.findOrCreate({
          where: { url: urlImage.url },
          defaults: urlImage,
          transaction
        });
        // 3.1 Just push non-repeated images (rows on db)
        const found = newImages.find(({ url }) => url === image.url);
        if (found != undefined){
          newImages.push(image);
        }
      }
  
      // 4. Identify images to add/remove
      const currentImageIds = currentProductImages.map(pi => pi.imageId);
      const newImageIds = newImages.map(img => img.id);
      
      // Images to remove (exist in DB but not in new array)
      const imagesToRemove = currentImageIds.filter(id => !newImageIds.includes(id));
  
      // 5. Remove obsolete relationships
      if (imagesToRemove.length > 0) {
        await ProductImage.destroy({
          where: {
            productId,
            imageId: imagesToRemove
          },
          transaction
        });
  
        // Find images that are no longer referenced by any product
        const imagesWithOtherRelations = await ProductImage.findAll({
          where: { imageId: imagesToRemove },
          transaction
        });
  
        const orphanedImageIds = imagesToRemove.filter(id => 
          !imagesWithOtherRelations.some(i => i.imageId === id)
        );
  
        // Delete truly orphaned images
        if (orphanedImageIds.length > 0) {
          await Image.destroy({
            where: { id: orphanedImageIds },
            transaction
          });
        }
      }
  
      // 6. Add new relationships
      const existingRelations = currentProductImages.map(pi => pi.imageId);
      const relationsToAdd = newImageIds.filter(id => !existingRelations.includes(id));
  
      await ProductImage.bulkCreate(
        relationsToAdd.map(imageId => ({ productId, imageId })),
        { transaction }
      );
  
      // Commit if all operations succeeded
      await transaction.commit();
  
      // Return updated product
      return await Product.findByPk(productId, {
        include: [{ model: Image, as: 'images' }],
        transaction
      });
  
    } catch (error: any) {
      // Rollback on error
      await transaction.rollback();
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async delete(productId: number) {
    const transaction = await sequelize.transaction();
    try {
      // 1. Delete the product (set isActive to false)
      const [updatedRows] = await Product.update(
        { isActive: false },
        { 
          where: { id: productId },
          transaction
        }
      );
  
      if (updatedRows === 0) {
        throw new Error('Product not found');
      }
  
      // 2. Get all images associated with this product
      const productImages = await ProductImage.findAll({
        where: { productId },
        transaction
      });
  
      const imageIds = productImages.map(pi => pi.imageId);
  
      // 3. Delete all product-image relationships
      await ProductImage.destroy({
        where: { productId },
        transaction
      });
  
      // 4. Check which images are orphaned (not used by any other product)
      if (imageIds.length > 0) {
        const usedImages = await ProductImage.findAll({
          where: { imageId: imageIds },
          transaction
        });
  
        const usedImageIds = new Set(usedImages.map(ui => ui.imageId));
        const orphanedImageIds = imageIds.filter(id => !usedImageIds.has(id));
  
        // 5. Delete orphaned images
        if (orphanedImageIds.length > 0) {
          await Image.destroy({
            where: { id: orphanedImageIds },
            transaction
          });
        }
      }
  
      await transaction.commit();
      return { updatedRows };
    } catch (error: any) {
      await transaction.rollback();
      console.error("Error deleting product:", error);
      throw error;
    }
  }

}

