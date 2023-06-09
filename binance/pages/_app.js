import '../styles/globals.css';

import { AuthProvider } from '../state/useAuth';

import Layout from '../components/common/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp
