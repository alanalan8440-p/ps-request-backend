const jwt = require("jsonwebtoken");

/*
|--------------------------------------------------------------------------
| GENERATE ACCESS TOKEN
|--------------------------------------------------------------------------
*/

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role || "STUDENT"
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d" // 1 day token validity
    }
  );
};

/*
|--------------------------------------------------------------------------
| VERIFY TOKEN
|--------------------------------------------------------------------------
*/

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
