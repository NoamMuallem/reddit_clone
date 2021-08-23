import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  Query,
  ObjectType,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";

//creating class with type-graphql decorators so we can define the types for the args in mutation
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

//creating class with type-graphql decorators so we can define the types the returned value
@ObjectType()
class UserResponse {
  //becouse it can be nullabale we need to explicidly pass type
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg(
      "options"
      //graphql inffered the type UsernamePasswordInput automatically - no need to explicidly pass type
      //, () => UsernamePasswordInput
    )
    options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username length nust be greater then 2",
          },
        ],
      };
    }

    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "password length must be greater then 2",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    try {
      //if fails, no id will be set to user and the function will return user with no id,
      //will throw "cannot return null for non-nullabale field"
      await em.persistAndFlush(user);
    } catch (error) {
      //duplicate user error
      if (error.code === "23505" || error.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "username already exists",
            },
          ],
        };
      }
    }
    return { user };
  }

  @Query(() => UserResponse)
  async login(
    @Arg(
      "options"
      //graphql inffered the type UsernamePasswordInput automatically - no need to explicidly pass type
      //, () => UsernamePasswordInput
    )
    options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    //check the database for a user with that username
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "cannot fint that username in the system",
          },
        ],
      };
    }
    //check if password does match
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    return {
      user,
    };
  }
}
