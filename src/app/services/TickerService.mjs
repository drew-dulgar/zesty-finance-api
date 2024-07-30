import { DateTime } from 'luxon';
import Polygon from "./external/Polygon.mjs";
import CacheService from "./CacheService.mjs";
import BaseService from './BaseService.mjs';

const TickerServiceCache = new CacheService({ stdTTL: 86400 });

class TickerService extends BaseService {
  async get(ticker) {
    const key = `ticker_$${ticker}`;

    if (this.cacheEnabled) {
      const tickerCache = TickerServiceCache.get(key);

      if (tickerCache) {
        return tickerCache;
      }
    }

    const response = await this.fetchTicker(ticker);

    if (this.cacheEnabled && response) {
      TickerServiceCache.set(key, response);
    }

    return response;
  }

  async fetchTicker(ticker) {
    const response = await Polygon.getTicker(ticker);

    return response;
  }
}

export default TickerService;
export { TickerServiceCache };