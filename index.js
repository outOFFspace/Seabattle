var koa = require('koa');
const path = require('path');
const serve = require('koa-static');
var views = require('koa-views');
var app = new koa();

app.use(serve('.'));

app.use(views(__dirname, { extension: 'html' }))

app.use(async function (ctx) {
await ctx.render('index')
})

app.listen(9999);
console.log('listening on port 9999');