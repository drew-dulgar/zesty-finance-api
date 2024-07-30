import { DateTime } from 'luxon';
import Polygon from "./external/Polygon.mjs";
import CacheService from "./CacheService.mjs";

const TickerServiceCache = new CacheService({ stdTTL: 86400 });

class TickerService {
  key;
  ticker;

  constructor(ticker) {
    this.key = `ticker_${ticker}`;
    this.ticker = ticker;
  }

  async get(cache = true) {
    if (cache) {
      const tickerCache = TickerServiceCache.get(this.key);

      if (tickerCache) {
        return tickerCache;
      }
    }

    const response = await this.fetchTicker();

    if (cache && response) {
      TickerServiceCache.set(this.key, response);
    }

    return response;
  }

  async fetchTicker() {
    const response = await Polygon.getTicker(this.ticker);

    return response;
  }
}

export default TickerService;
export { TickerServiceCache };