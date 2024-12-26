import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserServices from "../users.js"; // Adjust the path according to your file structure
import { User } from "../../database/index.js";
import { encryptPassword, generateRandomPassword } from "../../utils/index.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      let user = {
        googleId: profile.id,
        firstName: profile.name.familyName,
        lastName: profile.name.givenName,
        username: profile.emails ? profile.emails[0].value : "",
        email: profile.emails ? profile.emails[0].value : "",
        avatar: profile.photos ? profile.photos[0].value : null,
        typeRegist: profile.provider,
        role: "USER",
        password: await encryptPassword(generateRandomPassword(8)),
      };
      try {
        user = await UserServices.upsert(user);
      } catch (error) {
        return cb(error);
        console.log(error);
      }
      return cb(null, user);
    }
  )
);
passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (user, cb) {
  cb(null, user);
});
