import express from 'express';
import { NPM_PACKAGE_VERSION } from '../lib/env.mjs';
import User from './models/user/User.mjs';
import {
  TickerService, 
  TickerServiceCache,
  TickerTypesService,
  TickerTypesServiceCache,
} from './services/index.mjs';

const router = express.Router();

router.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

router.get('/user/:id', async (request, response, next) => {
  try {
    const user = await User.getOne(request.params.id);
    const ticker = await new TickerService().get('AAPL');
    const tickerTypes = await new TickerTypesService().get();

    if (user) {
      response.status(200).json({
        user,
        ticker,
        tickerTypes
      });
    } else {
      next();
    }

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
      TickerServiceCache: TickerServiceCache.stats(),
      TickerTypesServiceCache: TickerTypesServiceCache.stats(),
    }
  });
})

export default router;