import { Model } from 'objection';
import { Locale, Market, TickerType } from './index.mjs';

class Ticker extends Model {
  static tableName = 'tickers';

  static relationMappings = () => ({
    locale: {
      relation: Model.BelongsToOneRelation,
      modelClass: Locale,
      join: {
        from: `${Ticker.tableName}.locale_id`,
        to: `${Locale.tableName}.id`
      }
    },
    market: {
      relation: Model.BelongsToOneRelation,
      modelClass: Market,
      join: {
        from: `${Ticker.tableName}.market_id`,
        to: `${Market.tableName}.id`
      }
    },
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: TickerType,
      join: {
        from: `${Ticker.tableName}.ticker_type_id`,
        to: `${TickerType.tableName}.id`
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


export default Ticker;