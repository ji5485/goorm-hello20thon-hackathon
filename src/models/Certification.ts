import {
  Table,
  Model,
  BelongsTo,
  HasMany,
  Column,
  DataType,
} from 'sequelize-typescript';
import Challenge from './Challenge';
import User from './User';
import Image from './Image';

type Verification = 'PENDING' | 'SUCCESS' | 'FAILURE';

@Table({ timestamps: true })
class Certification extends Model<Certification> {
  @BelongsTo(() => Challenge, 'challenge_id')
  challenge!: Challenge;

  @BelongsTo(() => User, 'user_id')
  user!: User;

  @Column({ type: DataType.BLOB })
  picture!: any;

  @Column({
    type: DataType.ENUM('PENDING', 'SUCCESS', 'FAILURE'),
    defaultValue: 'PENDING',
  })
  verification!: Verification;

  @HasMany(() => Image, 'certification_id')
  image: Image[] | undefined;
}

export default Certification;
