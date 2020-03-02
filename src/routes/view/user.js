const router = require('koa-router')();

/**
 * 获取用户信息
 * @param ctx
 * @returns {{isLogin: boolean}}
 */
function getLoginInfo(ctx) {
    let data = {
        isLogin: false, // 默认未登录
    };
    const userInfo = ctx.session.userInfo;
    if (userInfo) {
        data = {
            isLogin: true,
            userName: userInfo.userName,
        };
    }
    return data;
}

router.get('/login', async (ctx, next) => {
    await ctx.render('login', getLoginInfo(ctx));
});

router.get('/register', async (ctx, next) => {
    await ctx.render('register', getLoginInfo(ctx));
});

router.get('/', async ctx => {
    await ctx.render('index');
});

module.exports = router;
