/* eslint-disable no-case-declarations */
/* eslint-disable indent */
/** @module EntityService */

const ENV = process.env.NODE_ENV || 'development';
const config = require('../config/environments/' + ENV);
const EntityPath = require('./entitypath.json');
const { Helper: helper } = require('../shared/helper');
const apiBaseAdapter = require('../adapters/api-base-adapter');
const {
  BaseError
} = require('../entities/error-entity');
const lodash = require("lodash");

/**
 * Entity Filter.
 * @param {object} member - startId, endId of member.
 * @return {Promise<object>} data status of member.
 */
const entityFilterService = async (member) => {
  member.startId = parseInt(member.startId);
  member.endId = parseInt(member.endId)+1;
  let listEntityId = lodash.range(member.startId, member.endId); 
  let promises = []  // Empty array
  let result = {data:[]};
  let resultpromises = []  // Empty array
  const tOut = (entityId) => {
    return new Promise(async (resolve) => {
      let setUrl = EntityPath.GetEntityData.Url.replace('${entityId}',entityId);
      let url = config.AppSettings.parameters_config.apiBaseUri + setUrl;
      const resp = await apiBaseAdapter.consumeService(
        helper.buildOptions(),
        url,
        'GET',
        null
      );
      let result = JSON.parse(resp.body);
      if (result.code == 'F132') {
        resultpromises.push(result.data);
      }
      return resolve(true);
    })
  }

  listEntityId.map((entityId) => {
    promises.push(tOut(entityId))
  });
  await Promise.all(promises);
  resultpromises = lodash.orderBy(resultpromises, ['name',],['asc']);
  return result.data = resultpromises;
};

module.exports = {
  entityFilterService
};
