import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table
class Category extends Model<Category> {
  @Column({ type: DataType.STRING })
  name!: string;
}

export default Category;
