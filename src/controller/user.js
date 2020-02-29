const { getUserInfo, createUser } = require('../services/user');
const { SuccessModel, ErrorModel } = require('../model/ResModel');
const { registerUserNameNotExistInfo, registerUserNameExistInfo, registerFailInfo } = require('../model/ErrorInfo');
const doCrypto = require('../utils/cryp');

/***
 *
 * @param userName
 * @returns {Promise<ErrorModel|*|SuccessModel>}
 */
async function isExist(userName) {
    const userInfo = await getUserInfo(userName);
    if (userInfo) {
        return new SuccessModel(userInfo);
    } else {
        return new ErrorModel(registerUserNameNotExistInfo);
    }
}

/***
 *
 * @param userName
 * @param password
 * @param gender 性别（1男 2女 3保密）
 * @returns {Promise<void>}
 */
async function register({ userName, password, gender }) {
    const userInfo = await getUserInfo(userName);
    if (userInfo) {
        return new ErrorModel(registerUserNameExistInfo);
    }
    try {
        await createUser({ userName, password: doCrypto(password), gender });
        return new SuccessModel();
    } catch (e) {
        // 应该有错误日志
        console.error(e);
        return new ErrorModel(registerFailInfo);
    }
}

module.exports = {
    isExist,
    register,
};
