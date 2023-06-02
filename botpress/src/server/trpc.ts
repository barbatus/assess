import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';

import { appRouter } from './routers/_app';
import { createContext } from './context';

createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
}).listen(2022);
