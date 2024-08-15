import { DateTime } from 'luxon';
import Syncronizer from '../../utils/syncronizer.mjs';
import { AssetClass, Locale, TickerType } from '../models/index.mjs';
import PolygonService from './external/PolygonService.mjs'
import CacheService from './CacheService.mjs';
import BaseService from './BaseService.mjs';


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
    return this.fetchWithRetry(() => PolygonService.getTickerTypes());
  }

  async syncronize() {
    try {
      // Load the reference data
      const assetClasses = await AssetClass.query();
      const locales = await Locale.query();

      // Load from our source
      const tickerTypesSource = await this.fetchTickerTypesFromOrigin();
      const tickerTypesTarget = await this.get();

      const syncronizer = new Syncronizer({
        sourceKeys: 'code',
        sourceData: tickerTypesSource.results,
        targetKeys: 'code',
        targetData: tickerTypesTarget
      });

      syncronizer.setValues(async (values = {}) => {
        const { asset_class: assetClassCode, locale: localeCode, ...rest } = values;
        const nextValues = {
          ...rest
        };


        if (assetClassCode) {
          const assetClass = assetClasses.find(assetClass => assetClass.code === assetClassCode);

          if (assetClass) {
            nextValues.asset_class_id = assetClass.id;
          } else {
            const createAssetClass = await AssetClass.query().returning('*').insert({
              code: assetClassCode,
              active: true
            });
  
            nextValues.asset_class_id = createAssetClass.id;
            assetClasses.push(createAssetClass);
          }
        }

        if (localeCode) {
          const locale = locales.find(locale => locale.code === localeCode);
          if (locale) {
            nextValues.locale_id = locale.id;
          } else {
            const createLocale = await Locale.query().returning('*').insert({
              code: localeCode,
              active: true
            });
  
            nextValues.locale_id = createLocale.id;
            locales.push(createLocale);
          }
        }

        return nextValues;
      });


      const {create, update} = await syncronizer.result({
        asset_class: 'assetClass.code',
        locale: 'locale.code',
        description: 'description',
      });




      return {create, update};

    } catch (error) {
      throw error;
    }
  }
}

export default new TickerTypeService();