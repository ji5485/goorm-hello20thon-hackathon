import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import Challenge from './Challenge';

@Table
class ChallengeGroup extends Model<ChallengeGroup> {
  @Column({ type: DataType.DATE })
  start_date!: Date;

  @Column({ type: DataType.INTEGER })
  price!: number;

  @Column({ type: DataType.DOUBLE, defaultValue: 0 })
  total_achievement!: number;

  @HasMany(() => Challenge, 'challenges')
  challenges: Challenge[] | undefined;
}

export default ChallengeGroup;
