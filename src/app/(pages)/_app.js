import React from 'react';
import { UserIdProvider } from '../../components/UserIdContext/UserIdContext'; // Adjust import path

function MyApp({ Component, pageProps }) {
  return (
    <UserIdProvider>
      <Component {...pageProps} />
    </UserIdProvider>
  );
}

export default MyApp;
