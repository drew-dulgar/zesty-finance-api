import { Model } from 'objection';
import { Ticker } from './index.mjs';

class Market extends Model {
  static tableName = 'markets';

  static relationMappings = () => ({
    tickers: {
      relation: Model.HasManyRelation,
      modelClass: Ticker,
      join: {
        from: `${Market.tableName}.id`,
        to: `${Ticker.tableName}.market_id`
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


export default Market;