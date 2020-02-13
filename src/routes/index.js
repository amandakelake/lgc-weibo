const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    // 异步读取IO 需要await
    await ctx.render('index', {
        title: 'Hello Koa 2 -> lgc-weibo!',
        msg: 'node backend project',
    });
});

router.get('/string', async (ctx, next) => {
    ctx.body = 'koa2 string';
});

router.get('/json', async (ctx, next) => {
    ctx.body = {
        title: 'koa2 json',
    };
});

module.exports = router;
