const express = require("express");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { cleanUser, getToken } = require("../helpers/helpers");

const userRouter = express.Router();

userRouter.post("/register-user", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, profilePicture } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userDocument = new UserModel({
      firstName,
      lastName,
      email,
      hashedPassword,
      profilePicture,
    });

    await userDocument.save();

    const token = getToken(userDocument._id);

    res.cookie("session_token", token, {
      httpOnly: true,
      secure: false,
    });

    res.send({ user: cleanUser(userDocument) });
  } catch (e) {
    next(e);
  }
});

userRouter.post("/sign-in", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).send("No user found.");
    }

    const match = await bcrypt.compare(password, user.hashedPassword);

    if (!match) {
      returnres.status(401).send("Incorrect password.");
    }

    const token = getToken(user._id);

    res.cookie("session_token", token, {
      httpOnly: true,
      secure: false,
    });

    res.send({ user: cleanUser(user) });
  } catch (e) {
    next(e);
  }
});

userRouter.get("/sign-out", (req, res, next) => {
  res.clearCookie("session_token");
  res.send("Successfully signed out.");
});

userRouter.get("/check-login", async (req, res, next) => {
  try {
    if (!req.user) {
      next();
    }
    res.send({ user: req.user });
  } catch (e) {
    next(e);
  }
});

module.exports = userRouter;
