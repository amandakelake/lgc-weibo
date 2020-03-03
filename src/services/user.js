const { User } = require('../db/model/index');
const { formatUser } = require('../services/_format');

/***
 *
 * @param userName
 * @param password
 * @returns {Promise<Array|Object|*>}
 */
async function getUserInfo(userName, password) {
    const whereOpt = {
        userName,
    };
    if (password) {
        Object.assign(whereOpt, { password });
    }
    const result = await User.findOne({
        attributes: ['id', 'userName', 'nickName', 'picture', 'city'],
        where: whereOpt,
    });
    // 未查到
    if (!result) {
        return result;
    }
    // 格式化
    return formatUser(result.dataValues);
}

/***
 * 创建用户
 * @param userName
 * @param password
 * @param gender
 * @param nickName
 * @returns {Promise<void>}
 */
async function createUser({ userName, password, gender = 3, nickName }) {
    const result = await User.create({
        userName,
        password,
        gender,
        nickName: nickName || userName,
    });
    return result.dataValues;
}

/**
 * 删除用户
 * @param userName
 * @returns {Promise<boolean>}
 */
async function deleteCurUser(userName) {
    const result = await User.destroy({
        where: {
            userName,
        },
    });
    // result是删除的行数
    return result > 0;
}

module.exports = {
    getUserInfo,
    createUser,
    deleteCurUser,
};
