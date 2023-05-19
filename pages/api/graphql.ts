import "reflect-metadata";
import path from "path";
import Cors from 'cors';
import {ApolloServer} from 'apollo-server-micro';
import { buildSchema, Authorized, MiddlewareInterface, ResolverData, NextFn, UseMiddleware } from 'type-graphql';
import { NextApiRequest, NextApiResponse } from 'next';
import {jwtVerify} from 'jose';

import { PrismaClient } from "@prisma/client";

import { resolvers, applyResolversEnhanceMap, User } from "~/prisma/generated/type-graphql";

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
    const book = await context.prisma.userBook.findUnique({ where: args.where });
    console.log(context.user);
    if (book?.userId !== context.user?.id) {
      throw new Error('Unauthorized');
    }
    return next();
  }
}

export async function verify(token: string, secret: string) {
  const {payload} = await jwtVerify(token, new TextEncoder().encode(secret));
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

const schema = await buildSchema({
  resolvers,
  emitSchemaFile: path.resolve("./graphql/schema.graphql"),
  validate: false,
  authChecker: () => true,
});

const prisma = new PrismaClient();

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }: { req: NextApiRequest }): Promise<Context> => {
    const token = req.cookies['authToken'] || req.headers.authorization || '';
    const user = await verify(token, 'secret') as unknown as User;
    return { prisma, user }
  },
});
 
export const config = {
  api: {bodyParser: false},
};

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  await prisma.$connect();
  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}
