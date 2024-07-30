import BaseModel from '../BaseModel.mjs';

class User extends BaseModel {
  async get ({
    id
  } = {}) {
    const query = [`
      SELECT *
      FROM ${this.table}
      WHERE 0 = 0
    `];
    const params = [];

    if (id) {
      params.push(id);
      query.push(`AND id = $${params.length}`);
    }

    const result = await this.client.query(query.join(' '), params);

    return result?.rows || [];
  }
}

export default new User('users');