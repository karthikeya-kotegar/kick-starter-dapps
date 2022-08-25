import Head from "next/head";
import React from "react";
import { Container } from "semantic-ui-react";

import Header from "./Header";

const Layout = (props) => {
  return (
    <Container>
      {/* next/head will add the data to html header */}
      <Head>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <Header />
      {/* component between Layout tags*/}
      {props.children}
    </Container>
  );
};

export default Layout;
