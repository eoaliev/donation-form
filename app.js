const compress = require('koa-compress');
const donates = require('./controllers/donates');
const Koa = require('koa');
const logger = require('koa-logger');
const path = require('path');
const Router = require('koa-router');
const serve = require('koa-static');

const app = new Koa();
const router = new Router();

// Logger
app.use(
  logger()
);

router.post('/donate', donates.donate);

app.use(router.routes());
app.use(router.allowedMethods());

// Serve static files
app.use(
  serve(
    path.join(__dirname, 'client/dist')
  )
);

// Compress
// app.use(
//   compress()
// );

app.listen(5000);
