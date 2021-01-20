"use strict";

import express from "express";
import createError from "http-errors";
import logger from "morgan";
import session from "express-session";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import passport from "./helpers/passport";
import expressValidator from "express-validator";
import http from "http";
import cors from 'cors';
// Load environment variables from.env file, where API keys and passwords are configured.
dotenv.config({ path: "./.env" });
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
let server = http.createServer(app);
server.listen(port, () => console.log(`App started on port: ${port}`));
server.on("connection", function (socket) {
  socket.setTimeout(600 * 60 * 1000); // now works perfectly...
});
// Mongoose options
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};
mongoose
  .connect(process.env.MONGODB_ONLINE_DB, options)
  .then(connected => console.log(`Database connection established !`))
  .catch(err =>
    console.error(
      `There was an error connecting to database, the err is ${err}`
    )
  );
// Import all routes
import auth from "./routes/auth";
app.get('/', (req, res) => res.send("Hello world!"));
//Init express session
// Helmet config
app.use(helmet());
app.use(logger("dev"));
app.use(express.json({ limit: "900mb" }));
app.use(express.urlencoded({ extended: false, limit: "900mb" }));
app.use(expressValidator());
app.use(cookieParser());

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(auth);
module.exports = app;
