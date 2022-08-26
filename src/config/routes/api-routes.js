'use strict';
const express = require('express');
const entityController = require('../../controllers/entity-controller');
const swaggerui = require('swagger-ui-express');
const swaggeDocument = require('../api-doc/swagger.json');
const {
  validateBodyQueryRequest,
} = require('../middleware/validate-request-middleware');

const initAPIRoutes = () => {
  const router = express.Router();
  router.use('/documentation', swaggerui.serve);
  router.get('/documentation', swaggerui.setup(swaggeDocument));
  router.post(
    '/filter',
    validateBodyQueryRequest,
    entityController.entityFilter
  );
  return router;
};
module.exports = { initAPIRoutes };
