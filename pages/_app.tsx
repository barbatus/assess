import { ApolloProvider } from "@apollo/client";

import type { AppProps } from "next/app";
import "../styles/globals.css";

import { useApollo } from "~/graphql/client";
import Layout from "~/components/layout";

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo({ initialCache: pageProps.apolloCache });

  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}
