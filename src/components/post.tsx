import { graphql } from "gatsby";
import * as React from "react";

import DefaultLayout from "./layouts";

export default function PostPage({ data }) {
  const post = data.markdownRemark;
  return (
    <DefaultLayout>
      <main>
        <div className="wrapper">
          <section>
            <h1>{post.frontmatter.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </section>
        </div>
      </main>
    </DefaultLayout>
  );
}

export const query = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        title
      }
    }
  }
`;
