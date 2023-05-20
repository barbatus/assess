import { useMemo } from "react";
import {
  InMemoryCache,
  ApolloClient,
  NormalizedCacheObject,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        userBooks: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

let apolloClient: ApolloClient<NormalizedCacheObject>;

const getOrCreateApolloClient = ({ initialCache }: { initialCache: NormalizedCacheObject }) => {
  if (apolloClient) {
    return apolloClient;
  }

  const isBrowser = typeof window !== "undefined";
  const httpLink = createHttpLink({
    uri: "//localhost:3000/api/graphql",
    credentials: "same-origin",
  });

  const splitLink = isBrowser
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" && definition.operation === "subscription"
          );
        },
        new GraphQLWsLink(
          createClient({
            url: "ws://localhost:3000/api/graphql",
          }),
        ),
        httpLink,
      )
    : httpLink;

  apolloClient = new ApolloClient<NormalizedCacheObject>({
    cache,
    link: splitLink,
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
      },
    };
  });

  return new ApolloClient<NormalizedCacheObject>({
    cache,
    ssrMode: true,
    link: authLink.concat(
      createHttpLink({
        uri: "http://localhost:3000/api/graphql",
        credentials: "same-origin",
      }),
    ),
  });
};
