const jwt = require("jsonwebtoken");

const secret = process.env.SECRET_KEY;

function setUser(UserId, email) {
  return jwt.sign(
    {
      id: UserId,
      email: email,
    },
    secret
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = { setUser, getUser };
