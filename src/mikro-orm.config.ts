//for migration cli
import { PROD } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  entities: [Post],
  dbName: "lireddit",
  user: "postgres",
  password: "bugovnkl",
  type: "postgresql",
  debug: !PROD,
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
} as Parameters<typeof MikroORM.init>[0];
