import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import Helmet from 'koa-helmet';
import BodyParser from 'koa-bodyparser';
import { jwtMiddleware } from './lib/jwtFunctions';
import api from './api';
import { sequelize } from './sequelize';
import clc from 'cli-color';

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());
app
  .use(BodyParser())
  .use(Logger())
  .use(Helmet())
  .use(jwtMiddleware)
  .use(router.routes())
  .use(router.allowedMethods());

const { green, red } = clc;
sequelize
  .sync()
  .then(() => {
    console.log(
      green('[Server] Successfully Connected to PostgreSQL Database Server'),
    );

    app.listen(4000, () => {
      console.log(
        green('[Server] Successfully Connected to Koa Backend Server'),
      );
    });
  })
  .catch(() => {
    console.log(red('[Server] Failed to Connect Server'));
  });
