import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';

export interface IProductAttributes {
  id?: number;
  urlIdentifier?: string;
  name: string;
  summary?: string | null;
  price: string;
  typeCoin: string;
  dateConsulted: Date;
  store?: string | null;
  tags?: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  images?: any[]
}

interface IProductCreationAttributes extends Optional<IProductAttributes, 'id'> { }

class Product extends Model<IProductAttributes, IProductCreationAttributes> implements IProductAttributes {
  public id!: number;
  public urlIdentifier!: string;
  public name!: string;
  public summary!: string | null;
  public price!: string;
  public typeCoin!: string;
  public dateConsulted!: Date;
  public store!: string | null;
  public tags!: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public images?: any[];

  static associate(models: any) {

    Product.belongsToMany(models.Image, {
      through: models.ProductImage,
      foreignKey: 'product_id',
      as: 'images'
    });
  }

  public getTagsArray(): string[] {
    if (!this.tags) {

      return [];
    }
    return this.tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  public setTagsArray(tags?: string[]): void {

    if (tags && Array.isArray(tags)) {
      this.tags = tags
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .join(',');
    } else {
      this.tags = '';
    }
  }

  static initialize() {

    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notNull: { msg: 'Product name is required' },
            notEmpty: { msg: 'Product name is required' }
          }
        },
        urlIdentifier: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'url_identifier',
          unique: true,
          validate: { isUrl: { msg: 'URL must be correct' } }
        },
        summary: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        price: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notNull: { msg: 'Price is required' }
          }
        },
        typeCoin: {
          type: DataTypes.STRING(15),
          allowNull: false,
          field: 'type_coin',
          validate: {
            len: { args: [0, 15], msg: 'Type coin cannot exceed 15 characters' }
          }
        },
        dateConsulted: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'date_consulted',
          validate: {
            isDate: { msg: 'Consultation date must be a valid date', args: true },
            notNull: { msg: 'Date consulted is required' }
          }
        },
        store: {
          type: DataTypes.STRING(63),
          allowNull: false,
          validate: {
            len: { args: [0, 63], msg: 'Store name cannot exceed 63 characters' },
            notNull: { msg: 'Store is required' }
          }
        },
        tags: {
          type: DataTypes.STRING(1027),
          allowNull: true,
          field: 'tags',
          validate: {
            len: { args: [0, 1027], msg: 'Tags cannot exceed 1027 characters' },
            isValidTagsFormat(value: string | null) {
              if (value && value.length > 0) {
                const tags = value.split(',');
                if (tags.some(tag => tag.trim().length === 0)) {
                  throw new Error('Tags cannot contain empty values between commas');
                }
                if (tags.some(tag => tag.includes(','))) {
                  throw new Error('Individual tags cannot contain commas');
                }
              }
            }
          }
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          field: 'is_active',
          validate: { isBoolean: { msg: 'Active status must be true or false' } }
        },
      },
      {
        sequelize,
        modelName: 'Product',
        tableName: 'tb_product',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
        hooks: {
          beforeValidate: (product: Product) => {
            console.log("Ejecutando beforeValidate...");
            if (product.name) product.name = product.name.trim();
            if (product.summary) product.summary = product.summary.trim();
            if (product.store) product.store = product.store.trim();
            if (product.tags) {
              product.tags = product.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)
                .join(',');
            } else {
              product.tags = '';
            }
          }
        }
      }
    );
  }
}

try {
  Product.initialize();
} catch (error) {
  console.error("Error:", error);
}

export default Product;
