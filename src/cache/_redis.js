const redis = require('redis');
const { REDIS_CONFIG } = require('../config/db');

const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host);
redisClient.on('error', err => {
    console.error('redis error', err);
});

/**
 * redis set
 * @param key 键
 * @param val 值
 * @param timeout 过期时间 单位s
 */
function set(key, val, timeout = 60 * 60) {
    if (typeof val === 'object') {
        val = JSON.stringify(val);
    }
    redisClient.set(key, val);
    redisClient.expire(key, timeout);
}

/**
 * redis get
 * @param key
 */
function get(key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err);
                return;
            }
            if (val == null) {
                resolve(null);
                return;
            }
            try {
                resolve(JSON.parse(val));
            } catch (e) {
                resolve(val);
            }
        });
    });
}

module.exports = {
    set,
    get,
};
