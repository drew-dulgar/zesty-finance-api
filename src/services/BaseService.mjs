class BaseService {
  cacheEnabled;

  constructor(cacheEnabled = true) {
    this.cacheEnabled = cacheEnabled;

    return this;
  }

  setCacheEnabled(cacheEnabled) {
    this.cacheEnabled = cacheEnabled;
  }

  getCacheEnabled() {
    return this.cacheEnabled;
  }

  columns(tableName, ...columns) {
    
    return columns.map(column => `${tableName}.${column}`);
    
  }

  fetchWithRetry(fetchFunction = new Promise(), maxAttempts = 6, baseDelayMs = 2000, randomness = .05) {
    let attempt = 1;
    
    const executeFetch = async () => {
      try {
        return await fetchFunction();
      } catch (error) {
        if (attempt >= maxAttempts) {
          throw error;
        }

        const delayMs = baseDelayMs * 2 ** attempt;
        const delayDiff = (delayMs * randomness);
        const delayMin = delayMs - delayDiff;
        const delayMax = delayMs + delayDiff;
        const delayRandom = Math.random() * (delayMax - delayMin) + delayMin;

        console.log(`Retry attempt ${attempt} after ${delayRandom}ms`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));

        attempt++;
        return executeFetch();
      }
    }

    return executeFetch();
  }
}

export default BaseService;