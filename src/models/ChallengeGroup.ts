import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import Challenge from './Challenge';
import User from './User';

type Status = 'WAITING' | 'ONGOING' | 'COMPLETE';

@Table
class ChallengeGroup extends Model<ChallengeGroup> {
  @Column({ type: DataType.DATE })
  start_date!: Date;

  @Column({ type: DataType.INTEGER })
  price!: number;

  @Column({ type: DataType.DOUBLE, defaultValue: 0 })
  total_achievement!: number;

  @Column({
    type: DataType.ENUM('WAITING', 'ONGOING', 'COMPLETE'),
    defaultValue: 'WAITING',
  })
  status!: Status;

  @HasMany(() => Challenge, 'challenge_group_id')
  challenges: Challenge[] | undefined;

  @BelongsToMany(() => User, 'ChallengeGroupUsers', 'user', 'challenge_group')
  user: User[] | undefined;
}

export default ChallengeGroup;
