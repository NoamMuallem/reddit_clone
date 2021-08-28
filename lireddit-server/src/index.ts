import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { PROD } from "./constants";
import { MyContext } from "./types";

const main = async () => {
  //!!!!! redis middleware must come before the apollo middleware so it will run before
  //becouse we wont access to it inside graphql!!!!!

  //mikro-orm for postgresql
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  //redis for storing and retriving sessions for user authentication
  //using the redis client only for sessions - so it stayes here
  let RedisStore = connectRedis(session);
  let redisClient = redis.createClient();

  const app = express();

  //redis - session middleware
  app.use(
    session({
      name: "liredit",
      store: new RedisStore({
        client: redisClient,
        //for every entery, give a limited timespent then when user interact with the server
        //we touch the db and the time spent resets, increese the number of requests to the db - so I disabled it
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true, //security resons - no access from fe js
        sameSite: "lax", //prevents csrf attack (https://www.imperva.com/learn/application-security/csrf-cross-site-request-forgery/)
        secure: PROD, //https - only on production
      },
      saveUninitialized: false,
      secret: "a very long and ugly hash here plz !jn#jn%jnD09)", //secret to sign the coockie
      resave: false, //dont continually ping redis
    })
  );

  //apollo graphql middleware
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    //pass req and res to gain access to req in resolvers and use coockies
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }), //spatiel variable that all the resolver have access to
  });
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server is up on localhost:4000");
  });
};

main().catch((error) => {
  console.log(error);
});
