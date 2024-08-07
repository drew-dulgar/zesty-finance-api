import express from 'express';
import { NPM_PACKAGE_VERSION } from './config/env.mjs';
import {TickerType} from './models/index.mjs';

const router = express.Router();

router.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

router.get('/user/:id', async (request, response, next) => {
  try {
    
    const markets = await TickerType.query()
    .withGraphJoined({
      assetClass: true,
      locale: true,
    }, { joinOperation: 'innerJoin'});

      response.status(200).json({markets});

  } catch (e) {
    next(e);
  }
});

router.get('/users', async (request, response, next) => {
  try {
    const users = await User.get();

    response.status(200).json({
      users,
    });

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