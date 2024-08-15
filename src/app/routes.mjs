import express from 'express';
import { NPM_PACKAGE_VERSION } from './config/env.mjs';
import PolygonService from './services/external/PolygonService.mjs';
import TickerService from './services/TickerService.mjs';

const router = express.Router();

router.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

router.get('/tickers', async (request, response, next) => {
  try { 
    //const tickers = await PolygonService.getTickers({ market: 'stocks', limit: 10});

    const tickers = await TickerService.syncronize();
    
    response.status(200).json({ tickers })
  } catch (e) {
    next(e);
  }
});


router.get('/health', (request, response, next) => {
  response.status(200).json({
    version: NPM_PACKAGE_VERSION,
    cache: {
      TickerServiceCache: TickerService.cache.stats(),
      TickerTypesServiceCache: TickerTypesService.cache.stats(),
    }
  });
})

export default router;