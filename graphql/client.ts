import { useMemo } from 'react';
import { InMemoryCache, ApolloClient, NormalizedCacheObject, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        userBooks: {
          merge(existing, incoming) {
            return incoming;
        }
      },
    }
  }
}
});

let apolloClient: ApolloClient<NormalizedCacheObject>;

const getOrCreateApolloClient = ({ initialCache }: { initialCache: NormalizedCacheObject }) => {
  if (apolloClient) {
    return apolloClient;
  }

  apolloClient = new ApolloClient<NormalizedCacheObject>({
    cache,
    link: createHttpLink({
      uri: '//localhost:3000/api/graphql',
      credentials: 'same-origin',
    }),
  });

  apolloClient.cache.restore(initialCache);
  return apolloClient;
};

export function useApollo({ initialCache }: { initialCache: NormalizedCacheObject }) {
  return useMemo(() => getOrCreateApolloClient({ initialCache }), [initialCache]);
}

export const getServerApolloClient = (token?: string) => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token,
      }
    }
  });

  return new ApolloClient<NormalizedCacheObject>({
    cache,
    ssrMode: true,
    link: authLink.concat(createHttpLink({
      uri: 'http://localhost:3000/api/graphql',
      credentials: 'same-origin',
    })),
  });
}
