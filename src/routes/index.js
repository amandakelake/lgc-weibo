const router = require('koa-router')();
const { loginRedirect } = require('../middlewares/loginChecks');

router.get('/string', async (ctx, next) => {
    const session = ctx.session;
    if (!session.viewTimes && session.viewTimes !== 0) {
        session.viewTimes = 0;
    } else {
        session.viewTimes++;
    }
    ctx.body = {
        title: 'koa2 string',
        viewTimes: session.viewTimes,
    };
});

router.get('/json', async (ctx, next) => {
    ctx.body = {
        title: 'koa2 json',
    };
});

router.get('/error', async (ctx, next) => {
    throw new Error();
});

router.get('/', loginRedirect, async (ctx, next) => {
    // 异步读取IO 需要await
    await ctx.render('index', {
        title: 'Hello Koa 2 -> lgc-weibo!',
        msg: 'node backend project',
        blogList: [
            {
                id: 1,
                title: 'aaa',
            },
        ],
        blogData: {},
    });
});

module.exports = router;
