import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Google Maps API スクリプトを追加 */}
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCgPnyehv6XCUQeq78zkwXf7k62UMRg_tc&libraries=marker`}
            async
            defer
          ></script>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
