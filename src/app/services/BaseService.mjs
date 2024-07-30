class BaseService {
  cacheEnabled;

  constructor(cacheEnabled = true) {
    this.cacheEnabled = cacheEnabled;
  }

  setCacheEnabled(cacheEnabled) {
    this.cacheEnabled = cacheEnabled;
  }

  getCacheEnabled() {
    return this.cacheEnabled;
  }
}

export default BaseService;