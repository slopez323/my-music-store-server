const jwt = require("jsonwebtoken");

const cleanUser = (user) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profilePicture: user.profilePicture,
    isAdmin: user.isAdmin,
  };
};

const getToken = (userId) => {
  return jwt.sign({ userId, iat: Date.now() }, process.env.SECRET_KEY);
};

module.exports = { cleanUser, getToken };
