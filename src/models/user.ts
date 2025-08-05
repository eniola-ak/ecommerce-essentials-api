import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';


interface UserAttributes {
  userId: number;
  email: string;
  token?: string;
  username: string;
  password: string;
  role: 'customer' | 'admin';
}

interface UserCreationAttributes extends Optional<UserAttributes, 'userId'|'role'|'token' > {}

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare userId: number;
  declare email: string;
  declare token?: string;
  declare username: string;
  declare password: string;
  declare role: 'customer' | 'admin';

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

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
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('customer', 'admin'),
          defaultValue: 'customer',
          allowNull: false,
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
        timestamps: true,
        hooks: {
          beforeCreate: async (user: User) => {
            if (user.changed('password')) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          },
          beforeUpdate: async (user: User) => {
            if (user.changed('password')) {
              user.password = await bcrypt.hash(user.password, 10);
            }
          }
        }
      }
    );
    return User;
  }
}