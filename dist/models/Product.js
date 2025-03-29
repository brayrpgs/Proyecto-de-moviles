"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Product extends sequelize_1.Model {
    static associate(models) {
        Product.belongsToMany(models.Image, {
            through: models.ProductImage,
            foreignKey: 'product_id',
            as: 'images'
        });
    }
    getTagsArray() {
        return this.tags ? this.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
    }
    setTagsArray(tags) {
        this.tags = tags.map(tag => tag.trim()).filter(tag => tag.length > 0).join(',');
    }
    static initialize() {
        this.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(63),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Product name is required'
                    },
                    len: {
                        args: [1, 63],
                        msg: 'Product name must be between 1 and 63 characters'
                    }
                }
            },
            summary: {
                type: sequelize_1.DataTypes.STRING(1027),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 1027],
                        msg: 'Summary cannot exceed 1027 characters'
                    }
                }
            },
            price: {
                type: sequelize_1.DataTypes.DECIMAL(10, 5),
                allowNull: false,
                validate: {
                    isDecimal: {
                        msg: 'Price must be a valid decimal number'
                    },
                    min: {
                        args: [0],
                        msg: 'Price cannot be negative'
                    },
                    notNull: {
                        msg: 'Price is required'
                    }
                }
            },
            dateConsulted: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize_1.DataTypes.NOW,
                field: 'date_consulted',
                validate: {
                    isDate: {
                        msg: 'Consultation date must be a valid date',
                        args: true
                    },
                    notNull: {
                        msg: 'Date consulted is required'
                    }
                }
            },
            store: {
                type: sequelize_1.DataTypes.STRING(63),
                allowNull: true,
                validate: {
                    len: {
                        args: [0, 63],
                        msg: 'Store name cannot exceed 63 characters'
                    }
                }
            },
            tags: {
                type: sequelize_1.DataTypes.STRING(1027),
                allowNull: true,
                field: 'tags',
                validate: {
                    len: {
                        args: [0, 1027],
                        msg: 'Tags cannot exceed 1027 characters'
                    },
                    isValidTagsFormat(value) {
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
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: true,
                field: 'is_active',
                validate: {
                    isBoolean: {
                        msg: 'Active status must be true or false',
                        args: true
                    }
                }
            },
        }, {
            sequelize: db_1.default,
            modelName: 'Product',
            tableName: 'tb_product',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            freezeTableName: true,
            hooks: {
                beforeValidate: (product) => {
                    if (product.name) {
                        product.name = product.name.trim();
                    }
                    if (product.summary) {
                        product.summary = product.summary.trim();
                    }
                    if (product.store) {
                        product.store = product.store.trim();
                    }
                    if (product.tags) {
                        product.tags = product.tags.split(',')
                            .map(tag => tag.trim())
                            .filter(tag => tag.length > 0)
                            .join(',');
                    }
                }
            }
        });
    }
}
exports.default = Product;
