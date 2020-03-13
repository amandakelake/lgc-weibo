const router = require('koa-router')();
const { isExist, register, login, deleteUser, changeInfo, changePassword, logout } = require('../../controller/user');
const { genValidator } = require('../../middlewares/validator');
const userValidate = require('../../validator/user');
const { isTest } = require('../../utils/env');
const { loginCheck } = require('../../middlewares/loginChecks');

router.prefix('/api/user');

router.post('/login', async (ctx, next) => {
    const { userName, password } = ctx.request.body;
    ctx.body = await login(ctx, userName, password);
});

router.post('/register', genValidator(userValidate), async (ctx, next) => {
    const { userName, password, gender } = ctx.request.body;
    ctx.body = await register({ userName, password, gender });
});

// 用户名是否存在 注册时校验用户名
router.post('/isExist', async (ctx, next) => {
    const { userName } = ctx.request.body;
    ctx.body = await isExist(userName);
});

router.post('/delete', loginCheck, async (ctx, next) => {
    // 测试环境才可操作
    if (isTest) {
        // 测试账号登录后  才可删除自己
        const { userName } = ctx.session.userInfo;
        ctx.body = await deleteUser(userName);
    }
});

// 修改个人信息
router.patch('/changeInfo', loginCheck, genValidator(userValidate), async (ctx, next) => {
    const { nickName, city, picture } = ctx.request.body;
    ctx.body = await changeInfo(ctx, { nickName, city, picture });
});

// 修改密码
router.patch('/changePassword', loginCheck, genValidator(userValidate), async (ctx, next) => {
    const { password, newPassword } = ctx.request.body;
    const { userName } = ctx.session.userInfo;
    ctx.body = await changePassword(userName, password, newPassword);
});

// 退出登录
router.post('/logout', loginCheck, async (ctx, next) => {
    ctx.body = await logout(ctx);
});

module.exports = router;
