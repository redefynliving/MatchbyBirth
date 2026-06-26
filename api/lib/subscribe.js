'use strict';

const store = require('./supabase-store.cjs');
const { sendWelcomeEmail } = require('./email-service.cjs');
const { subscribeEmail } = require('./subscription-service.cjs');

function createSubscribeHandler(dependencies) {
  return async (req, res) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
      if (req.body?.consent !== true) {
        return res.status(400).json({ success: false, error: 'Consent is required.' });
      }
      const response = await dependencies.subscribeEmail({
        email: req.body?.email,
        resultId: req.body?.resultId,
        consentSource: req.body?.consentSource,
      });
      return res.status(200).json({
        success: true,
        welcomeEmailSent: response.welcomeEmailSent,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      if (statusCode >= 500) {
        console.error('subscribe failed', { message: error.message });
      }
      return res.status(statusCode).json({
        success: false,
        error: statusCode >= 500 ? 'Unable to subscribe.' : error.message,
      });
    }
  };
}

const handler = createSubscribeHandler({
  subscribeEmail: (input) => subscribeEmail(input, {
    appUrl: process.env.APP_URL,
    tokenSecret: process.env.REPORT_TOKEN_SECRET,
    store,
    sendWelcomeEmail,
    onEmailError: (error) => {
      console.error('welcome email failed', { message: error.message });
    },
  }),
});

module.exports = handler;
module.exports.createSubscribeHandler = createSubscribeHandler;
