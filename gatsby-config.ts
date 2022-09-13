import type { GatsbyConfig } from "gatsby";
const config: GatsbyConfig = {
  siteMetadata: {
    title: `Moi Blogue`,
    siteUrl: `https://blay.tao-j.me`,
    description: `Blaying around`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/_posts/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/images/`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [],
      },
    },
  ],
};
export default config;
