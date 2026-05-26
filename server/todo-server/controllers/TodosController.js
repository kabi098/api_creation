'use strict';

const Controller   = require('./Controller');
const TodosService = require('../services/TodosService');

class TodosController {

  /** GET /todos */
  static async listTodos(req, res) {
    await Controller.handleRequest(req, res, () =>
      TodosService.listTodos(Controller.collectParams(req))
    );
  }

  /** POST /todos */
  static async createTodo(req, res) {
    await Controller.handleRequest(req, res, () =>
      TodosService.createTodo(Controller.collectParams(req))
    );
  }

  /** GET /todos/:id */
  static async getTodo(req, res) {
    await Controller.handleRequest(req, res, () =>
      TodosService.getTodo(Controller.collectParams(req))
    );
  }

  /** PUT /todos/:id */
  static async replaceTodo(req, res) {
    await Controller.handleRequest(req, res, () =>
      TodosService.replaceTodo(Controller.collectParams(req))
    );
  }

  /** PATCH /todos/:id */
  static async patchTodo(req, res) {
    await Controller.handleRequest(req, res, () =>
      TodosService.patchTodo(Controller.collectParams(req))
    );
  }

  /** DELETE /todos/:id */
  static async deleteTodo(req, res) {
    await Controller.handleRequest(req, res, () =>
      TodosService.deleteTodo(Controller.collectParams(req))
    );
  }

  /** POST /todos/bulk */
  static async bulkTodos(req, res) {
    await Controller.handleRequest(req, res, () =>
      TodosService.bulkTodos(Controller.collectParams(req))
    );
  }
}

module.exports = TodosController;