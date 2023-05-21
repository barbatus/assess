import { useEffect } from "react";
import { useRouter } from "next/router";
import { ApolloProvider } from "@apollo/client";
import { useTranslation } from "react-i18next";

import type { AppProps } from "next/app";
import "../styles/globals.css";

import "~/lib/i18n";
import { useApollo } from "~/graphql/client";
import Layout from "~/components/layout";
import { AuthProvider } from "~/hooks/auth";

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo({ initialCache: pageProps.apolloCache });
  const { i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    i18n.changeLanguage(router.locale);
  }, [router.locale]);

  return (
    <AuthProvider initialUser={pageProps.initialUser}>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </AuthProvider>
  );
}
