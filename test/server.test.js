const server = require('./server');

test('测试HTTP接口：json', async () => {
    const res = await server.get('/json');
    expect(res.body.title).toBe('koa2 json');
});
