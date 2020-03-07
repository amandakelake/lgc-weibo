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

/**
 * 更新用户信息
 * @param newPassword
 * @param newNickName
 * @param newPicture
 * @param newCity
 * @param userName
 * @param password
 * @returns {Promise<boolean>}
 */
async function updateUser({ newPassword, newNickName, newPicture, newCity }, { userName, password }) {
    // 拼接修改内容
    const updateData = {};
    if (newPassword) {
        updateData.password = newPassword;
    }
    if (newNickName) {
        updateData.nickName = newNickName;
    }
    if (newPicture) {
        updateData.picture = newPicture;
    }
    if (newCity) {
        updateData.city = newCity;
    }

    // 拼接查询条件
    const whereData = {
        userName,
    };
    if (password) {
        whereData.password = password;
    }

    // 执行修改
    const result = await User.update(updateData, {
        where: whereData,
    });
    return result[0] > 0; // 修改的行数
}

module.exports = {
    getUserInfo,
    createUser,
    deleteCurUser,
    updateUser,
};
