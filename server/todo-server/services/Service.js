'use strict';

/**
 * Base Service — wraps responses in a standard shape.
 * { code, payload }  where code is an HTTP status integer.
 */
class Service {
  /**
   * Build a success response object.
   * @param {*}      payload  - Data to return
   * @param {number} code     - HTTP status code (default 200)
   */
  static successResponse(payload, code = 200) {
    return { code, payload };
  }

  /**
   * Build an error response object.
   * @param {string} message - Human-readable error message
   * @param {number} code    - HTTP status code (default 500)
   * @param {string} errorCode - Machine-readable error code
   */
  static rejectResponse(message, code = 500, errorCode = 'INTERNAL_ERROR') {
    return {
      code,
      payload: {
        error: {
          code: errorCode,
          message,
        },
      },
    };
  }
}

module.exports = Service;