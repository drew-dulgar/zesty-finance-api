import NodeCache from 'node-cache';
import { APP_CACHE } from '../config/env.mjs';

class CacheService {
  constructor(args = {}) {
    const options = Object.assign({}, {
      stdTTL: 0,
      checkperiod: 600,
      useClones: true,
      deleteOnExpire: true,
      enableLegacyCallbacks: false,
      maxKeys: -1
    }, args);

    if (!APP_CACHE) {
      // disable cache if its turned off system wide
      options.stdTTL = -1;
    }

    this.cache = new NodeCache(options);
  }

  has(key) {
    return this.cache.has(key);
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, val, ttl) {
    return this.cache.set(key, val, ttl);
  }

  take(key) {
    return this.cache.take(key);
  }

  delete(key) {
    return this.cache.del(key);
  }

  keys() {
    return this.cache.keys();
  }

  stats() {
    return this.cache.getStats();
  }

  flushStates() {
    return this.cache.flushStats();
  }

  flushAll() {
    return this.cache.flushAll();
  }

  close() {
    return this.cache.close();
  }
}

export default CacheService;