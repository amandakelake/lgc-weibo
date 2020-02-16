const Sequelize = require('sequelize');

const config = {
    host: 'localhost',
    dialect: 'mysql',
};

// 线上环境使用连接池
// config.pool = {
//     max: 5, // 连接池中最大的连接数量，后面来的要排队
//     min: 0, // 连接池中最小的连接数量，这个数字如果太大，而访问量比较小，则浪费
//     idle: 10000, // 如果一个连接池10s没有被使用，则释放
// };

// 先在workbench创建lgc_weibo_db schema
// 创建连接
const sequelize = new Sequelize('lgc_weibo_db', 'root', '88888888', config);

// 测试连接
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// 定义模型  创建的表叫users 好像会自动加个s？？？
const User = sequelize.define('user', {
    userName: {
        type: Sequelize.STRING, // 默认是 varchar(255)
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nickName: {
        type: Sequelize.STRING,
        comment: '昵称',
    },
});

const Blog = sequelize.define('blog', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

// 外键关联
Blog.belongsTo(User, {
    // 创建外键 Blog.userId -> User.id
    foreignKey: 'userId',
});
User.hasMany(Blog, {
    foreignKey: 'userId',
});

// 同步到硬盘的数据库中
sequelize.sync({ force: true }).then(() => {
    console.log('sync ok');
    process.exit();
});

module.exports = {
    Blog,
    User,
};
