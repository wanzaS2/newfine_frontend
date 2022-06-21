const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    proxy('/api', {
      target: 'http://10.0.2.2:8080/',
      changeOrigin: true,
    }),
  );
};
