const { isProd } = require('../utils/env');

let REDIS_CONFIG = {
    port: 6379,
    host: '127.0.0.1',
};

let MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: '88888888',
    port: '3306',
    database: 'lgc_weibo_db',
};

// 线上处理
if (isProd) {
    REDIS_CONFIG = { port: 6379, host: '127.0.0.1' };
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: '88888888',
        port: '3306',
        database: 'lgc_weibo_db',
    };
}

module.exports = {
    REDIS_CONFIG,
    MYSQL_CONFIG,
};
