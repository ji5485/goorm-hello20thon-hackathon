import {
  Table,
  Model,
  Column,
  DataType,
  IsEmail,
  BeforeCreate,
  HasMany,
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/jwt';
import Challenge from './Challenge';
import Certification from './Cerfitication';

const BCRYPT_ROUND: number = 10;

const hashPassword = async (password: string): Promise<string> =>
  bcrypt.hash(password, BCRYPT_ROUND);

@Table({ timestamps: true })
class User extends Model<User> {
  @IsEmail
  @Column({ type: DataType.STRING })
  email!: string;

  @Column({ type: DataType.STRING })
  password!: string;

  @Column({ type: DataType.STRING })
  username!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  money!: number;

  @HasMany(() => Challenge, 'user_id')
  challenges: Challenge[] | undefined;

  @HasMany(() => Certification, 'user_id')
  certifications: Certification[] | undefined;

  @BeforeCreate
  static async savePassword(instance: User): Promise<void> {
    if (instance.password) {
      const hashedPassword = await hashPassword(instance.password);
      instance.password = hashedPassword;
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    const hashedPassword = await hashPassword(password);
    return this.password === hashedPassword;
  }

  generateToken(): Promise<string> {
    return generateToken({ id: this.id });
  }
}

export default User;
