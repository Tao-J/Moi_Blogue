import * as React from "react";
import { graphql } from "gatsby";

import DefaultLayout from "../components/layouts";

const IndexPage = ({ data }) => {
  return (
    <DefaultLayout>
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
    </DefaultLayout>
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
