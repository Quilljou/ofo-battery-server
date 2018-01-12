const Koa = require('koa');
const app = new Koa();
const router = require('./app/router');
const bodyParser = require('koa-bodyparser')
const PORT = 3000;

app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())


app.listen(PORT, () => {
  console.log('HTTP SERVER IS LISTENING ON %s', PORT);
});


module.exports = app;
