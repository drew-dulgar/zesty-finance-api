import { DateTime } from 'luxon';
import Polygon from "./external/Polygon.mjs";
import CacheService from "../modules/cache/CacheService.mjs";

class TickerService {
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