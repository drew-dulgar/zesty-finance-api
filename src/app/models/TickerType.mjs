import { Model } from 'objection';
import { AssetClass, Locale } from './index.mjs';

class TickerType extends Model {
  static tableName = 'ticker_types';

  static relationMappings = {
    assetClass: {
      relation: Model.BelongsToOneRelation,
      modelClass: AssetClass,
      join: {
        from: 'ticker_types.asset_class_id',
        to: 'asset_classes.id'
      }
    },
    locale: {
      relation: Model.BelongsToOneRelation,
      modelClass: Locale,
      join: {
        from: 'ticker_types.locale_id',
        to: 'locales.id'
      }
    }
  };
}

export default TickerType;