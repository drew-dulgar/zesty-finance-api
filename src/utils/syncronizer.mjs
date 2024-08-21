import { get, find, pick, isEqual } from 'lodash-es';

class Syncronizer {
  debug = false;
  sourceKeys = ['id'];
  sourceData = [];
  targetKeys = ['id'];
  targetData = [];
  values = async (values = {}) => values;

  constructor({ sourceKeys, sourceData, targetKeys, targetData, debug = true } = {}) {
    this.debug = debug;
    
    this.setSourceKeys(sourceKeys);
    this.setSourceData(sourceData);
    this.setTargetKeys(targetKeys);
    this.setTargetData(targetData);

    return this;
  }

  _formatKeys(keys) {
    // force array format
    const keysToArray = Array.isArray(keys)
      ? keys
      : keys.split(',');

    return keysToArray.map(key => key.trim());
  }

  _mapData() {
    const sourceData = this.sourceData.map((sourceData) => {
      const sourceDataKeys = pick(sourceData, this.sourceKeys);
      const targetData = find(this.targetData, targetData => {
        // attempt to find the same record in target data, where the keys values of target data === keys values of source data
        const targetDataKeys = pick(targetData, this.targetKeys);
        return isEqual(sourceDataKeys, targetDataKeys);
      });

      return {
        keys: sourceDataKeys,
        sourceData,
        targetData,
      }
    });

    const targetData = this.targetData.map((targetData) => {
      const targetDataKeys = pick(targetData, this.targetKeys);
      const sourceData = find(this.sourceData, sourceData => {
        // attempt to find the same record in the source data, where the keys values of source data === keys values of target data
        const sourceDataKeys = pick(sourceData, this.sourceKeys);
        return isEqual(targetDataKeys, sourceDataKeys);
      });

      return {
        keys: targetDataKeys,
        targetData,
        sourceData,
      };
    });

    return {
      sourceData,
      targetData,
    }
  }

  setDebug(debug = true) {
    this.debug = debug;
  }

  setSourceKeys(sourceKeys) {
    if (sourceKeys !== 'undefined') {
      this.sourceKeys = this._formatKeys(sourceKeys);
    }
  }

  setTargetKeys(targetKeys) {
    if (targetKeys !== 'undefined') {
      this.targetKeys = this._formatKeys(targetKeys);
    }
  }

  setSourceData(sourceData) {
    if (this.sourceData !== 'undefined') {
      this.sourceData = sourceData;
    }
  }

  setTargetData(targetData) {
    if (this.targetData !== 'undefined') {
      this.targetData = targetData;
    }
  }

  async result(configMaps = []) {
    const { sourceData, targetData } = this._mapData();

    const create = [];
    const update = [];
    const remove = targetData.filter(td => !td.sourceData).map(td => ({ keys: td.keys }));
    const same = [];

    for (const sd of sourceData) {
      // build out the columns and their values that will get updated
      const sourceValues = {};
      const targetValues = {};

      for (const configMap of configMaps) {
        const key = configMap.key;
        const source = configMap?.source || key;
        const sourceEmpty = configMap?.sourceEmpty || null;
        const target = configMap?.target || key;
        const targetEmpty = configMap?.targetEmpty || null;
        const transform = configMap?.transform || ((value) => value);
        const sourceTransform = configMap?.sourceTransform || transform;
        const targetTransform = configMap?.targetTrasnform || transform;

        const sourceValue = get(sd.sourceData, source, '');
        const useSourceValue = sourceValue ? sourceValue.toString() : sourceEmpty;
        
        if (!sd.targetData) {
          // create record
          sourceValues[key] = await sourceTransform(useSourceValue);
        } else {
          const targetValue = get(sd.targetData, target, '');
          const useTargetValue = targetValue ? targetValue.toString() : targetEmpty;

          const transformedSourceValue = await sourceTransform(useSourceValue);
          const transformedTargetValue = await targetTransform(useTargetValue);

          if (!isEqual(transformedSourceValue, transformedTargetValue)) {
            sourceValues[key] = transformedSourceValue;
            targetValues[key] = transformedTargetValue;
          }
        }
      }

      if (!sd.targetData) {
        const values = {
          ...sd.keys,
          ...sourceValues
        };

        create.push({ values });
      } else if (!isEqual(sourceValues, targetValues)) {
        const values = sourceValues;

        update.push({
          keys: sd.keys,
          values
        });
      } else {
        same.push({
          keys: sd.keys,
          sourceValues,
          targetValues,
        });
      }
    }

    return {
      create,
      update,
      remove,
      same,
    };
  }
}

export default Syncronizer;
