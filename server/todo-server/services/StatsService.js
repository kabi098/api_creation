'use strict';

const Service     = require('./Service');
const TodosService = require('./TodosService');

class StatsService {
  static async getStats() {
    try {
      // Re-use TodosService store via full list (no filter)
      const result = await TodosService.listTodos({ limit: 10000 });
      const todos  = result.payload.data || [];

      const total     = todos.length;
      const completed = todos.filter((t) => t.completed).length;
      const active    = total - completed;

      const byPriority = { high: 0, medium: 0, low: 0 };
      todos.forEach((t) => { if (byPriority[t.priority] !== undefined) byPriority[t.priority]++; });

      return Service.successResponse({
        data: {
          total,
          active,
          completed,
          completionRate: total ? parseFloat(((completed / total) * 100).toFixed(1)) : 0,
          byPriority,
        },
      });
    } catch (e) {
      return Service.rejectResponse(e.message);
    }
  }
}

module.exports = StatsService;