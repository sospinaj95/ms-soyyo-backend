const contentful = require('contentful');
const config = require('../../package.json').config || {};

const client = contentful.createClient({
  accessToken: config.deliveryApiKey,
  space: config.spaceid,
});

exports.client = client;
