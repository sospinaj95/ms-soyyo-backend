/** @module ApiBaseAdapter */

const request = require('request');

/**
 * Validate if OTP code is validet for User.
 * @param {json} headers - data headers request.
 * @param {string} url - Url of the endpoint to consume.
 * @param {string} method - request Http.
 * @param {json} body - request of endpoint.
 * @param {json} form - request of endpoint type form-data.
 * @param {json} agentOptions - data about certificates.
 * @param {bool} isXml - flag to request of xml endpoint.
 * @return {Promise<json>} data response endpoints of diferents Apis.
 */
const consumeService = async (
  headers,
  url,
  method,
  body,
  form,
  agentOptions,
  isXml
) => {
  var options = {};
  options.url = url;
  options.headers = headers;
  options.method = method;
  if (form) options.form = form;
  if (body) options.body = JSON.stringify(body);
  if (isXml) options.body = body;
  if (agentOptions) options.agentOptions = agentOptions;
  return new Promise(function (resolve, reject) {
    request(options, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

module.exports = { consumeService };
