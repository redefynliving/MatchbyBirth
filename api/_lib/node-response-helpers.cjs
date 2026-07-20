'use strict';

function attachNodeResponseHelpers(response) {
  if (!response || typeof response !== 'object') {
    throw new TypeError('A Node response object is required.');
  }

  if (typeof response.status !== 'function') {
    response.status = function status(statusCode) {
      this.statusCode = statusCode;
      return this;
    };
  }

  if (typeof response.json !== 'function') {
    response.json = function json(body) {
      if (!this.headersSent) {
        this.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      this.end(JSON.stringify(body));
      return this;
    };
  }

  return response;
}

module.exports = {
  attachNodeResponseHelpers,
};
