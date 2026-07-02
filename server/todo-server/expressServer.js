'use strict';

const express   = require('express');
const cors      = require('cors');  // this connects to frontend
const morgan    = require('morgan');
const path      = require('path');
const fs        = require('fs');
const jsYaml    = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const config = require('./config');
const logger = require('./logger');

const { TodosController, StatsController } = require('./controllers');

/* ── Load OpenAPI spec ───────────────────────────────────── */
const specPath = path.join(__dirname, 'api', 'openapi.yaml');
const apiSpec  = jsYaml.load(fs.readFileSync(specPath, 'utf8'));

/* ── Create Express app ──────────────────────────────────── */
const app = express();

/* ── Global Middleware ───────────────────────────────────── */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})); // connect to frontend

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* ── Swagger UI at /api-docs ─────────────────────────────── */
app.use(
  '/kabi/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(apiSpec, {
    customSiteTitle: 'Todo API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      tryItOutEnabled: true,
    },
    customCss: `
      .swagger-ui .topbar { background: #0d0d0d; padding: 8px 16px; }
      .swagger-ui .topbar-wrapper .link span { display: none; }
      .swagger-ui .topbar-wrapper::after {
        content: 'TODO API';
        color: #ffd700;
        font-family: monospace;
        font-size: 1.1rem;
        font-weight: 700;
        letter-spacing: 0.15em;
      }
    `,
  })
);

/* ── Serve raw spec as JSON ──────────────────────────────── */
app.get('/kabi/api-docs.json', (req, res) => res.json(apiSpec));

/* ── API Router ──────────────────────────────────────────── */
const router = express.Router();

// Todos — /todos/bulk MUST be registered before /todos/:id
router.get   ('/todos',        TodosController.listTodos);
router.post  ('/todos',        TodosController.createTodo);
router.post  ('/todos/bulk',   TodosController.bulkTodos);
router.get   ('/todos/:id',    TodosController.getTodo);
router.put   ('/todos/:id',    TodosController.replaceTodo);
router.patch ('/todos/:id',    TodosController.patchTodo);
router.delete('/todos/:id',    TodosController.deleteTodo);

// Stats
router.get('/stats', StatsController.getStats);

app.use('/kabi/api/v1', router);

/* ── Health ──────────────────────────────────────────────── */
app.get('/health', (req, res) =>
  res.json({ status: 'ok', uptime: process.uptime(), ts: new Date().toISOString() })
);

/* ── Root → redirect to docs ─────────────────────────────── */
app.get('/', (req, res) => res.redirect('/api-docs'));

/* ── 404 ─────────────────────────────────────────────────── */
app.use((req, res) =>
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `${req.method} ${req.path} not found` },
  })
);

/* ── Global error handler ────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(err.status || 500).json({
    error: { code: 'INTERNAL_ERROR', message: err.message || 'Unexpected error' },
  });
});

/* ── Export the express app (NOT a server) ───────────────── */
module.exports = app;