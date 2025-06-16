import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique } from 'sequelize-typescript';

@Table({ tableName: 'user', timestamps: false })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  userId!: number;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  email!: string;

  @Column(DataType.STRING)
  token?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  username!: string;
}