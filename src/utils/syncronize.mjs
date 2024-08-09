import { get, find, pick, isEqual, difference } from 'lodash-es';

const formatKeys = (keys) => {
  // force array format
  const keysToArray = Array.isArray(keys) 
    ? keys 
    : keys.split(',');

    return keysToArray.map(key => key.trim());
}

const getDataKeys = (sourceDatas = [], targetDatas = [], sourceDataKeysConfig = [], targetDataKeysConfig = []) => {
  const sourceData = sourceDatas.map((sourceData) => {
    const sourceDataKeys = pick(sourceData, sourceDataKeysConfig);
    const targetData = find(targetDatas, targetData => {
      // attempt to find the same record in target data, where the keys values of target data === keys values of source data
      const targetDataKeys = pick(targetData, targetDataKeysConfig);
      return isEqual(sourceDataKeys, targetDataKeys);
    });

    return {
      keys: sourceDataKeys,
      sourceData,
      targetData,
    }
  });

  const targetData = targetDatas.map((targetData) => {
    const targetDataKeys = pick(targetData, targetDataKeysConfig);
    const sourceData = find(sourceDatas, sourceData => {
      // attempt to find the same record in the source data, where the keys values of source data === keys values of target data
      const sourceDataKeys = pick(sourceData, sourceDataKeysConfig);
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
};

const syncronize = (
  sourceDatas = [],
  targetDatas = [],
  sourceDataKeys = ['id'],
  targetDataKeys = ['id'],
  match = {},
) => {
  const useSourceDataKeys = formatKeys(sourceDataKeys);
  const useTargetDataKeys = formatKeys(targetDataKeys);

  const {sourceData, targetData} = getDataKeys(sourceDatas, targetDatas, useSourceDataKeys, useTargetDataKeys);

  const create = sourceData.filter(sd => !sd.targetData).map(sd => sd.sourceData);
  const update = [];
  const remove = targetData.filter(td => !td.sourceData).map(td => td.targetData);

  const actions = {
    create,
    update,
    remove,
    same: [],
  };

  return actions;

  return actions;
  // which records can be updated
  sourceDatas.forEach(sourceData => {
    let sourceDataMatch = {};
    let targetDataMatch = {};

    const targetData = find(targetDatas, { [targetDataKey]: sourceData[sourceDataKey] });

    if (Object.keys(match).length > 0) {
      // auto append the id column, cause it is not part of the match config
      console.log(targetData);
      sourceDataMatch[sourceDataKey] = sourceData[sourceDataKey];
      targetDataMatch[targetDataKey] = targetData[targetDataKey];

      for (const sourceKey in match) {
        const targetKey = match[sourceKey];

        sourceDataMatch[sourceKey] = sourceData[sourceKey];
        targetDataMatch[targetKey] = targetData[targetKey];
      }
    } else {
      // no match configuration provided, use the entire object
      sourceDataMatch = sourceData;
      targetDataMatch = targetData;
    }

    //

    if (!targetData) {
      // target new record
      actions.create.push(sourceDataMatch);
    } else if (!isEqual(sourceDataMatch, targetDataMatch)) {
      // updated record
      actions.update.push(sourceDataMatch);
    } else {
      actions.same.push(sourceDataMatch);
    }
  });


  return actions;
};

export default syncronize;