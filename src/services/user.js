const { User } = require('../db/model/index');
const { formatUser } = require('../services/_format');

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

module.exports = {
    getUserInfo,
};
