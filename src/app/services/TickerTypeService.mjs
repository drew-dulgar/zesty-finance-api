import { DateTime } from 'luxon';
import { AssetClass, Locale, TickerType } from '../models/index.mjs';
import PolygonService from './external/PolygonService.mjs'
import CacheService from './CacheService.mjs';
import BaseService from './BaseService.mjs';
import syncronize from '../../utils/syncronize.mjs';

class TickerTypeService extends BaseService {
  cache;

  constructor() {
    super();

    this.cache = new CacheService({ stdTTL: 86400 });

    return this;
  }

  get({
    id,
    assetClassId,
    localeId,
    code,
    active,
    deleted
  } = {}) {

    const query = TickerType.query()
      .withGraphJoined({
        assetClass: true,
        locale: true,
      }, { joinOperation: 'innerJoin' });


    if (typeof id !== 'undefined') {
      if (Array.isArray(id)) {
        query.where(`${TickerType.tableName}.id`, id);
      } else {
        query.whereIn(`${TickerType.tableName}.id`, id);
      }
    }

    if (typeof assetClassId !== 'undefined') {
      if (Array.isArray(assetClassId)) {
        query.whereIn(`${TickerType.tableName}.asset_class_id`, assetClassId);
      } else {
        query.where(`${TickerType.tableName}.asset_class_id`, assetClassId);
      }
    }

    if (typeof localeId !== 'undefined') {
      if (Array.isArray(localeId)) {
        query.whereIn(`${TickerType.tableName}.locale_id`, localeId);
      } else {
        query.where(`${TickerType.tableName}.locale_id`, localeId);
      }
    }

    if (typeof code !== 'undefined') {
      if (Array.isArray(code)) {
        query.whereIn(`${TickerType.tableName}.code`, code);
      } else {
        query.where(`${TickerType.tableName}.code`, code);
      }
    }

    if (typeof active !== 'undefined') {
      query.where(`${TickerType.tableName}.active`, active);
    }

    if (typeof deleted !== 'undefined') {
      query.where(`${TickerType.tableName}.deleted`, deleted);
    }

    return query;
  }

  getOne(id) {
    return this.get().findById(id);
  }

  fetchTickerTypesFromOrigin() {
    return PolygonService.getTickerTypes();
  }

  async syncronize() {
    try {
      // Load the reference data
      const assetClasses = await AssetClass.query();
      const locales = await Locale.query();

      // Load from our source
      const tickerTypesSource = await this.fetchTickerTypesFromOrigin();
      const target = await this.get();
   
      return syncronize(tickerTypesSource.results, target, 'code', 'code');
      /*
      for (const tickerTypeSource of tickerTypesSource.results) {
        let assetClassId;
        let localeId;

        const assetClass = assetClasses.find(assetClass => assetClass.code === tickerTypeSource.asset_class);

        if (assetClass) {
          assetClassId = assetClass.id;
        } else {
          const createAssetClass = await AssetClass.query().returning('*').insert({
            code: tickerTypeSource.asset_class,
            active: true
          });

          assetClassId = createAssetClass.id;

          assetClasses.push(createAssetClass);
        }

        const locale = locales.find(locale => locale.code === tickerTypeSource.locale);
        if (locale) {
          localeId = locale.id;
        } else {
          const createLocale = await Locale.query().returning('*').insert({
            code: tickerTypeSource.locale,
            active: true
          });

          localeId = createLocale.id;
          locales.push(createLocale);
        }

        await TickerType.query().insert({
          asset_class_id: assetClassId,
          locale_id: localeId,
          code: tickerTypeSource.code,
          description: tickerTypeSource.description,
          active: true,
        })
      }*/

      return true;

    } catch (error) {
      throw error;
    }
  }
}

export default new TickerTypeService();