export const up = (knex) => {
  return knex.raw(`
    CREATE TABLE "sessions" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expired" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);

    ALTER TABLE "sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

    CREATE INDEX "IDX_session_expire" ON "sessions" ("expired");
  `)
}

export const down = (knex) => knex.schema.dropTableIfExists('sessions');