'use strict';

const defaultService = require('./cyclecalcs-service.cjs');

function createCycleCalcsHandler(service = defaultService) {
  return async (req, res) => {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    try {
      const context = await service.getMoonContext();
      res.setHeader(
        'Cache-Control',
        context.available
          ? 'public, s-maxage=900, stale-while-revalidate=3600'
          : 'no-store',
      );
      return res.status(200).json(context);
    } catch (error) {
      console.error('cyclecalcs route failed', {
        name: error.name,
        message: error.message,
      });
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({
        available: false,
        source: 'cyclecalcs',
      });
    }
  };
}

module.exports = createCycleCalcsHandler();
module.exports.createCycleCalcsHandler = createCycleCalcsHandler;
