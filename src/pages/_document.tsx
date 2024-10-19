// pages/_document.tsx

import { Html, Head, Main, NextScript } from 'next/document';

const MyDocument = () => {
  return (
    <Html>
      <Head>
        {/* Add any custom meta tags or other content here */}
        <meta name="referrer" content="no-referrer" />
        <meta name="referrer-policy" content="no-referrer" />
        <meta http-equiv="hardware-acceleration" content="off"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
