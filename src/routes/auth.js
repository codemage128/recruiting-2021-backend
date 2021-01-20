import express from 'express';
import flash from 'express-flash';
import passport from "../helpers/passport";
import crypto from "crypto";
import User from "../models/users"
const router = express.Router();
function checkIfLoggedIn(req, res, next) {
   if (req.isAuthenticated()) return res.redirect(`back`);
   else {
     next();
   }
 }

router.post("/login", async (req, res, next) => {
   passport.authenticate("local", function (err, user, info) {
      if (err) return res.json(err)
      if (!user) {
         return res.json(info)
      }
      req.logIn(user, function (err) {
         if (err) return res.json(err);
         return res.json(user);
      });
   })(req, res, next);
})

router.post("/register", async (req, res, next) => {
   try {
      let payload = {
         email: req.body.email.trim(),
         password: req.body.password.trim(),
         token: crypto.randomBytes(16).toString("hex"),
         username: req.body.username.trim().toLowerCase(),
         profilePicture:
            "https://gravatar.com/avatar/" +
            crypto
               .createHash("md5")
               .update(req.body.email)
               .digest("hex")
               .toString() +
            "?s=200" +
            "&d=retro",
         active: false,
         roleId: "user",
         firstName: "Not Specified",
         lastName: "Not Specified",
         emailsend: true,
      };
      let check = await User.findOne({ email: req.body.email });
      if (check) {
         return res.json({ error: "This email exist" });
      } else {
         let user = await User.create(payload);
         //send email using email service/
         // Type the code
         req.logIn(user, function (err) {
            if (err) return res.json(err);
            return res.json(user);
         });
      }
   } catch (e) {
      next(e);
   }
})

module.exports = router;
