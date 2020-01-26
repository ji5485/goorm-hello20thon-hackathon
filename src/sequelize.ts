import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_HOST,
} = process.env;

export const sequelize = new Sequelize({
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  host: DATABASE_HOST,
  models: [__dirname + '/models'],
  dialect: 'postgres',
});
