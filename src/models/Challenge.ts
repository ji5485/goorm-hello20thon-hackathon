import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import User from './User';
import Category from './Category';
import ChallengeGroup from './ChallengeGroup';
import Certification from './Cerfitication';

@Table({ timestamps: true })
class Challenge extends Model<Challenge> {
  @Column({ type: DataType.STRING })
  name!: string;

  @Column({ type: DataType.TEXT })
  description!: string;

  @Column({ type: DataType.TEXT })
  goal!: string;

  @Column({ type: DataType.DOUBLE, defaultValue: 0 })
  achievement!: number;

  @BelongsTo(() => User, 'user_id')
  user!: User;

  @BelongsToMany(() => Category, 'ChallengeCategory', 'category', 'challenge')
  category!: Category[];

  @BelongsTo(() => ChallengeGroup, 'challenge_group_id')
  challenge_group!: ChallengeGroup;

  @HasMany(() => Certification, 'challenge_id')
  certification: Certification[] | undefined;
}

export default Challenge;
