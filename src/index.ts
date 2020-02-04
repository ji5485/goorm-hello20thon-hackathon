import Koa from 'koa';
import Logger from 'koa-logger';
import Helmet from 'koa-helmet';
import BodyParser from 'koa-body';
import { jwtMiddleware } from './lib/jwt';
import { sequelize } from './sequelize';
import clc from 'cli-color';
import views from 'koa-views';
import serve from 'koa-static';
import { join } from 'path';
import cron from 'node-cron';
import checkChallengeGroup from './lib/cronjob';
import url from './urls';

const app = new Koa();

app
  .use(
    views(join(__dirname, '/views'), {
      extension: 'ejs',
    }),
  )
  .use(
    BodyParser({
      multipart: true,
      formidable: {
        maxFileSize: 1024 * 1024 * 10,
        uploadDir: join(__dirname, '../uploads'),
        keepExtensions: true,
      },
    }),
  )
  .use(Logger())
  .use(Helmet())
  .use(jwtMiddleware)
  .use(serve(__dirname + '/static'))
  .use(url.routes())
  .use(url.allowedMethods());

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

      // 0 0 * * * -> At 00:00 EveryDay
      cron.schedule('* * * * *', checkChallengeGroup);
    });
  })
  .catch(() => {
    console.log(red('[Server] Failed to Connect Server'));
  });
