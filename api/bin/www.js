#!/usr/bin/env node

require('dotenv').config();

/**
 * Module dependencies.
 */

/**
  * Normalize a port into a number, string, or false.
*/
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  // eslint-disable-next-line no-restricted-globals
  return ((isNaN(port) && val) || (port >= 0 && port));
};

const app = require('../src/app');
const debug = require('debug')('api:server');
const http = require('http');
const mongoose = require('mongoose');
const { databaseURL } = require('../config/database');

mongoose.connect(databaseURL)
  .then(() => {
    /**
     * Get port from environment and store in Express.
     */

    const port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    /**
     * Create HTTP server.
     */

    const server = http.createServer(app);

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
      const addr = server.address();
      const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
      debug(`Listening on ${bind}`);
    }


    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  })
  .catch((err) => {
    console.log(`Error: ${err.message}`);
  });
