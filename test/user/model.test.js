const User = require('../../src/db/model/User');

test('User 模型的属性 符合预期', () => {
    // build 会构建一个内存的 User实例 但不会提交到数据库
    const user = User.build({
        userName: 'zhangsan',
        password: '12344',
        nickName: '',
        picture: '/xxx.png',
        city: '广州',
    });
    // 验证各项属性
    expect(user.userName).toBe('zhangsan');
    expect(user.password).toBe('12344');
    expect(user.nickName).toBe('');
    expect(user.gender).toBe(3); // 性别默认是3
    expect(user.picture).toBe('/xxx.png');
    expect(user.city).toBe('广州');
});
