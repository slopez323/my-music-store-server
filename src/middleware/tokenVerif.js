const jwt = require("jsonwebtoken");
const { cleanUser } = require("../helpers/helpers");
const UserModel = require("../models/UserModel");

const tokenVerif = async (req, res, next) => {
  try {
    const { session_token: sessionToken } = req.cookies;

    if (!sessionToken) {
      return next();
    }

    const { userId, iat } = jwt.verify(sessionToken, process.env.SECRET_KEY);

    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return next();
    }

    req.user = cleanUser(user);

    return next();
  } catch (e) {
    next(e);
  }
};

module.exports = tokenVerif;
