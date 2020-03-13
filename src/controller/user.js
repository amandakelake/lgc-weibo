const { getUserInfo, createUser, deleteCurUser, updateUser } = require('../services/user');
const { SuccessModel, ErrorModel } = require('../model/ResModel');
const {
    registerUserNameNotExistInfo,
    registerUserNameExistInfo,
    registerFailInfo,
    loginFailInfo,
    deleteUserFailInfo,
    changeInfoFailInfo,
    changePasswordFailInfo,
} = require('../model/ErrorInfo');
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

/**
 *
 * @param {Object} ctx koa上下文
 * @param userName
 * @param password
 * @returns {Promise<void>}
 */
async function login(ctx, userName, password) {
    // 登录成功 ctx.session.userInfo = xxx
    // 获取用户信息
    const userInfo = await getUserInfo(userName, doCrypto(password));
    // 登录失败
    if (!userInfo) return new ErrorModel(loginFailInfo);
    // 登录成功
    if (!ctx.session.userInfo) {
        ctx.session.userInfo = userInfo;
    }
    return new SuccessModel();
}

/**
 * 删除当前用户
 * @param userName
 * @returns {Promise<void>}
 */
async function deleteUser(userName) {
    const result = await deleteCurUser(userName);
    if (result) {
        return new SuccessModel();
    } else {
        return new ErrorModel(deleteUserFailInfo);
    }
}

/**
 * 修改用户信息
 * @param ctx
 * @param nickName
 * @param city
 * @param picture
 * @returns {Promise<ErrorModel|*|SuccessModel>}
 */
async function changeInfo(ctx, { nickName, city, picture }) {
    const { userName } = ctx.session.userInfo;
    if (!nickName) {
        nickName = userName;
    }

    const result = await updateUser(
        {
            newNickName: nickName,
            newCity: city,
            newPicture: picture,
        },
        { userName }
    );
    if (result) {
        // 更新成功  修改session.userInfo
        Object.assign(ctx.session.userInfo, {
            nickName,
            city,
            picture,
        });
        // 返回
        return new SuccessModel();
    }
    // 失败
    return new ErrorModel(changeInfoFailInfo);
}

async function changePassword(userName, password, newPassword) {
    const result = await updateUser(
        {
            newPassword: doCrypto(newPassword),
        },
        {
            userName,
            password: doCrypto(password),
        }
    );
    if (result) {
        // 成功
        return new SuccessModel();
    }
    // 失败
    return new ErrorModel(changePasswordFailInfo);
}

/**
 * 退出登录
 * @param {Object} ctx ctx
 */
async function logout(ctx) {
    delete ctx.session.userInfo;
    return new SuccessModel();
}

module.exports = {
    isExist,
    register,
    login,
    deleteUser,
    changeInfo,
    changePassword,
    logout,
};
