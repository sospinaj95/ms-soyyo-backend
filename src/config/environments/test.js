const { resolve } = require('path');

const AppSettings = {
  parameters_config: {
    apiBaseUri: 'https://awovcw7p76.execute-api.us-east-1.amazonaws.com/dev/entity/v2.1',
  },
  port: 3010,
  rootPath: resolve(__dirname, '../../'),
  environment: 'development',
};

module.exports = { AppSettings };
