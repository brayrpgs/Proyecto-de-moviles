import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

class ProductImage extends Model { // Relational table for N:N between Product and Image
  public productId!: number;
  public imageId!: number;
  public readonly createdAt!: Date;

  static initialize() {
    this.init({
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'product_id'
      },
      imageId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'image_id'
      }
    }, {
      sequelize,
      tableName: 'tb_product_image',
      createdAt: 'created_at',
      updatedAt: false,
      timestamps: true
    });
  }
}

export default ProductImage;