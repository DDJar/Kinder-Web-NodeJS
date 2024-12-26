import { User } from "../database/index.js";

async function upsert(userInfo) {
  let user = null;
  try {
    user = await User.findOne({
      email: userInfo.email,
    });
    if (!user) {
      user = await User.create(userInfo);
    }
    user.googleId = userInfo.googleId;
    user.typeRegist = userInfo.typeRegist;
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default {
  upsert,
};
