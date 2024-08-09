import { DateTime } from 'luxon';
import BaseService from './BaseService.mjs';
import CacheService from './CacheService.mjs';

class TickerService extends BaseService {
  cache;
  
  constructor() {
    super();
    
    this.cache = new CacheService({ stdTTL: 86400 });

    return this;
  }

  async get() {
    if (this.cacheEnabled) {
      const tickerCache = this.cache.get(this.key);

      if (tickerCache) {
        return tickerCache;
      }
    }

    const response = await this.fetchTicker();

    if (cache && response) {
      this.cache.set(this.key, response);
    }

    return response;
  }

  async fetchTicker() {
    const response = await Polygon.getTicker(this.ticker);

    return response;
  }
}

export default new TickerService();