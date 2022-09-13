import * as React from "react";

import Head from "../component/head";
import Footer from "../component/footer";

const IndexPage = () => {
  return (
    <main>
      <Head />
      <header>
        <h1>Moi Blogue</h1>
        <p>Blaying around</p>
      </header>
      <div id="banner">
        <span id="logo"></span>

        <a href="/" className="button fork">
          <strong>Home</strong>
        </a>

        <div className="downloads">
          <span>Section:</span>
          <ul>
            <li>
              <li>
                <a className="button">Article</a>
              </li>
              <li>
                <a className="button">Portefeuille</a>
              </li>
              <li>
                <a href="http://tao-j.me" className="button">
                  About
                </a>
              </li>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrapper">
        <section></section>
      </div>
      <Footer />
    </main>
  );
};

export default IndexPage;
