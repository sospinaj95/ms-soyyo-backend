const { BadRequest } = require('../../entities/error-entity');
const { MESSAGES } = require('../../shared/enumerator');

exports.validateBodyQueryRequest = (req, res, next) => {
  const { body } = req;
  try {
    if (Object.entries(body).length > 0) {
      if (req.path.includes('filter') && req.method === 'POST') {
        if (
          // eslint-disable-next-line no-prototype-builtins
          !body.hasOwnProperty('startId') ||
          !body.startId ||
          // eslint-disable-next-line no-prototype-builtins
          !body.hasOwnProperty('endId') ||
          !body.endId ||
          
          parseInt(body.endId) < parseInt(body.startId) 

        ) {
          throw new BadRequest(MESSAGES.BAD_REQUEST);
        }
      }
      next();
    } else {
      throw new BadRequest(MESSAGES.BAD_REQUEST);
    }
  } catch (error) {
    next(error);
  }
};
