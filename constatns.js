export default {
  OK: {
    statusCode: 200,
  },
  RESET_PASSWORD: {
    statusCode: 200,
    text: 'Message for change password has been send'
  },
  CREATED: {
    statusCode: 201,
  },
  NO_CONTENT: {
    statusCode: 204,
    text: 'Password change '
  },
  BAD_REQUEST: {
    statusCode: 400,
    text: 'Incorrect data was transmitted',
  },
  UNAUTHORIZED: {
    statusCode: 401,
    text: 'Incorrect email or password'
    
  },
  FORBIDDEN: {
    statusCode: 403,
    text: 'Authorization required',
  },
  BLOCKED: {
    statusCode: 403,
    text: 'Your account has been blocked. Please contact support'
  },
  NOT_FOUND: {
    statusCode: 404,
    text: 'Not found',
  },
  NOT_FOUND_RECORDS: {
    statusCode: 404,
    text: 'Not found records for delete',
  },
  CONFLICT: {
    statusCode: 409,
    text: 'A user with this email already exists.',
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    text: 'An error occurred on the server',
  },
};
