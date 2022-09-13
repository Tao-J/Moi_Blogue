import * as React from "react";
import { graphql } from "gatsby";

import Head from "../component/head";
import Footer from "../component/footer";

const IndexPage = ({ data }) => {
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
          </ul>
        </div>
      </div>

      <div className="wrapper">
        <section>
          <h2>Frontmatter</h2>
          <div className="wrapper">
            <ul className="entries">
              {data.allMarkdownRemark.edges.map((edge, i) => {
                let fm = edge.node.frontmatter;
                if (fm.low != "low")
                  return (
                    <li key={edge.node.id}>
                      <a href="">
                        <h3>{fm.title}</h3>
                        <p>{fm.title_real}</p>
                      </a>
                    </li>
                  );
              })}
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default IndexPage;
export const query = graphql`
  query md {
    allMarkdownRemark {
      edges {
        node {
          id
          frontmatter {
            title
            title_real
            low
            layout
          }
        }
      }
    }
  }
`;
