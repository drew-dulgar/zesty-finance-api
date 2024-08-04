import BaseModel from '../BaseModel.mjs';

class AssetClassModel extends BaseModel {
  get({
    id,
    code,
    active = true,
    deleted = false
  } = {}) {
    const query = 
      this.client(this.table)
        .select('id', 'code', 'name', 'active', 'deleted');

    if (typeof id !== 'undefined') {
      query.where({ id });
    }

    if (typeof code !== 'undefined') {
      query.where({ code });
    }

    if (typeof active !== 'undefined') {
      query.where({ active });
    }

    if (typeof deleted !== 'undefined') {
      query.where({ deleted });
    }

    return query;
  }

  getOne({
    id,
    code,
    active,
    deleted
  } = {}) {
    return this.get({
      id,
      code,
      active,
      deleted
    });
  }

  create({
    code,
    name,
    active = false,
    deleted = false
  } = {}) {
    const query = this.client(this.table).insert({
      code,
      name,
      active,
      deleted
    }, ['id']);

    return query;
  }

  update(update = {
    code,
    name,
    active,
    deleted
  } = {}, where = {
    id,
    code,
    name,
    active,
    deleted
  } = {}) {
    const query = this.client(this.table);

    if (typeof update.code !== 'undefined') {
      query.update('code', update.code);
    }

    if (typeof update.name !== 'undefined') {
      query.update('name', update.name);
    }

    if (typeof update.active !== 'undefined') {
      query.update('active', update.active);
    }

    if (typeof update.deleted !== 'undefined') {
      query.update('deleted', update.deleted);
    }

    if (typeof where.id !== 'undefined') {
      query.where('id', where.id);
    }

    if (typeof where.code !== 'undefined') {
      query.where('code', where.code);
    }

    if (typeof where.name !== 'undefined') {
      query.where('name', where.name);
    }

    if (typeof where.active !== 'undefined') {
      query.where('active', where.active);
    }

    if (typeof where.deleted !== 'undefined') {
      query.where('deleted', where.deleted);
    }
  
    return query;
  }

  delete({
    id,
    code,
    name,
    active,
    deleted
  } = {}) {
    const query = this.client(this.table);

    if (typeof id !== 'undefined') {
      query.where({ id });
    }

    if (typeof code !== 'undefined') {
      query.where({ code });
    }

    if (typeof name !== 'undefined') {
      query.where({ name });
    }

    if (typeof active !== 'undefined') {
      query.where({ active });
    }

    if (typeof deleted !== 'undefined') {
      query.where({ deleted });
    }

    return query;
  }
}

export default new AssetClassModel('asset_classes');