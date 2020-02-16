const Sequelize = require('sequelize');

const { MYSQL_CONFIG } = require('../config/db');
const { host, password, port, user, database } = MYSQL_CONFIG;
const { isProd, isTest } = require('../utils/env');

const config = {
    host: host,
    port: port,
    dialect: 'mysql',
};

if (isTest) {
    // 测试环境  不希望打印sql的原始语句  增加干扰信息
    config.logging = () => {};
}

// 线上环境使用连接池
if (isProd) {
    config.pool = {
        max: 5, // 连接池中最大的连接数量，后面来的要排队
        min: 0, // 连接池中最小的连接数量，这个数字如果太大，而访问量比较小，则浪费
        idle: 10000, // 如果一个连接池10s没有被使用，则释放
    };
}

const sequelize = new Sequelize(database, user, password, config);

module.exports = sequelize;
