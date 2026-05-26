'use strict';

const logger = require('../logger');

class Controller {
  /**
   * Execute a service method and send the result as an HTTP response.
   * @param {object}   req      - Express request
   * @param {object}   res      - Express response
   * @param {Function} service  - Async function that returns { code, payload }
   */
  static async handleRequest(req, res, serviceCall) {
    try {
      const result = await serviceCall();
      const { code, payload } = result;

      if (code === 204) return res.status(204).send();
      return res.status(code).json(payload);
    } catch (error) {
      logger.error('Unhandled controller error:', error);
      return res.status(500).json({
        error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      });
    }
  }

  /**
   * Collect query params, path params, and body into a single params object.
   */
  static collectParams(req) {
    return {
      ...req.params,
      ...req.query,
      body: req.body,
    };
  }
}

module.exports = Controller;