'use strict';
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const config = require('./environments/' + ENVIRONMENT).AppSettings;
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { initAPIRoutes } = require('./routes/api-routes');
const PORT = config.port || 5000;
const { errorHandler } = require('./middleware/exception-handler-middleware');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const run = async () => {
  // app.use(helmet());
  console.log('Environment => ' + ENVIRONMENT);
  console.log('Root Path => ' + config.rootPath);
  app.use('/entity', initAPIRoutes());
  app.use(errorHandler);
  app.listen(PORT, () => {
    console.log(`NODE_ENV: ${ENVIRONMENT}`);
    console.log(`Api soyyo JS listening on port ${PORT}!`);
  });
  
};

module.exports = { run, app };
