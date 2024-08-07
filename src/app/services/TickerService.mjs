import { DateTime } from 'luxon';
import Polygon from './external/Polygon.mjs';
import CacheService from '../modules/cache/CacheService.mjs';
import BaseService from '../modules/BaseService.mjs';

class TickerService extends BaseService {
  cache;

  constructor() {
    super();

    this.cache = new CacheService({ stdTTL: 86400 });

    return this;
  }

  async get(ticker) {
    const key = `ticker_$${ticker}`;

    if (this.cacheEnabled) {
      const tickerCache = this.cache.get(key);

      if (tickerCache) {
        return tickerCache;
      }
    }

    const response = await this.fetchTicker(ticker);

    if (this.cacheEnabled && response) {
      this.cache.set(key, response);
    }

    return response;
  }

  async fetchTicker(ticker) {
    const response = await this.fetchWithRetry(
      () => Polygon.getTicker(ticker)
    );

    return response;
  }
}

export default new TickerService();