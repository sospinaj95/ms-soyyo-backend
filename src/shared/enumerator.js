const MESSAGES = Object.freeze({
  BAD_REQUEST: {
    resultCode: 'BAD_REQUEST',
    resultMsg: 'Not valid data',
  },
  UNAUTHORIZED: 'UNAUTHORIZED',
  ERROR_INVALID_DATA: 'INVALID_DATA',
  ERROR_API_INALAMBRIA: 'Internal Error in Api Inalambria',
  ERROR_NULL_REFERENCE: 'NULL_REFERENCE_MAIN_OBJECT',
  ERROR_NO_INPUT_DATA: 'No input data found',
  ERROR_EMPTY_VALUE: 'EMPTY_VALUE_REQUEST',
  ERRRO_USER_NOT_EXIST: 'Customer with the provided identifier does not exist',
  ERROR_ALREADY_ACTIVE: 'Customer was already activated.',
  ERRO_UNAUTHORIZED: 'Unauthorized',
  ERROR_USER_NOT_FOUND: 'CUSTOMER_NOT_FOUND',
  DEFAULT_ERROR: {
    resultCode: 'INTERNAL_ERROR',
    ResultMsg: 'Something went wrong. Please try again.',
  },
});

const STATUS_CODE = Object.freeze({
  OK: 200,
  BAD: 400,
  NOTFOUND: 404,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
  NO_CONTENT: 204,
});

const MESSAGE_TYPE = Object.freeze({
  Massive: 1,
  Personalized: 2,
  Template: 3,
});

const OTP_TRANSUNION_CONSTANTS = Object.freeze({
  DCResponse: 'DCResponse',
  Decision: 'Decision',
  ApplicationData: 'ApplicationData',
  Reason: 'Reason',
  IDMReasonCodes: 'IDMReasonCodes',
  IDVReasonsCode: 'IDVReasonsCode',
  VelocityCheckReason: 'VelocityCheckReason',
  IDMOutcome: 'IDMOutcome',
  OTPReasons: 'OTPReasons',
  InputValReasonCodes: 'InputValReasonCodes',
  HasError: 'HasError',
  MobilePhoneList: 'MobilePhoneList',
  LandLineList: 'LandLineList',
  ContextData: 'ContextData',
  ResponseInfo: 'ResponseInfo',
  Status: 'Status',
  Authentication: 'Authentication',
  ApplicationId: 'ApplicationId',
  CurrentQueue: 'CurrentQueue',
  OTPCode: 'OTPCode',
  Delay: 'Delay',
  Success: 'Success',
  PasswordHasExpired: 'PasswordHasExpired',
  PinVerification_OTPInput: 'PinVerification_OTPInput',
  ShowExam: 'ShowExam',
  Pass: 'Pass',
  Fail: 'Fail',
  ErrorInfo: 'ErrorInfo',
  Send: 'Send',
  Continue: 'Continue',
  MessageSolutionSetId: '\'SolutionSetId\' no proporcionado',
  MessageSolutionSetVersion: '\'SolutionSetVersion\' no proporcionado',
  MessageIdType: '\'IdType\' no proporcionado',
  MessageIdNumber: '\'IdNumber\' no proporcionado',
  MessageResendPhoneNumber: '\'ResendPhoneNumber\' no proporcionado',
  MessageValidationMethod: '\'ValidationMethod\' no proporcionado',
  MessageApplicantId: '\'ApplicantId\' no proporcionado',
  MessagePinNumber: '\'PinNumber\' no proporcionado',
  RecentPhoneNumber: '\'RecentPhoneNumber\' no proporcionado',
  IdentityValidateCodePass: '300',
  IdentityValidateTypePass: 'Aprueba OTP',
  IdentityValidateDescriptionPass: 'Identidad validada exitosamente - pass',
  IdentityValidateCodeFail: '302',
  IdentityValidateTypeFail: 'OTP Fallo',
  IdentityValidateDescriptionFail:
    'Validación fallida debido a código incorrecto. - Fail',
  DefaultError: 'Error 500 - Internal Server Error'


});

const HEADERS_NAME = Object.freeze({
  CA_REQUEST_ID: "ca-request-id",
  CA_CHANNEL: "ca-channel",
  CA_PARTNER: "ca-partner",
  CA_REQUEST_IP: "ca-request-ip",
});

module.exports = {
  MESSAGES,
  STATUS_CODE,
  MESSAGE_TYPE,
  OTP_TRANSUNION_CONSTANTS,
  HEADERS_NAME
};
