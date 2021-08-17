import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
//import { Post } from "./entities/Post";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  //create new post
  //const post = orm.em.create(Post, { title: "my first post" });
  //await orm.em.persistAndFlush(post);

  //retrive all posts
  //const posts = await orm.em.find(Post, {});
  //console.log(posts);
};

main().catch((error) => {
  console.log(error);
});
