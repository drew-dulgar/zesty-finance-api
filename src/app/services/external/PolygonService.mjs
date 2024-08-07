import path from 'path';
import fetch from 'node-fetch';
import { POLYGON_URL, POLYGON_API_KEY } from '../../../config/env.mjs';

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
      console.error(error);
      throw error;
    }
  }

  async getTickers() {

  }

  async getTicker(ticker) {
    const results = await this.fetch(`v3/reference/tickers/${ticker}`);

    return results;
  }

  async getTickerTypes(assetClass = 'stocks', local = 'us') {
    const results = await this.fetch('v3/reference/tickers/types', {
      asset_class: assetClass,
      local,
    });

    return results;
  }

}

export default new PolygonService();