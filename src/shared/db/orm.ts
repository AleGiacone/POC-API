import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { MySqlDriver } from "@mikro-orm/mysql";

export const ormPromise = MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  clientUrl: 'mysql://admin:admin@127.0.0.1:3308/Tasks',
  highlighter: new SqlHighlighter(),
  driver: MySqlDriver,
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: []
  }
});

export const syncSchema = async () => {
  const orm = await ormPromise;
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
  console.log("Schema synchronized");
};

await syncSchema()