import express from 'express';
import { NPM_PACKAGE_VERSION } from './config/env.mjs';
import syncronize from '../utils/syncronize.mjs';

const router = express.Router();

router.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

router.get('/user/:id', async (request, response, next) => {
  try {
    const sourceData = [
      {id: 1, value: 'foo', name: 'bob'},
      {id: 2, value: 'update_entry', name: 'frank'},
      {id: 3, value: 'bar', name: 'timx'},
      {id: 5, value: 'new_entry', name: 'sara'}
    ];
    const targetData = [
      {id: 1, value: 'foo', name: 'bob',},
      {id: 2, value: 'bob', name: 'frank'},
      {id: 3, value: 'bar', name: 'tim',},
      {id: 4, value: 'delete_entry', name: 'sara'}
    ];

      response.status(200).json({sync: syncronize(sourceData, targetData, 'id', 'id', {
        name: 'name',
      })});

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