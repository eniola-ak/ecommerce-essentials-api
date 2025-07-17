import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import slugify from 'slugify';

interface ProductAttributes {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  image?: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: number;
  declare title: string;
  declare slug?: string;
  declare description?: string;
  declare image?: string;
  declare price: number;
  declare stockQuantity: number;
  declare categoryId: number;

  static initModel(sequelize: Sequelize): typeof Product {
    Product.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING,
          unique: true,
        },
        description: {
          type: DataTypes.STRING,
        },
        image: {
          type: DataTypes.STRING,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        stockQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'Product',
        modelName: 'Product',
        timestamps: false, 
        
        hooks: {
          beforeCreate: (product: Product) => { 
            if (product.title) {
              product.slug = slugify(product.title, { lower: true });
            }
          },
          beforeUpdate: (product: Product) => {
            if (product.changed('title')) {
              product.slug = slugify(product.title, { lower: true });
            }
          }
        }
      }
    );

    return Product;
  }
}