import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Load Owl Framework before o-spreadsheet */}
        <script 
          src="/node_modules/@odoo/owl/dist/owl.js" 
          async
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}