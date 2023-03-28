// const jwt = require("jsonwebtoken");
// const db = require("../models")
// const User = db.User


// exports.sendToken = (user, req, res, statuscode) => {
//     const token = User.gettoken();

//     res.cookie("token", token, {
//         expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
//         // expires: new Date(Date.now() + 20*1000),
//         httpOnly: true,
//         // secure: true
//     });
//     user.password = undefined;
//     res.json({ message: "user logged in", User });
// };

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
  
    const options = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  };
  
  module.exports = sendToken;