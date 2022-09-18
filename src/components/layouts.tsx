import React from "react";

import Head from "./head";
import Footer from "./footer";
import { Link } from "gatsby";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Head />
      <main>
        <header>
          <h1>Moi Blogue</h1>
          <p>Blaying around</p>
        </header>
        <div id="banner">
          <span id="logo"></span>

          <Link to="/" className="button fork">
            <strong>Home</strong>
          </Link>

          <div className="downloads">
            <span>Section:</span>
            <ul>
              <li>
                <a className="button">Article</a>
              </li>
              <li>
                <a className="button">Portefeuille</a>
              </li>
              <li>
                <a href="https://tao-j.me" className="button">
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>

        {children}
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
