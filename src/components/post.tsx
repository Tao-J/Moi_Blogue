import { graphql } from "gatsby";
import * as React from "react";

import DefaultLayout from "./layouts";

export default function PostPage({ data }) {
  const post = data.markdownRemark;
  const fm = post.frontmatter;
  let title = fm.lang == "en" ? fm.title_en : fm.title_cn;
  return (
    <DefaultLayout>
      <main>
        <div className="wrapper">
          <section>
            <h1>{title}</h1>
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
        title_en
        title_cn
        lang
      }
    }
  }
`;
