import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface CategoryAttributes {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

export class Category extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes {
  declare id: number;
  declare name: string;
  declare slug?: string;
  declare description?: string;

  static initModel(sequelize: Sequelize): typeof Category {
    Category.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING, 
          unique: true,
        },

        description: {type: DataTypes.STRING,}
      },
      {
        sequelize,
        tableName: 'Category',
      }
    );
    return Category;
  }
}