import passport from "passport";
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const VKontakteStrategy = require("passport-vkontakte").Strategy;
import User from "../models/users";

//Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//Deserialize user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { error: "Incorrect Username" });
        user.comparePassword(password, (err, isMatch) => {
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { error: "Incorrect password." });
          }
        });
      });
    }
  )
);

module.exports = passport;
