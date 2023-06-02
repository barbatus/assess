import "reflect-metadata";
import {
  Resolver,
  Mutation,
  Arg,
  FieldResolver,
  Ctx,
  Root,
  InputType,
  Field,
  Int,
  PubSub,
  type Publisher,
  Subscription,
  ObjectType,
} from "type-graphql";

import { UserBook, UserBookCreateInput } from "../prisma/generated/type-graphql";

import { PrismaClient } from "@prisma/client";

interface Context {
  prisma: PrismaClient;
}

@ObjectType()
export class FinishEventPayload {
  @Field((_type) => Int)
  userId!: number;

  @Field((_type) => String)
  userName!: string;

  @Field((_type) => String)
  bookTitle!: string;

  @Field((_type) => Int)
  rating!: number;
}

@InputType()
export class FinishInput implements Partial<UserBook> {
  @Field((_type) => Int, {
    nullable: false,
  })
  id!: number;

  @Field((_type) => Int, {
    nullable: false,
  })
  rating!: number;
}

@Resolver((of) => UserBook)
export class CustomUserBooksResolver {
  @Mutation((returns) => UserBook)
  async finishBook(
    @Arg("book") input: FinishInput,
    @Ctx() { prisma }: Context,
    @PubSub("finish") event: Publisher<FinishEventPayload>,
  ) {
    const userBook = await prisma.userBook.findUnique({
      where: { id: input.id },
      include: {
        book: true,
        user: true,
      },
    });
    await event({
      userId: userBook!.userId,
      userName: userBook!.user.name,
      bookTitle: userBook!.book.title,
      rating: input.rating,
    });
    return userBook;
  }

  @Subscription((returns) => FinishEventPayload, {
    topics: "finish",
  })
  newFinish(@Root() event: FinishEventPayload): FinishEventPayload {
    return event;
  }
}
