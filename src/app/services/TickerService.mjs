import { DateTime } from 'luxon';
import { padStart } from 'lodash-es';
import BaseService from './BaseService.mjs';
import Syncronizer from '../../utils/syncronizer.mjs';
import { Ticker, Locale, Market, TickerType } from '../models/index.mjs';
import PolygonService from './external/PolygonService.mjs';

class TickerService extends BaseService {
  cache;

  constructor() {
    super();

    //this.cache = new CacheService({ stdTTL: 86400 });

    return this;
  }

  get({
    id,
    ticker,
  } = {}) {

    const query = Ticker.query()
      .withGraphJoined({
        locale: true,
        market: true,
        type: true,
      }, { joinOperation: 'innerJoin' });

    if (typeof id !== 'undefined') {
      if (Array.isArray(id)) {
        query.where(`${Ticker.tableName}.id`, id);
      } else {
        query.whereIn(`${Ticker.tableName}.id`, id);
      }
    }

    if (typeof ticker !== 'undefined') {
      if (Array.isArray(ticker)) {
        query.where(`${Ticker.tableName}.ticker`, ticker);
      } else {
        query.whereIn(`${Ticker.tableName}.ticker`, ticker);
      }
    }

    return query;
  }

  getOne(id) {
    return this.get().findById(id);
  }

  fetchTickersFromOrigin(nextUrl) {
    if (nextUrl) {
      return this.fetchWithRetry(() => PolygonService.getTickers({ nextUrl }));
    } else {
      return this.fetchWithRetry(() => PolygonService.getTickers({ tickerType: 'CS', market: 'stocks' }));
    }
  }

  async syncronize() {
    // Load the reference data
    const [tickersTarget, markets, locales, tickerTypes] = await Promise.all([
      this.get(),

      // reference data
      Market.query(),
      Locale.query(),
      TickerType.query()
    ]);

    let nextUrl = '';
    const errors = [];

    const syncronizer = new Syncronizer({
      sourceKeys: 'composite_figi',
      //sourceData: tickersSource.results.filter(ticker => ticker?.cik && ticker?.componsite_figi),
      targetKeys: 'composite_figi',
      targetData: tickersTarget
    });

    do {
      // if there is another page of data, store it to loop one more time 
      nextUrl = tickersSource?.next_url || '';

      // grab the current pages data
      const tickersSource = await this.fetchTickersFromOrigin(nextUrl);

      syncronizer.setSourceData(tickersSource);



    } while (nextUrl)



    const { create, update } = await syncronizer.result([
      {
        key: 'locale_id',
        source: 'locale',
        target: 'locale.code',
        transform: async (localeCode) => {
          const locale = locales.find(locale => locale.code === localeCode);
          if (locale) {
            return locale.id;
          } else {
            const createLocale = await Locale.query().returning('*').insert({
              code: localeCode,
              active: true
            });
  
            locales.push(createLocale);

            return createLocale.id;
          }
        }
      },
      {
        key: 'market_id',
        source: 'market',
        target: 'market.code',
        transform: async (marketCode) => {
          const market = markets.find(market => market.code === marketCode);
          if (market) {
            return market.id;
          } else {
            const createMarket = await Market.query().returning('*').insert({
              code: marketCode,
              active: true
            });
  
            markets.push(createMarket);

            return createMarket.id;
          }
        }
      },
      {
        key: 'ticker_type_id',
        source: 'type',
        target: 'type.code',
        transform: (tickerTypeCode) => {
          const tickerType = tickerTypes.find(tickerType => tickerType.code === tickerTypeCode);

          return tickerType?.id || 0;
        },
      },
      {
        key: 'ticker',
      },
      {
        key: 'name',
      },
      {
        key: 'cik',
        transform: (cik) => cik ? parseInt(cik) : 0
      },
      {
        key: 'currency_name',
      },
      {
        key: 'primary_exchange',
      },
      {
        key: 'delisted',
      },
      {
        key: 'last_updated',
        source: 'last_updated_utc',
        transform: (date) => new Date(date).toUTCString(),
      }
    ]);

    const createTickers = create.map(async ({ values }) => {
      try { 
        return await Ticker.query().insert(values);
      } catch (error) {
        errors.push({
          values,
          error: error.message
        });
      }
    });

    const updateTickers = update.map(async ({keys, values}) => {
      try { 
        return await Ticker.query().update(values).where(keys);
      } catch(error) {
        errors.push({
          keys,
          values,
          error,
        });
      }
    });

    await Promise.all([...createTickers, ...updateTickers]);

    return { errors, create, update };
  }
}

export default new TickerService();