const server = require('./server');

test('测试HTTP接口：json', async () => {
    // 测试get接口
    const res = await server.get('/json');
    expect(res.body.title).toBe('koa2 json');
    // 测试post接口
    // server.post('/login').send({userName: '', password: ''})
});

