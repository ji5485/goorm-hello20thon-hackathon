import Router from 'koa-router';
import * as authController from './auth.controller';

const auth = new Router();

auth.post('/signup', authController.register);
auth.post('/login', authController.login);
auth.get('/logout', authController.logout);

export default auth;
