import { User } from "../database/index.js";
import { ApiError, encryptPassword } from "../utils/index.js";
import config from "../config/config.js";
import authBusiness from "../business/authBusiness.js";
import userBusiness from "../business/userBusiness.js";

const register = async (req, res) => {
  try {
    const { firstName, lastName, password, type, username } = req.body;
    if (!firstName || !lastName || !password || !type || !username) {
      throw new ApiError(400, "All fields are required");
    }
    await authBusiness.handleRegister(
      firstName,
      lastName,
      username,
      type,
      password
    );
    return res.json({
      status: 200,
      message: "User registered successfully!",
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const { userObj, token } = await authBusiness.handleLogin(
      username,
      password
    );
    return res.json({
      status: 200,
      message: "Login successfully!",
      data: userObj,
      token,
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message,
    });
  }
};

async function logout(req, res, next) {
  req.session.user = null;
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(`${config.CLIENT_URL}`);
  });
}

async function loginWithGG(req, res, next) {
  try {
    if (!req.user) {
      throw new ApiError(404, "User not found");
    }
    if (req.user.role === "BLOCK") {
      req.logout(function (err) {
        if (err) {
          next();
        }
      });
      throw new ApiError(400, "User is block");
    }
    const { userObj, token } = await authBusiness.handleLoginGG(req.user.email);
    req.session.user = userObj;
    req.logout(function (err) {
      if (err) {
        next();
      }
    });
    res.json({
      status: 200,
      message: "User logged in successfully!",
      data: userObj,
      token,
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message,
    });
  }
}

const createListUsers = async (req, res) => {
  const users = req.body;

  if (!users) {
    throw new ApiError(400, "Bad request");
  }
  const resList = [];
  for (let index = 0; index < users.length; index++) {
    var user = users[index];
    const resData = {};
    try {
      const username = user.email;
      const userExists = await User.findOne({ username });
      if (userExists) {
        resData.index = index;
        resData.username = user.email;
        resData.isCreated = false;
        resData.firstName = user.firstName;
        resData.lastName = user.lastName;
        resData.role = user.role;
        resData.message = `Already exists`;
        resList.push(resData);
        continue;
      }

      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.email,
        role: user.role,
        password: await encryptPassword(user.password || "abc123"),
      };

      const newUser = await User.create(userData);
      resData.index = index;
      resData.username = newUser.username;
      resData.isCreated = true;
      resData._id = newUser?._id || "";
      resData.firstName = newUser.firstName;
      resData.lastName = newUser.lastName;
      resData.role = newUser.role;
      resData.message = `Create Done`;
      resList.push(resData);
    } catch (error) {
      resData.index = index;
      resData.username = user?.email || "";
      resData.isCreated = false;
      resData.firstName = user?.firstName;
      resData.lastName = user?.lastName;
      resData.role = user?.role;
      resData.message = `${error.message}`;
      resList.push(resData);
    }
  }

  return res.json({
    status: 200,
    message: "UserList registered successfully!",
    data: resList,
  });
};
const sendLinkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const { userObj, token } = await authBusiness.handleSendLinkMail(email);
    return res.json({
      status: 200,
      message: "User logged in successfully!",
      data: userObj,
      token,
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const user = req.user;
    if (!newPassword || !confirmPassword) {
      if (newPassword !== confirmPassword) {
        res.json({
          status: 400,
          message: "Invalid password",
        });
      }
    }
    const { updatedUser } = await userBusiness.handleUpdatePassword(
      user,
      newPassword,
      confirmPassword
    );
    return res.json({
      status: 200,
      message: "Password updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    return res.json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
};
export default {
  register,
  login,
  createListUsers,
  sendLinkEmail,
  updatePassword,
  loginWithGG,
  logout,
};
