import { addSerializer } from '@tanstack/bling/client';

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import "../styles/globals.css";

import "~/lib/i18n";
import Layout from "~/components/layout";
import { AuthProvider } from "~/hooks/auth";

import Routes from './routes';

addSerializer({
  apply: (req) => req instanceof Request,
  serialize: (value) => '$request',
});

export function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

  return (
    <AuthProvider initialUser={null}>
        <Layout>
          <Routes />
        </Layout>
    </AuthProvider>
  );
}