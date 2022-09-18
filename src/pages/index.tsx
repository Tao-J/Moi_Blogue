import * as React from "react";
import { graphql, Link } from "gatsby";

import DefaultLayout from "../components/layouts";
import PostsList from "../components/posts_list";

const displaySeries = [
  ["essay", "Posts"],
  ["riscv", "RISC-V"],
  ["dg", "Digital Garden"],
];

const IndexPage = ({ data }) => {
  return (
    <DefaultLayout>
      {displaySeries.map((series) => {
        return (
          <PostsList key={series[0]} data={data} series={series}></PostsList>
        );
      })}
    </DefaultLayout>
  );
};

export default IndexPage;
export const query = graphql`
  query md {
    posts: allMarkdownRemark(
      limit: 2000
      sort: { order: DESC, fields: [fileAbsolutePath] }
      filter: { frontmatter: { layout: { eq: "post" } } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title_en
            title_cn
            layout
            series
            lang
          }
          parent {
            ... on File {
              name
            }
          }
        }
      }
    }
  }
`;
