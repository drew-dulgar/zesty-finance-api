import { Model } from 'objection';
import { TickerType } from './index';

class AssetClass extends Model {
  static tableName = 'asset_classes';

  static relationMappings = () => ({
    tickerTypes: {
      relation: Model.HasManyRelation,
      modelClass: TickerType,
      join: {
        from: `${AssetClass.tableName}.id`,
        to: `${TickerType.tableName}.asset_class_id`
      }
    }
  });


  $beforeInsert() {
    this.name = this.name || this.code;
  }

  $beforeUpdate() {
    this.name = this.name || this.code;
  }
}


export default AssetClass;