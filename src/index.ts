import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import Helmet from 'koa-helmet';
import BodyParser from 'koa-body';
import { jwtMiddleware } from './lib/jwt';
import api from './api';
import { sequelize } from './sequelize';
import clc from 'cli-color';
import views from 'koa-views';

const app = new Koa();
const router = new Router();

app
  .use(
    views(__dirname + '/views', {
      extension: 'ejs',
    }),
  )
  .use(BodyParser({ multipart: true }))
  .use(Logger())
  .use(Helmet())
  .use(jwtMiddleware)
  .use(router.routes())
  .use(router.allowedMethods());
router.use('/api', api.routes());

const { green, red } = clc;
const PORT: string | number = process.env.SERVER_PORT || 4000;

sequelize
  .sync()
  .then(() => {
    console.log(
      green('[Server] Successfully Connected to PostgreSQL Database Server'),
    );

    app.listen(PORT, () => {
      console.log(
        green(
          `[Server] Koa Backend Server is Listening on Port ${PORT} Successfully`,
        ),
      );
    });
  })
  .catch(() => {
    console.log(red('[Server] Failed to Connect Server'));
  });
