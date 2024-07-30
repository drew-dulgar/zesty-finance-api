import path from 'path';
import fetch from 'node-fetch';
import { POLYGON_URL, POLYGON_API_KEY } from '../../../lib/env.mjs';

class Polygon {
  url;
  apiKey;

  constructor() {
    this.url = POLYGON_URL;
    this.apiKey = POLYGON_API_KEY;
  }

  buildUrl(endpoint, queryParams = {}) {
    let url = path.join(this.url, endpoint);

    if (!queryParams?.apiKey) {
      queryParams.apiKey = this.apiKey;
    }

    if (Object.keys(queryParams).length > 0) {
      url += `?${new URLSearchParams(queryParams)}`
    }

    return url;
  }

  async fetch(endpoint, queryParams = {}) {
    try {
      const url = this.buildUrl(endpoint, queryParams);

      const response = await fetch(url);
      const results = await response.json();

      return results;
    } catch (error) {
      return {
        status: 'ERROR',
        error: error.message,
      }
    }
  }

  async getTickers() {

  }
  
  async getTicker(ticker) {
    const results = await this.fetch(`v3/reference/tickers/${ticker}`);

    return this.results(results);
  }

  async getTickerTypes(assetClass = 'stocks', local = 'us') {
    const results = await this.fetch('v3/reference/tickers/types', {
      asset_class: assetClass,
      local,
    });

    return this.results(results);
  }

  results(results) {
    if (results.status === 'OK') {
      return results;
    }

    console.error(results);

    return null;
  }
}

export default new Polygon();