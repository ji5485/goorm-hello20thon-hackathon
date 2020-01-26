import {
  Table,
  Model,
  BelongsTo,
  Column,
  DataType,
} from 'sequelize-typescript';
import Challenge from './Challenge';
import User from './User';

type Verification = 'pending' | 'success' | 'Failure';

@Table({ timestamps: true })
class Certification extends Model<Certification> {
  @BelongsTo(() => Challenge, 'challenge_id')
  challenge!: Challenge;

  @BelongsTo(() => User, 'user_id')
  user!: User;

  @Column({ type: DataType.BLOB })
  picture!: any;

  @Column({
    type: DataType.ENUM('Pending', 'Success', 'Failure'),
    defaultValue: 'Pending',
  })
  verification!: Verification;
}

export default Certification;
