import { createProxyMiddleware } from 'http-proxy-middleware';
import { Express } from 'express';

module.exports = function(app: Express) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://sathhi-backend.onrender.com',
      changeOrigin: true,
    })
  );
};