import { DateTime } from 'luxon';
import Polygon from "./external/Polygon.mjs";
import CacheService from "./CacheService.mjs";
import BaseService from './BaseService.mjs';

class TickerTypesService extends BaseService {
  cache;

  constructor() {
    super();

    this.cache = new CacheService({ stdTTL: 86400 });

    return this;
  }

  async get(assetClass = 'stocks', local = 'us') {
    try {
      const key = `ticker_types_${assetClass}_${local}`;

      if (this.cacheEnabled) {
        const tickerTypesCache = this.cache.get(key);

        if (tickerTypesCache) {
          return tickerTypesCache;
        }
      }

      const response = await this.fetchTickerTypes(assetClass, local);

      if (this.cacheEnabled && response) {
        this.cache.set(key, response);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async fetchTickerTypes(assetClass = 'stocks', local = 'us') {
    const response = await this.fetchWithRetry(
      () => Polygon.getTickerTypes(assetClass, local)
    );

    return response;
  }
}

export default new TickerTypesService();