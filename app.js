const Koa = require('koa');
const app = new Koa();

app.listen(
  5000,
  () => console.log(`Server started on port ${5000}`)
);