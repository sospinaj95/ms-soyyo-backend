const entityService = require('../services/entity-service');
const STATUS_CODE = require('../shared/enumerator').STATUS_CODE;

const entityFilter = async (req, res, next) => {
  let member = {
    startId: req.body.startId,
    endId: req.body.endId,
  };
  console.log(member);
  let result;
  try {
    result = await entityService.entityFilterService(member);
  } catch (error) {
    next(error);
  }
  return res.status(200).json(result);

};



module.exports = {
  entityFilter
};
