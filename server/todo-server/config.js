'use strict';

const config = {
  port: process.env.PORT || 4000,
  host: process.env.HOST || 'localhost',
  env:  process.env.NODE_ENV || 'development',

  api: {
    basePath: '/kabi/api/v1',
    docsPath: '/kabi/api-docs',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://concproject-alb-1190008323.ap-south-1.elb.amazonaws.com',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
};

module.exports = config;

// dsdf