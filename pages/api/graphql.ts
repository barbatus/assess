import "reflect-metadata";
import {ApolloServer} from 'apollo-server-micro';
import { buildSchema } from 'type-graphql';
import path from "path";
import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

import { PrismaClient } from "@prisma/client";

import { resolvers } from "~/prisma/generated/type-graphql";

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
  prisma: PrismaClient;
}

const schema = await buildSchema({
  resolvers,
  emitSchemaFile: path.resolve("./graphql/schema.graphql"),
  validate: false,
});

const prisma = new PrismaClient();

const apolloServer = new ApolloServer({
  schema,
  context: (): Context => ({ prisma }),
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
