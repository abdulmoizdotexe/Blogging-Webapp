const { checkToken } = require("../services/auth.js");

function checkValidation(cookieName) {
  return (req, res, next) => {
    const cookie = req.cookies[cookieName];
    if (!cookie) {
      return next();
    }
    try {
      const userPayload = checkToken(cookie);
      req.user = userPayload;
    } catch (error) {
      console.log(error);
    }
    return next();
  };
}

module.exports = {
  checkValidation,
};
