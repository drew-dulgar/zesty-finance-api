import { Model } from 'objection';
import { AssetClass, Locale } from './index.mjs';

class TickerType extends Model {
  static tableName = 'ticker_types';

  static relationMappings = () => ({
    assetClass: {
      relation: Model.BelongsToOneRelation,
      modelClass: AssetClass,
      join: {
        from: `${TickerType.tableName}.asset_class_id`,
        to: `${AssetClass.tableName}.id`
      }
    },
    locale: {
      relation: Model.BelongsToOneRelation,
      modelClass: Locale,
      join: {
        from: `${TickerType.tableName}.locale_id`,
        to: `${Locale.tableName}.id`
      }
    }
  });

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}
export default TickerType;