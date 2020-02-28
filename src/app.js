const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const { REDIS_CONFIG } = require('./config/db');
const { isProd } = require('./utils/env');

const index = require('./routes/index');
const userViewRouter = require('./routes/view/user');
const userApiRouter = require('./routes/api/user')
const errorViewRouter = require('./routes/view/error');

let onerrorConf = {};
if (isProd) {
    // 线上环境重定向到错误页，对用户更友好
    // 生产环境，直接报错，方便开发自测
    onerrorConf = {
        redirect: '/error',
    };
}
onerror(app, onerrorConf);

// for POST methods body data
app.use(bodyparser({ enableTypes: ['json', 'form', 'text'] }));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

// session 配置
app.keys = ['L#g*c%W@e!i&b^o'];
app.use(
    session({
        key: 'lgc.sid', // cookie的key
        prefix: 'lgc:sess:', // session的key的前缀
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        },
        store: redisStore({
            all: `${REDIS_CONFIG.host}:${REDIS_CONFIG.port}`,
        }),
    })
);

app.use(
    views(__dirname + '/views', {
        extension: 'ejs',
    })
);

// routes
app.use(index.routes(), index.allowedMethods());
app.use(userViewRouter.routes(), userViewRouter.allowedMethods());
app.use(userApiRouter.routes(), userApiRouter.allowedMethods());
// 错误路由要注册在最后做兜底
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

module.exports = app;
