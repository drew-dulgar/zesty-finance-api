import path from 'path';
import fetch from 'node-fetch';
import { POLYGON_URL, POLYGON_API_KEY } from '../../config/env.mjs';

class PolygonService {
  url;
  apiKey;

  constructor() {
    this.url = POLYGON_URL;
    this.apiKey = POLYGON_API_KEY;
  }

  buildUrl(endpoint, queryParams = {}) {
    let url = path.join(this.url, endpoint);

    if (Object.keys(queryParams).length > 0) {

      Object.keys(queryParams).forEach((key) => {
        if (typeof queryParams[key] === 'undefined') {
          delete queryParams[key];
        }
      });

      url += `?${new URLSearchParams(queryParams)}`;
    }

    return url;
  }

  async fetch(endpoint, queryParams = {}) {
    try {
      const url = this.buildUrl(endpoint, queryParams);
      const headers = {
        Authorization: `Bearer ${this.apiKey}`
      };

      const response = await fetch(url, {
        headers
      });

      const results = await response.json();

      if (results.status === 'OK') {
        return results;
      }

      throw new Error('Polygon fetch Error', { cause: results });
    } catch (error) {
      throw error;
    }
  }

  getTickers({ tickerType, market, active = true, sort = 'ticker', order = 'asc', limit = 1000, next_url } = {}) {

    if (next_url) {
      const url = URL.parse(next_url);

      return this.fetch('/v3/reference/tickers', {
        cursor: url.searchParams.get('cursor'),
      });

    }

    return this.fetch('/v3/reference/tickers', {
      type: tickerType,
      market: market,
      active,
      sort,
      order,
      limit
    });
  }

  getTicker(ticker) {
    return this.fetch(`v3/reference/tickers/${ticker}`);
  }

  getTickerTypes(assetClass = 'stocks', local = 'us') {
    return this.fetch('v3/reference/tickers/types', {
      asset_class: assetClass,
      local,
    });
  }

}

export default new PolygonService();