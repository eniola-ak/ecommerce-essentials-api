import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Product } from './product';
import {CreationOptional, InferAttributes, InferCreationAttributes,} from 'sequelize';

@Table({ tableName: 'category' })
export class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: CreationOptional<number>;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column(DataType.STRING)
  slug?: string;

  @Column(DataType.STRING)
  description?: string;

  @HasMany(() => Product)
  products?: Product[];
}