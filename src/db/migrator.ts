
import dotenvx from '@dotenvx/dotenvx';

dotenvx.config({
  path: path.join(import.meta.dirname, '../../../.env.local')
});

import * as path from 'path';
import { promises as fs } from 'fs';
import {
  Kysely,
  Migrator,
  FileMigrationProvider,
} from 'kysely';
import { kebabCase } from 'lodash-es';


// import after donenv
import zestyFinanceDb from './zesty-finance-db.js';



const migrationsPath = path.join(import.meta.dirname, 'migrations');

const migrator = new Migrator({
  db: zestyFinanceDb,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: migrationsPath,
  }),
});

export const createMigration = async (migrationName: string[]): Promise<void> => {
  const migrationCreatedAt = new Date().getTime();
  const migrationFileName = kebabCase(`${migrationCreatedAt} ${migrationName.join(' ')}`);
  const migrationFilePath = path.join(migrationsPath, migrationFileName).replace('/dist', '') + '.ts';

  const migrationFileContent = `import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  // Migration code
};

export const down = async (db: Kysely<any>): Promise<void> => {
  // Migration code
};`;

  try {
    await fs.writeFile(migrationFilePath, migrationFileContent);
  } catch (err) {
    console.log(err);
  }
}

export const migrate = async (method: 'up' | 'down' | 'latest' = 'latest') => {
  const migrateMethods = {
    up: migrator.migrateUp,
    down: migrator.migrateDown,
    latest: migrator.migrateToLatest,
  };

  if (!(method in migrateMethods)) {
    throw new Error('Invalid migrate method passed');
  }

  const { error, results } = await migrateMethods[method]();

  if (error) {
    console.error(error);
    process.exit(1);
  }

  results?.forEach((result) => {
    if (result.status === 'Success') {
      console.log(`migration "${result.migrationName}" was executed successfully`);
    } else if (result.status === 'Error') {
      console.error(`failed to execute migration "${result.migrationName}"`);
    }
  });
}

const [, , method, ...args] = process.argv;

switch (method) {
  case 'create':
    createMigration(args);
    break;
  case 'latest':
  case 'up':
  case 'down':
    migrate(method);
    break;
  default:
    console.error('Invalid Method Specified');
    process.exit(1);
}

