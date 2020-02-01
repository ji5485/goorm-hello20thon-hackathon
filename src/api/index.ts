import Router from 'koa-router';
import auth from './auth';
import challenge from './challenge';
import certification from './certification';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/challenge', challenge.routes());
api.use('/certification', certification.routes());

import Category from '../models/Category';
api.get('/', async (ctx: any) => {
  for (let i = 0; i < 3; i++) {
    await Category.create({ name: `Test Category ${i}` });
  }
});

export default api;
