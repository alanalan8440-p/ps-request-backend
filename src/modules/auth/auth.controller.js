const authService = require("./auth.service");

exports.studentLogin = async (req, res, next) => {
  try {
    const result = await authService.studentLogin(req.body);

    res.status(200).json({
      status: "success",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.changeStudentPassword = async (req, res, next) => {
  try {
    const result = await authService.changeStudentPassword(
      req.user.id,
      req.body
    );

    res.status(200).json({
      status: "success",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
