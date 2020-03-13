const server = require('../server');

// 造一些特殊的字符串  后续也方便统一查找删除
const userName = `u_${Date.now()}`;
const password = `p_${Date.now()}`;
const testUser = {
    userName,
    password,
    nickName: userName,
    gender: 1,
};

// 存储cookie 为了通过loginCheck中间件
let COOKIE = '';

test('注册 第一次成功', async () => {
    const res = await server.post('/api/user/register').send(testUser);
    expect(res.body.errno).toBe(0);
});

test('重复注册，应该失败', async () => {
    const res = await server.post('/api/user/register').send(testUser);
    expect(res.body.errno).not.toBe(0);
});

test('查询注册的用户名是否存在', async () => {
    const res = await server.post('/api/user/isExist').send({ userName });
    expect(res.body.errno).toBe(0);
});

test('json schema检测， 非法输入格式的注册要失败', async () => {
    const res = await server.post('/api/user/register').send({
        userName: '123', // 用户名不能数字、下划线开头
        password: '1',
        gender: 'hhh',
    });
    expect(res.body.errno).not.toBe(0);
});

test('登录，应该成功', async () => {
    const res = await server.post('/api/user/login').send({ userName, password });
    expect(res.body.errno).toBe(0);

    // 获取cookie
    COOKIE = res.headers['set-cookie'].join(';');
});

// 修改基本信息
test('修改基本信息应该成功', async () => {
    const res = await server
        .patch('/api/user/changeInfo')
        .send({
            nickName: '测试昵称',
            city: '测试城市',
            picture: '/test.png',
        })
        .set('cookie', COOKIE);
    expect(res.body.errno).toBe(0);
});

// 修改密码
test('修改密码应该成功', async () => {
    const res = await server
        .patch('/api/user/changePassword')
        .send({
            password,
            newPassword: `p_${Date.now()}`,
        })
        .set('cookie', COOKIE);
    expect(res.body.errno).toBe(0);
});

// 注册完又删除  数据库应该是插入一条又被删掉了  如果id是递增的  再次新建一个用户  可以看到id有一位已经被用掉了
test('删除用户自己，应该成功', async () => {
    // set cookie 为了通过loginCheck中间件
    const res = await server.post('/api/user/delete').set('cookie', COOKIE);
    expect(res.body.errno).toBe(0);
});

// 退出
test('退出登录应该成功', async () => {
    const res = await server.post('/api/user/logout').set('cookie', COOKIE);
    expect(res.body.errno).toBe(0);
});

test('删除后，再次查询用户名，应该不存在', async () => {
    const res = await server.post('/api/user/isExist').send({ userName });
    expect(res.body.errno).not.toBe(0);
});
