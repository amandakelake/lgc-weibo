/***
 * 直接 node src/db/sync.js 会删除之前的表 创建当前的表结构
 */
const sequelize = require('./seq');

// 数据模型
require('./model/index');

// 测试连接
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// 同步到硬盘的数据库中
// force: true 是每次都删掉旧的，然后新建
sequelize.sync({ force: true }).then(() => {
    console.log('sync ok');
    process.exit();
});
