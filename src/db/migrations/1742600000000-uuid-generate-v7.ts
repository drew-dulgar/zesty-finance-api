import { type Kysely, sql } from 'kysely';

export const up = async (db: Kysely<any>): Promise<void> => {
  await sql`
    CREATE OR REPLACE FUNCTION uuid_generate_v7()
    RETURNS uuid
    LANGUAGE plpgsql
    AS $$
    DECLARE
      ts_ms   BIGINT;
      ts_hex  TEXT;
      rnd_hex TEXT;
      result  TEXT;
    BEGIN
      ts_ms   := (EXTRACT(EPOCH FROM clock_timestamp()) * 1000)::BIGINT;
      ts_hex  := lpad(to_hex(ts_ms), 12, '0');
      rnd_hex := replace(gen_random_uuid()::text, '-', '');

      -- layout: 48-bit timestamp | version (7) | 12-bit rand_a | variant+rand_b
      result := ts_hex
             || '7'
             || substr(rnd_hex, 14, 3)
             || substr(rnd_hex, 17, 16);

      RETURN (
        substr(result, 1, 8)  || '-' ||
        substr(result, 9, 4)  || '-' ||
        substr(result, 13, 4) || '-' ||
        substr(result, 17, 4) || '-' ||
        substr(result, 21, 12)
      )::uuid;
    END;
    $$;
  `.execute(db);
};

export const down = async (db: Kysely<any>): Promise<void> => {
  await sql`DROP FUNCTION IF EXISTS uuid_generate_v7`.execute(db);
};
