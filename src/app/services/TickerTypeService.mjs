import Syncronizer from '../../utils/syncronizer';
import { AssetClass, Locale, TickerType } from '../models/index';
import PolygonService from './external/PolygonService'
import CacheService from './CacheService';
import BaseService from './BaseService';


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
        locale: true
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

      const [tickerTypesSource, tickerTypesTarget, assetClasses, locales] = await Promise.all([
        this.fetchTickerTypesFromOrigin(),
        this.get(),

        // Load the reference data
        AssetClass.query(),
        Locale.query()
      ]);
      
      const syncronizer = new Syncronizer({
        sourceKeys: 'code',
        sourceData: tickerTypesSource.results,
        targetKeys: 'code',
        targetData: tickerTypesTarget
      });

      const {create, update} = await syncronizer.result([
        {
          key: 'asset_class_id',
          source: 'asset_class',
          target: 'assetClass.code',
          transform: async (assetClassCode) => {
            const assetClass = assetClasses.find(assetClass => assetClass.code === assetClassCode);

            if (assetClass) {
              return assetClass.id;
            } else {
              const createAssetClass = await AssetClass.query().returning('*').insert({
                code: assetClassCode,
                active: true
              });
    
              assetClasses.push(createAssetClass);

              return createAssetClass.id;
             
            }
          }
        },
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
          key: 'description'
        }
      ]);

      return {create, update};

    } catch (error) {
      throw error;
    }
  }
}

export default new TickerTypeService();