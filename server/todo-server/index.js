'use strict';

const app    = require('./expressServer');
const config = require('./config');
const logger = require('./logger');

const server = app.listen(config.port, () => {
  logger.info(`✅  Todo API server running`);
  logger.info(`   ➜ API Base : http://${config.host}:${config.port}${config.api.basePath}`);
  logger.info(`   ➜ Docs     : http://${config.host}:${config.port}${config.api.docsPath}`);
  logger.info(`   ➜ Health   : http://${config.host}:${config.port}/kabi/health`);
});

/* Graceful shutdown */
const shutdown = (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('uncaughtException',  (err) => { logger.error('Uncaught exception:', err);  process.exit(1); });
process.on('unhandledRejection', (err) => { logger.error('Unhandled rejection:', err); process.exit(1); });