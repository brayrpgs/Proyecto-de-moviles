import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

class Image extends Model {
  public id!: number;
  public url!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) { // Asociation with Product
    Image.belongsToMany(models.Product, {
      through: models.ProductImage,
      foreignKey: 'image_id',
      as: 'products'
    });
  }

  static initialize() {
    this.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          isUrl: { msg: 'URL must be correct' }
        }
      }
    }, {
      sequelize,
      tableName: 'tb_image',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
  }
}

export default Image;