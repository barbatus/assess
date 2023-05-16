import { ApolloProvider } from "@apollo/client";

import type { AppProps } from "next/app";
import "../styles/globals.css";

import { client } from "~/graphql/client";
import Layout from "~/components/layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}
