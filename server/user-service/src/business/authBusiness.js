import {
    createUser,
    getUserByEmail,
    getUserByUserName,
    findUserById,
} from "../data-access/userDA.js";
import {
    ApiError,
    createSendToken,
    encryptPassword,
    isPasswordMatch,
} from "../utils/index.js";
import {send_Link_Mail} from "../utils/templateSendMail.js";
import {send_Link_Mail_Login_Success} from "../utils/templateSendMailLoginSuccess.js";
import config from "../config/config.js";
import {send_Link_Mail_Register_Success} from "../utils/templateSendMailRegisterSuccess.js";
import {RabbitMQ_notifyReceiver} from "../services/RabbitMQService/send/mail.js";

async function handleLogin(_username, _password) {
    const user = await getUserByUserName(_username);
    if (!user || !(await isPasswordMatch(_password, user.password))) {
        throw new ApiError(400, "Incorrect username or password");
    }

    const userObj = user.toObject();
    delete userObj.password;
    const token = await createSendToken(userObj);
    if (user.email) {
        await RabbitMQ_notifyReceiver(
            userObj._id,
            user.email,
            send_Link_Mail_Login_Success(user.firstName, user.lastName),
            "Email sender",
            "Kindergarten.com"
        );
    }
    return {userObj, token};
}

async function handleCreateListUsers(users) {
    const resList = [];
    for (let index = 0; index < users.length; index++) {
        var user = users[index];
        const resData = {};
        try {
            const username = user.email;
            const userExists = await getUserByUserName(username);
            if (userExists) {
                resData.index = index;
                resData.message = `${user.email} already exists!`;
                resList.push(resData);
                continue;
            }

            const userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.email,
                role: user.role,
                password: await encryptPassword("abc123"),
            };

            const newUser = await createUser(userData);
            resData.index = index;
            resData.message = `${newUser.email} Create Done! id:${newUser._id}`;
            resList.push(resData);
        } catch (error) {
            resData.index = index;
            resData.message = `${user.email} have ${error.message}`;
            resList.push(resData);
        }
    }
    return resList;
}

async function handleLoginGG(_email) {
    if (!_email) {
        throw new ApiError(404, "User not found");
    }
    const user = await getUserByEmail(_email);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const userObj = user.toObject();
    delete userObj.password;
    var token = await createSendToken(userObj);
    if (user.email) {
        await RabbitMQ_notifyReceiver(
            userObj._id,
            user.email,
            send_Link_Mail_Login_Success(user.firstName, user.lastName),
            "Email sender",
            "Kindergarten.com"
        );
    }
    return {userObj, token};
}

async function handleSendLinkMail(email) {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const userObj = user.toObject();
    delete userObj.password;
    const token = await createSendToken(userObj, "5m");
    const link = `${config.CLIENT_URL}/reset-password/${token}`;
    await RabbitMQ_notifyReceiver(
        user._id,
        email,
        send_Link_Mail(email, link),
        "Password Reset",
        "Kindergarten.com"
    );
    return {userObj, token};
}

const getUserById = async (userId) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }

    return user;
};

async function handleInitAdminAccount() {
    const adminData = {
        firstName: "Admin",
        lastName: "Admin",
        username: "admin@gmail.com",
        password: "admin@gmail.com",
        type: "email",
        role: "ADMIN",
    };
    try {
        await handleRegister(
            adminData.firstName,
            adminData.lastName,
            adminData.username,
            adminData.type,
            adminData.password,
            adminData.role
        );
        console.log("Creating admin account successfully!!!");
    } catch (error) {
        console.log("Creating admin account failed: ", error.message);
    }
}

async function handleRegister(
    _firstName,
    _lastName,
    _username,
    _type,
    _password,
    role = "USER"
) {
    const userExists = await getUserByUserName(_username);
    if (userExists) {
        throw new ApiError(400, "User already exists!");
    }

    const userData = {
        firstName: _firstName,
        lastName: _lastName,
        username: _username,
        password: await encryptPassword(_password),
        role: role,
    };

    if (_type === "email") {
        userData.email = _username;
    } else if (_type === "phone") {
        userData.phone = _username;
    }

    const user = await createUser(userData);

    //ybhde160208@gmail.com
    if (_type === "email") {
        await RabbitMQ_notifyReceiver(
            user._id,
            user.email,
            send_Link_Mail_Register_Success(user.firstName, user.lastName),
            "Email sender",
            "Kindergarten.com"
        );
    }
}

export default {
    handleLogin,
    handleLoginGG,
    handleSendLinkMail,
    handleRegister,
    handleInitAdminAccount,
    getUserById,
};
