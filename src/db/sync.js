/**
 * 同步
 */

const sequelize = require('./seq');

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
