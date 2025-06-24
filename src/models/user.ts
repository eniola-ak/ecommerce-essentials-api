import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface UserAttributes {
  userId: number;
  email: string;
  token?: string;
  username: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public userId!: number;
  public email!: string;
  public token?: string;
  public username!: string;

  static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        token: DataTypes.STRING,
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'User',
        timestamps: false,
      }
    );
    return User;
  }
}