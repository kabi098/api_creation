'use strict';

const Controller  = require('./Controller');
const StatsService = require('../services/StatsService');

class StatsController {

  /** GET /stats */
  static async getStats(req, res) {
    await Controller.handleRequest(req, res, () =>
      StatsService.getStats()
    );
  }
}

module.exports = StatsController;