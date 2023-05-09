import path from "path";

export const createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      posts: allMarkdownRemark(
        limit: 2000
        sort: { fileAbsolutePath: DESC }
        filter: { frontmatter: { layout: { eq: "post" } } }
      ) {
        edges {
          node {
            id
            parent {
              ... on File {
                name
                extension
                ext
              }
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const blogPostTemplate = path.resolve(`src/components/post.tsx`);
  result.data.posts.edges.forEach(({ node }) => {
    const path = node.parent.name;
    createPage({
      path,
      component: blogPostTemplate,
      context: {
        id: node.id,
      },
    });
  });
};
