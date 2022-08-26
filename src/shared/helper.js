const bcrypt = require('bcrypt');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/environments/' + env);
const fs = require('fs');
const xl = require('excel4node');
const uuidv4 = require('uuid').v4;
const lodash = require("lodash");

/** Class representing a Helper. */
class Helper {
  /**
   * Build response fail service.
   * @param {string} message - error message .
   * @return {object} data response fail service.
   */
  static buildFailureResponse (message) {
    return {
      resultMsg: message,
      resultCode: '400',
      success: 'false',
    };
  }

  /**
 * Format contact info to PCO standar
 * @param {Object} contactInfo data of contact
 * @param {Boolean} maskInfo flag for mask data of contact
 * @returns
 */
  static formatContactInfo (contactInfo, maskInfo = false){
    const contactInformation = [];
    contactInfo.forEach((data) => {
      if (data.mobilePhoneNo) {
        contactInformation.push({
          type: "phone",
          value: data.mobilePhoneNo.trim(),
        });
      }
      if (data.email && validateCorrectEmail(data.email)) {
        contactInformation.push({
          type: "email",
          value: data.email.trim(),
        });
      }
    });
    if (contactInformation.length === 0) {
      contactInfo.forEach((data) => {
        if(data && data.value) contactInformation.push({ type: data.type, value: data.value })
      });
    }
    return lodash.uniqWith(contactInformation, lodash.isEqual);
  };

  /**
   * Build options for consume services request http.
   * @return {JSON} data options.
   */
  static buildOptions () {
    return {
      url: '',
      headers: {
        'content-type': 'application/json',
      },
      method: '',
    };
  }

  /**
   * Build response Message of Unauthorized.
   * @return {object}Message of Unauthorized.
   */
  static UnauthorizedResponse () {
    return {
      resultCode: 'Unauthorized',
      resultMsg: 'Unauthorized',
    };
  }

  /**
   * Generate hash value.
   * @param {string} data - data to convert hash.
   * @return {string} value hash.
   */
  static async GenerateHash (data) {
    let password = data.toString();
    return new Promise(function (resolve, reject) {
      bcrypt.hash(password, 10, function (err, hash) {
        if (!err) {
          resolve(hash);
        } else reject(err);
      });
    });
  }

  /**
   * Compare if data correspond to hash.
   * @param {string} hash - data hash.
   * @param {string} data - data to compare hash.
   * @return {bool} result compare hash.
   */
  static async CompareHash (hash, data) {
    return new Promise(function (resolve, reject) {
      bcrypt.compare(data, hash, function (err, res) {
        if (typeof res === 'boolean') {
          resolve(res);
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * Generate request for save item in dyanmo.
   * @param {object} item - item dynamo.
   * @return {object} request for save item in dyanmo.
   */
  static BuildUrlDynamoSave (item) {
    const table = config.AppSettings.dynamoSettings.tableCodes;
    return {
      TableName: table,
      Item: item,
    };
  }

  /**
   * Build request for get item in dyanmo.
   * @param {String} documentType - data document type.
   * @param {String} documentNumber - data document Number.
   * @param {String} table - name table in Dynamo.
   * @return {object} data item Dynamo.
   */
  static BuildUrlDynamoGet (documentType, documentNumber, table) {
    return {
      TableName: table,
      Key: {
        Key: documentType + '-' + documentNumber,
      },
    };
  }

  /**
   * Build certificates for consume services of other apis.
   * @return {object} data certificates.
   */
  static BuildCertificate () {
    const path = `${process.cwd()}\\src\\config\\cert\\pco360View-P384UAT_key.p12`;
    return {
      pfx: fs.readFileSync(path),
      passphrase: config.AppSettings.RsaKeySettings.passphrase,
    };
  }

  /**
   * Build headers with beares value.
   * @param {String} bearer - bearer value.
   * @return {object} data headers with beares value.
   */
  static BuilHeaderBearer (bearer) {
    return {
      Authorization: 'Bearer ' + bearer,
    };
  }

  /**
   * Build headers with channel value.
   * @return {object} data headers with channel value.
   */
  static BuildHeaderChanel () {
    return {
      'content-type': 'application/json',
      'CA-Channel': 'W',
    };
  }

  /**
   * Create .xlsx file for report transactions with excel4node library.
   * @param {object} data - report transactions.
   * @return {Buffer} buffer file .xlsx or null.
   */
  static async CreateFileXlsx (data) {
    if (data && data.RegistrosTabla) {
      let sheetName = new Date()
        .toISOString()
        .slice(-24)
        .replace(/\D/g, '')
        .slice(0, 14);
      var wb = new xl.Workbook();
      var ws = wb.addWorksheet('Transaciones_' + sheetName);

      let headersTables = 7;

      var styleTitles = wb.createStyle({
        font: {
          bold: true,
        },
      });

      let containsCardField = data.RegistrosTabla.some(function (item) {
        return item.bin != null && item.bin != '';
      });

      this.SetCellExcelFile(
        ws,
        1,
        1,
        data.NombreCuenta.toUpperCase(),
        styleTitles
      );
      this.SetCellExcelFile(ws, 2, 1, 'Fecha', styleTitles);
      this.SetCellExcelFile(
        ws,
        2,
        2,
        new Date().toLocaleDateString(),
        styleTitles
      );
      let typeDocument =
        data.TipoDocumento == '2'
          ? 'Cédula'
          : data.TipoDocumento == '5'
            ? 'NIT'
            : data.TipoDocumento == '4'
              ? 'Pasaporte'
              : data.TipoDocumento == '3'
                ? 'Cédula de extranjería'
                : '';
      this.SetCellExcelFile(ws, 3, 1, typeDocument, styleTitles);
      this.SetCellExcelFile(ws, 4, 1, data.NumeroDocumento, styleTitles);
      this.SetCellExcelFile(ws, 5, 1, 'Información desde', styleTitles);
      this.SetCellExcelFile(ws, 5, 2, data.FechaInicial, {});
      this.SetCellExcelFile(ws, 5, 3, 'Hasta', styleTitles);
      this.SetCellExcelFile(ws, 5, 4, data.FechaFinal, {});
      this.SetCellExcelFile(ws, headersTables, 1, 'Fecha', styleTitles);
      this.SetCellExcelFile(ws, headersTables, 2, 'Información', styleTitles);
      this.SetCellExcelFile(ws, headersTables, 3, 'Detalle', styleTitles);
      if (containsCardField) {
        this.SetCellExcelFile(ws, headersTables, 4, 'Tarjeta', styleTitles);
        this.SetCellExcelFile(
          ws,
          headersTables,
          5,
          'Tipo de Transacción',
          styleTitles
        );
        this.SetCellExcelFile(
          ws,
          headersTables,
          6,
          'No. de Transacción',
          styleTitles
        );
        this.SetCellExcelFile(ws, headersTables, 7, 'Puntos', styleTitles);
      } else {
        this.SetCellExcelFile(
          ws,
          headersTables,
          4,
          'Tipo de Transacción',
          styleTitles
        );
        this.SetCellExcelFile(
          ws,
          headersTables,
          5,
          'No. de Transacción',
          styleTitles
        );
        this.SetCellExcelFile(ws, headersTables, 6, 'Puntos', styleTitles);
      }
      let rowReportData = 8;
      data.RegistrosTabla.forEach((trx) => {
        this.SetCellExcelFile(ws, rowReportData, 1, trx.date.toString(), {});
        this.SetCellExcelFile(ws, rowReportData, 2, trx.partnerName, {});
        this.SetCellExcelFile(
          ws,
          rowReportData,
          3,
          trx.commercialDescription
            ? trx.commercialDescription
            : trx.locationName,
          {}
        );
        if (containsCardField) {
          this.SetCellExcelFile(
            ws,
            rowReportData,
            4,
            trx.bin ? 'XXXXXXX' + trx.bin.toString() : '',
            {}
          );
          this.SetCellExcelFile(ws, rowReportData, 5, trx.transactionType, {});
          this.SetCellExcelFile(ws, rowReportData, 6, trx.id.toString(), {});
          this.SetCellExcelFile(
            ws,
            rowReportData,
            7,
            trx.points.toString(),
            {}
          );
        } else {
          this.SetCellExcelFile(ws, rowReportData, 4, trx.transactionType, {});
          this.SetCellExcelFile(ws, rowReportData, 5, trx.id.toString(), {});
          this.SetCellExcelFile(
            ws,
            rowReportData,
            6,
            trx.points.toString(),
            {}
          );
        }

        rowReportData++;
      });

      return wb.writeToBuffer();
    } else {
      return null;
    }
  }

  /**
   * Set value and style in .xlsx file.
   * @param {WorksheetObject} ws - Work sheet object of excel4node library.
   * @param {int} x - coordinate x.
   * @param {int} y - coordinate y.
   * @param {string} y - data value.
   * @param {object} style - values of styles.
   */
  static SetCellExcelFile (ws, x, y, data, style) {
    ws.cell(x, y)
      .string(data ? data : '')
      .style(style);
  }

  /**
   * Generate account object.
   * @param {object} data - data about accounts.
   * @return {object} account object.
   */
  static ToMapAccounts (data) {
    let addressData = this.ToMap(data.addresses, AddressWithIdEntity);
    let attributesData = this.ToMap(data.attributes, AttributesEntity);
    let partnerData = this.ToMap(data.partners, PartnerEntity);

    return {
      addresses: addressData || null,
      documentNo: data.documentNo || null,
      documentType: data.documentType || null,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      birthDate:
        data.birthDate && data.birthDate != 'null' ? data.birthDate : null,
      civilStatus: data.civilStatus || null,
      occupation: data.occupation || null,
      gender: data.gender || null,
      habeasData: data.habeasData != null ? data.habeasData.toString() : null,
      habeasDataDate: data.habeasDataDate || null,
      habeasDataChannel: data.habeasDataChannel || null,
      permissionEmail:
        data.permissionEmail != null ? data.permissionEmail.toString() : null,
      permissionSMS:
        data.permissionSMS != null ? data.permissionSMS.toString() : null,
      permissionDirectMail:
        data.permissionDirectMail != null
          ? data.permissionDirectMail.toString()
          : null,
      permissionPhone:
        data.permissionPhone != null ? data.permissionPhone.toString() : null,
      permissionPush:
        data.permissionPush != null ? data.permissionPush.toString() : null,
      permissionInfo:
        data.permissionInfo != null ? data.permissionInfo.toString() : null,
      permissionAdverts:
        data.permissionAdverts != null
          ? data.permissionAdverts.toString()
          : null,
      childrenNumber: data.childrenNumber
        ? data.childrenNumber.toString()
        : '0',
      nationality: data.nationality || null,
      identifiers: data.identifiers || null,
      mainAddressId: data.mainAddressId || null,
      attributes: attributesData,
      partners: partnerData,
      terms: data.terms != null ? data.terms.toString() : null,
      migratedPoints: data.migratedPoints || null,
      referredByCustomerId:
        data.referredByCustomerId != null
          ? data.referredByCustomerId.toString()
          : null,
      redemptionEnabled:
        data.redemptionEnabled != null
          ? data.redemptionEnabled.toString()
          : null,
    };
  }

  /**
   * Generate array of entity object.
   * @param {object} data - data about entity.
   * @param {object} entity - entity to map.
   * @return {array} array of entity object.
   */
  static ToMap (data, entity) {
    let response = [];
    if (data && data.length > 0) {
      data.forEach((addr) => {
        let element = new entity(addr);
        response.push(element);
      });
    } else {
      response = null;
    }
    return response;
  }

  /**
   * Generate Transactions object.
   * @param {object} data - data to map.
   * @param {object} entity - entity to map.
   * @return {array} array of Transactions object.
   */
  static ToMapTransactions (data, entity) {
    let response = [];
    if (data && data.length > 0) {
      data.forEach((addr) => {
        let element = new entity(addr);
        element.paymentMethod = addr.paymentMethod
          ? new PaymentMethod(addr.paymentMethod)
          : null;
        element.referredAccount = addr.referredAccount
          ? new ReferredAccount(addr.referredAccount)
          : null;
        if (addr.attributes) {
          element.attributes = addr.attributes ? addr.attributes : null;
        }
        response.push(element);
      });
    } else {
      response = null;
    }
    return response;
  }

  static ToMapAuditInfo (data, auditInfoEntity, attributeEntity) {
    let response = [];
    if (data && data.length > 0) {
      data.forEach((auditInf) => {
        let auditInfo = new auditInfoEntity(auditInf);
        auditInfo.attributes = [];
        auditInf.attributes.forEach((att) => {
          let attribute = new attributeEntity(att);
          auditInfo.attributes.push(attribute);
        });
        response.push(auditInfo);
      });
    } else {
      response = null;
    }
    return response;
  }

  /**
   * Build headers to endpoint MemberStatus.
   * @param {object} headersMember - data to member.
   * @param {object} config - appSettings.
   * @return {object} headers to endpoint MemberStatus.
   */
  static BuildHeadersMemberStatus (headersMember, config) {
    return {
      Authorization: headersMember.authorization,
      'CA-Channel': config.channel,
      'CA-Request-Id': uuidv4(),
      'CA-Partner': 'RWO',
    };
  }

  /**
   * Validate if string has estructure of json.
   * @param {strin} str - data to validate.
   * @return {object} data convert json or string validate.
   */
  static isJsonString (str) {
    let response;
    try {
      response = JSON.parse(str);
    } catch (e) {
      response = str;
    }
    return response;
  }

  /**
   * Validate if string is number.
   * @param {strin} str - data to validate.
   * @return {object} return true if the string is number.
   */
  static isNumber (str) {
    return (str.match(/^[0-9]+$/) == null) ? false : true;
  }

  /**
   * Validate if string has special chracters.
   * @param {strin} str - data to validate.
   * @return {object} return true if the string is number.
   */
  static hasSpecialCharacters (str) {
    return str.match(/^[A-Za-z0-9]*$/) ? false : true;
  }

  static BuildHeadersChanel (headersReq, chanel) {
    return {
      'content-type': 'application/json',
      Authorization: headersReq.authorization
        ? headersReq.authorization
        : headersReq.Authorization,
      'CA-Channel': chanel,
    };
  }

  static getHeaders (data) {
    let dataHeaders = [];
    if (data) {
      for (var key in data) {
        let header = {
          name: key,
          value: data[key],
        };
        dataHeaders.push(header);
      }
    }

    return dataHeaders;
  }


  static convertObjectContentFul (obj) {
    if (!obj.fields) {
      return obj;
    }
    const result = {};

    for (const key of Object.keys(obj.fields)) {
      let field = obj.fields[key];

      if (Array.isArray(field)) {
        result[key] = field.map((val) => this.convertObjectContentFul(val));
      } else {
        result[key] = this.convertObjectContentFul(field);
      }
    }
    return result;
  }

  static isValidDateAndFormatDDMMYYYY (date) {
    let isValid = false;

    try {
      if (!date) {
        return false;
      }
      date = date.split('/');
      const [day, month, year] = date;
      if (!year || year.length !== 4) {
        return false;
      }
      const newDate = new Date(year, month - 1, day);
      if (newDate.getFullYear() === parseInt(year) && newDate.getMonth() === parseInt(month) - 1 && newDate.getDate() === parseInt(day)) {
        isValid = true;
      }

      // eslint-disable-next-line no-empty
    } catch { }

    return isValid;

  }

  static convertDateYYYYMMDDToDDMMYYYY (date, separator = '/') {
    date = date.replace('/', '-');
    if (!this.isValidDate(date)) {
      throw new Error('the date is invalid, only accept date in format yyyy-mm-dd');
    }

    const newDate = date.split('-').reverse().join(separator);

    return newDate;
  }

  /**
 *
 * @param {string} date yyyy-mm-dd
 * @returns
 */
  static isValidDate (date) {
    if (!/^\d\d\d\d-\d\d-\d\d$/.test(date)) {
      return false;
    }
    const dateArray = date.split('-');
    const day = Number(dateArray[2]);
    const month = Number(dateArray[1]) - 1;
    const year = Number(dateArray[0]);

    const d = new Date(year, month, day);

    const yearMatches = d.getUTCFullYear() === year;
    const monthMatches = d.getUTCMonth() === month;
    const dayMatches = d.getUTCDate() === day;

    return yearMatches && monthMatches && dayMatches;
  }

  /**
   * @example:
    const test = 'Álvarez ';
    const additionalChars = [{ text: 'DC', newText: '' }];
    const result = Helper.removeAccents(test, additionalChars);
   * @param { string } str
   * @param { array } additionalChars example: const additionalChars = [{ text: 'DC', newText: '' }];
   * @returns string
   */
  static removeAccents (str, additionalChars = null) {
    str = str.split(',').join('');
    str = str.split('.').join('');
    if (additionalChars && additionalChars.length > 0) {
      for (let obj of additionalChars) {
        str = str.replace(obj.text, obj.newText);
      }
    }

    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    return str;
  }


  static clone (obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}
const validateCorrectEmail = (email) => {
  // eslint-disable-next-line no-useless-escape
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,15})+$/.test(email);
};
module.exports = { Helper };