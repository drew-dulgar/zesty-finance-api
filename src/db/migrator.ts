import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import {
  FileMigrationProvider,
  type MigrationResultSet,
  Migrator,
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

export const createMigration = async (
  migrationName: string[],
): Promise<void> => {
  const migrationCreatedAt = Date.now();
  const migrationFileName = kebabCase(
    `${migrationCreatedAt} ${migrationName.join(' ')}`,
  );
  const migrationFilePath = `${path.join(migrationsPath, migrationFileName).replace('/dist', '')}.ts`;

  const migrationFileContent = `import { Kysely } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  // Migration code
};

export const down = async (db: Kysely<any>): Promise<void> => {
  // Migration code
};`;

  try {
    await fs.writeFile(migrationFilePath, migrationFileContent);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export const migrate = async (method: 'up' | 'down' | 'latest' = 'latest') => {
  let migration: MigrationResultSet = { error: null, results: [] };
  let message: string = 'migrated';

  switch (method) {
    case 'up':
      migration = await migrator.migrateUp();
      break;
    case 'down':
      migration = await migrator.migrateDown();
      message = 'migrated down';
      break;
    case 'latest':
      migration = await migrator.migrateToLatest();
      break;
  }

  const { error, results } = migration;

  if (error) {
    console.error(error);
  }

  results?.forEach((result) => {
    if (result.status === 'Success') {
      console.log(`"${result.migrationName}" was ${message} successfully.`);
    } else if (result.status === 'Error') {
      console.error(`"${result.migrationName}" failed to ${message}.`);
    }
  });

  if (error) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

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
