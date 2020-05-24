global.__rootdir = __dirname;

const config = require('config');
const path = require('path');
const Koa = require('koa');

const app = new Koa();

// Request validation
{
  const validator = require('koa-validate');
  validator(app);
}

// Logger
{
  const logger = require('koa-logger');
  app.use(
    logger()
  );
}

// Parse request body
{
  const bodyParser = require('koa-bodyparser');
  app.use(
    bodyParser()
  );
}

// Serve static files
{
  const serve = require('koa-static');
  app.use(
    serve(
      path.join(__dirname, 'client/dist')
    )
  );
}

// Mongo connection
app.use(async ({response}, next) => {
  try {
    await require('mongoose').connect(
      config.get('MONGO.URI'),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 25000, // Close sockets after 45 seconds of inactivity
      }
    );
  } catch (ex) {
    response.status = 500;
    response.body = {error: ex.message};
    console.error(ex.message);
    return;
  }

  return next();
});

// Routing
{
  const Router = require('koa-router');
  const router = new Router();
  app.use(router.routes());
  app.use(router.allowedMethods());

  const donates = require(`${__rootdir}/controllers/Donates`);
  router.post('/donate', donates.donate);
}

// Compress
{
  const compress = require('koa-compress');
  app.use(
    compress()
  );
}

const PORT = config.get('PORT');
app.listen(PORT, () => console.log(`Start application on port ${PORT}`));
