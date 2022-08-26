const { STATUS_ERROR_CODES, ERROR_DESC } = require('../../shared/errors-selector');
// eslint-disable-next-line no-unused-vars
exports.errorHandler = (error, req, res, next) => {
  if (error) {
      console.error("Info Warning: ", JSON.stringify(error));
      error.statusCode = error.statusCode || STATUS_ERROR_CODES.BAD_REQUEST;
      error.data = error.data || { resultCode: ERROR_DESC[error.statusCode], resultMsg: error.message };
      return res.status(error.statusCode).json(error.data);    
    }
};
