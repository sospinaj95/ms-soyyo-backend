const { STATUS_ERROR_CODES, ERROR_DESC } = require('../shared/errors-selector');

class BaseError extends Error {
  constructor (error, statusCode) {
    super(JSON.stringify(error));
    error = error || ERROR_DESC[statusCode];
    const resultCode = error.resultCode || error;
    this.data =
      error instanceof Object ? error : { resultCode: error, resultMsg: error };
    this.statusCode = statusCode || STATUS_ERROR_CODES[resultCode] || 400;
  }
}

class BadRequest extends Error {
  constructor (error) {
    super(JSON.stringify(error));

    this.data = error;
    this.statusCode = 400;
  }
}

class DefaultPcoError extends Error {
  constructor (error) {
    super(JSON.stringify(error));

    this.data = error;
    this.statusCode = 461;
  }
}

class UnauthorizedError extends Error {
  constructor (error) {
    super(JSON.stringify(error));
    this.data = error;
    this.statusCode = 401;
  }
}

class UnprocessableEntityError extends Error {
  constructor (error) {
    super(JSON.stringify(error));
    this.data = error;
    this.statusCode = 422;
  }
}
class NotFoundError extends Error {
  constructor (error) {
    super(JSON.stringify(error));
    this.data = error;
    this.statusCode = 404;
  }
}
class GoneError extends Error {
  constructor (error) {
    super(JSON.stringify(error));
    this.data = error;
    this.statusCode = 410;
  }
}

module.exports = {
  BaseError,
  BadRequest,
  DefaultPcoError,
  UnauthorizedError,
  UnprocessableEntityError,
  NotFoundError,
  GoneError
};
