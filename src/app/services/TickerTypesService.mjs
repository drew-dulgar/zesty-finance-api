import { DateTime } from 'luxon';
import Polygon from "./external/Polygon.mjs";
import CacheService from "./CacheService.mjs";
import BaseService from './BaseService.mjs';

const TickerTypesServiceCache = new CacheService({ stdTTL: 86400 });

class TickerTypesService extends BaseService {
  async get(assetClass = 'stocks', local = 'us') {
    const key = `ticker_types_${assetClass}_${local}`;

    if (this.cacheEnabled) {
      const tickerTypesCache = TickerTypesServiceCache.get(key);

      if (tickerTypesCache) {
        return tickerTypesCache;
      }
    }

    const response = await this.fetchTickerTypes(assetClass, local);

    if (this.cacheEnabled && response) {
      TickerTypesServiceCache.set(key, response);
    }

    return response;
  }

  async fetchTickerTypes(assetClass = 'stocks', local = 'us') {
    const response = await Polygon.getTickerTypes(assetClass, local);

    return response;
  }
}

export default TickerTypesService;
export { TickerTypesServiceCache };