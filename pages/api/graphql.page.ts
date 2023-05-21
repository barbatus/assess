import "reflect-metadata";
import path from "path";
import Cors from "cors";
import { ApolloServer } from "apollo-server-micro";
import {
  buildSchema,
  Authorized,
  MiddlewareInterface,
  ResolverData,
  NextFn,
  UseMiddleware,
} from "type-graphql";
import { NextApiRequest, NextApiResponse } from "next";
import { jwtVerify } from "jose";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import Redis, { RedisOptions } from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

import { PrismaClient } from "@prisma/client";

import { resolvers, applyResolversEnhanceMap, User } from "~/prisma/generated/type-graphql";
import { CustomUserBooksResolver } from "~/graphql/resolvers";

const cors = Cors();

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: typeof cors) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

interface Context {
  user: User | null;
  prisma: PrismaClient;
}

export class CheckBookAccess implements MiddlewareInterface<Context> {
  async use({ context, args }: ResolverData<Context>, next: NextFn) {
    if (!args.where) return next();
    const book = await context.prisma.userBook.findUnique({ where: args.where });
    if (book?.userId !== context.user?.id) {
      throw new Error("Unauthorized");
    }
    return next();
  }
}

export async function verify(token: string, secret: string) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return payload;
}

applyResolversEnhanceMap({
  User: {
    _all: [Authorized()],
  },
  UserBook: {
    _query: [Authorized()],
    _mutation: [UseMiddleware(CheckBookAccess)],
  },
  Book: {
    _all: [Authorized()],
  },
});

const options: RedisOptions = {
  host: "127.0.0.1",
  port: 6379,
  retryStrategy: (times) => Math.max(times * 100, 3000),
};

const pubSub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

const schema = await buildSchema({
  resolvers: [...resolvers, CustomUserBooksResolver],
  emitSchemaFile: path.resolve("./graphql/schema.graphql"),
  validate: false,
  pubSub,
  authChecker: ({ context }: ResolverData<Context>) => !!context.user,
});

const prisma = new PrismaClient();

const apolloServer = new ApolloServer({
  schema,
  persistedQueries: false,
  context: async ({ req }: { req: NextApiRequest }): Promise<Context> => {
    const token = req.cookies["authToken"] || req.headers.authorization || "";
    const user = (await verify(token, "secret")) as unknown as User;
    return { prisma, user };
  },
  plugins: [
    {
      async serverWillStart(...asdf) {
        return {
          async drainServer() {
            if (graphqlWSS) {
              await graphqlWSS.dispose();
            }
          },
        };
      },
    },
  ],
});

export const config = {
  api: { bodyParser: false },
};

const startServer = apolloServer.start();
let graphqlWSS: any;
let apolloHandler: ReturnType<ApolloServer["createHandler"]>;

let wsServer: WebSocketServer;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!apolloHandler) {
    wsServer = new WebSocketServer({
      // @ts-ignore
      server: res.socket.server,
      path: "/api/graphql",
    });
    /* eslint-disable  react-hooks/rules-of-hooks */
    graphqlWSS = useServer({ schema }, wsServer);
    await startServer;
    apolloHandler = apolloServer.createHandler({ path: "/api/graphql" });
  }
  await runMiddleware(req, res, cors);
  await prisma.$connect();
  await apolloHandler(req, res);
}
