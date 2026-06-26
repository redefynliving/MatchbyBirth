'use strict';

const store = require('./supabase-store.cjs');
const { unsubscribeEmail } = require('./subscription-service.cjs');

function createUnsubscribeHandler(dependencies) {
  return async (req, res) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
      const response = await dependencies.unsubscribeEmail({
        email: req.body?.email,
        token: req.body?.token,
      });
      return res.status(200).json({
        success: true,
        unsubscribed: response.unsubscribed,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode >= 500) {
        console.error('unsubscribe failed', { message: error.message });
      }
      return res.status(statusCode).json({
        success: false,
        error: statusCode >= 500 ? 'Unable to unsubscribe.' : error.message,
      });
    }
  };
}

const handler = createUnsubscribeHandler({
  unsubscribeEmail: (input) => unsubscribeEmail(input, {
    tokenSecret: process.env.REPORT_TOKEN_SECRET,
    store,
  }),
});

module.exports = handler;
module.exports.createUnsubscribeHandler = createUnsubscribeHandler;
