import { clients } from "../../lib/postgres.mjs";

class BaseModel {
  table;
  client;
  
  constructor(table, client = 'zestyDb') {
    if (!table) {
      throw new Error('Table must be specified for BaseModel');
    }

    if (!client) {
      throw new Error('Client must be specified for BaseModel');
    }

    if (!clients?.[client]) {
      throw new Error(`Client ${client} does not exist`);
    }

    this.table = table;
    this.client = clients[client];
  }

  getTable() {
    return this.table;
  }
}

export default BaseModel;