import { Post } from "../entities/Post";
import { Resolver, Query, Mutation, Ctx, Arg, Int } from "type-graphql";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
  //return an array of posts
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  //return spesific post
  @Query(() => Post, { nullable: true })
  post(
    //(graphql type - what will be shown in the sraphql query) typescript type
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  //create new post
  @Mutation(() => Post)
  async createPost(
    //(graphql type - wat will be shown in the sraphql query) typescript type
    @Arg("title", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  //update post
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    //(graphql type - wat will be shown in the sraphql query) typescript type
    @Arg("id", () => Int) id: number,
    //in case there are more then one property that can be updated, title not neccessery will have value becouse other filed will
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      em.persistAndFlush(post);
    }
    return post;
  }

  //delete post
  @Mutation(() => Boolean)
  async deletePost(
    //(graphql type - wat will be shown in the sraphql query) typescript type
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id });
    return true;
  }
}
