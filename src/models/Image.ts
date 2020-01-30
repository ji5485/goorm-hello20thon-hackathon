import {
  Table,
  Model,
  Column,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import Certification from './Certification';

@Table({ timestamps: true })
class Image extends Model<Image> {
  @Column({ type: DataType.STRING })
  name!: string;

  @Column({ type: DataType.TEXT })
  path!: string;

  @BelongsTo(() => Certification, 'certification_id')
  certification!: Certification;
}

export default Image;
