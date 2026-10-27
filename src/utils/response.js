const sendSuccess = (res, statusCode = 200, data = null, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

sendSuccess.sendSuccess = sendSuccess;
module.exports = sendSuccess;
