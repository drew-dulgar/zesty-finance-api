import express from 'express';
import { NPM_PACKAGE_VERSION } from '../lib/env.mjs';
import AssetClassModel from './modules/AssetClass/AssetClassModel.mjs';

const router = express.Router();

router.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

router.get('/user/:id', async (request, response, next) => {
  try {

    await AssetClassModel.update({
      code: 'zzzzzzf4',
      name: 'Testing zupadate4',
    }, {
      id: 6,
    });

    const [user, assetClasses] = await Promise.all([
      AssetClass.getOne({id: 6})
    ]);

    if (user) {
      response.status(200).json({
        user,
        assetClasses
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
      TickerServiceCache: TickerService.cache.stats(),
      TickerTypesServiceCache: TickerTypesService.cache.stats(),
    }
  });
})

export default router;