const { isProd } = require('../utils/env');

let REDIS_CONFIG = { port: 6379, host: '127.0.0.1' };

// 线上处理
if (isProd) {
    REDIS_CONFIG = { port: 6379, host: '127.0.0.1' };
}

module.exports = {
    REDIS_CONFIG,
};
