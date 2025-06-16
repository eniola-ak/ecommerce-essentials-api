import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Product } from './product';

@Table({ tableName: 'category' })
export class Category extends Model<Category> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

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