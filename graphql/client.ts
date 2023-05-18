import { useMemo } from 'react';
import { InMemoryCache, ApolloClient, NormalizedCacheObject, createHttpLink } from '@apollo/client';

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

export const getServerApolloClient = () => {
  return new ApolloClient<NormalizedCacheObject>({
    cache,
    ssrMode: true,
    link: createHttpLink({
      uri: 'http://localhost:3000/api/graphql',
      credentials: 'same-origin',
    }),
  });
}
