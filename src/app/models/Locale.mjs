import { Model } from 'objection';
import {TickerType} from './index.mjs';

class Locale extends Model {
  static tableName = 'locales';

  static relationMappings = () => ({
    tickerTypes: {
      relation: Model.HasManyRelation,
      modelClass: TickerType,
      join: {
        from: `${Locale.tableName}.id`,
        to: `${TickerType.tableName}.asset_class_id`
      }
    },
  });

  $beforeInsert() {
    this.name = this.name || this.code;
  }

  $beforeUpdate() {
    this.name = this.name || this.code;
  }
}

export default Locale;