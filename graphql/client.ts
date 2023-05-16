import { InMemoryCache, ApolloClient, ApolloLink, createHttpLink } from '@apollo/client';

const cache = new InMemoryCache();

const httpLink = createHttpLink({
  uri: `//localhost:3000/api/graphql`,
});
const link = ApolloLink.from([httpLink]);

export const client = new ApolloClient({
  cache,
  link,
});
