import { Table, Column, Model, DataType, ForeignKey, PrimaryKey, AutoIncrement, BelongsTo } from 'sequelize-typescript';
import { Category } from './category';

@Table({ tableName: 'product' })
export class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  title!: string;

  @Column(DataType.STRING)
  slug?: string;

  @Column(DataType.STRING)
  description?: string;

  @Column(DataType.STRING)
  image?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  stockQuantity!: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  categoryId!: number;

  @BelongsTo(() => Category)
  category!: Category;

}