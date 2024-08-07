import { DateTime } from 'luxon';
import Polygon from './external/Polygon.mjs';
import CacheService from '../modules/cache/CacheService.mjs';
import BaseService from '../modules/BaseService.mjs';

class TickerTypesService extends BaseService {
  cache;

  constructor() {
    super();

    this.cache = new CacheService({ stdTTL: 86400 });

    return this;
  }

  async syncronize() {
    const tickerTypesSource = await PolygonService.getTickerTypes();

    for (const tickerTypeSource of tickerTypesSource.results) {
      let assetClassId;
      let localeId;

      const assetClass = await AssetClassService.getOne({ code: tickerTypeSource.asset_class });
      const locale = await LocaleService.getOne({ code: tickerTypeSource.locale });

      if (assetClass) {
        assetClassId = assetClass.id;
      } else {
        const createAssetClass = await AssetClassService.create({ code: tickerTypeSource.asset_class, active: true });
        assetClassId = createAssetClass[0].id;
      }

      if (locale) {
        localeId = locale.id;
      } else {
        const createLocale = await LocaleService.create({ code: tickerTypeSource.locale, active: true });
        localeId = createLocale[0].id;
      }

      await this.create({
        assetClassId,
        localeId,
        code: tickerTypeSource.code,
        description: tickerTypeSource.description,
        active: true,
      }, true);
    }

    return tickerTypesSource;

  }

}

export default new TickerTypesService();