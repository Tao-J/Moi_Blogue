import * as React from "react";
import { Link } from "gatsby";

const PostsList = ({ data, series }) => {
  return (
    <div className="wrapper">
      <section>
        <h2>{series[1]}</h2>
        <div className="wrapper">
          <ul className="entries">
            {data.posts.edges.map((edge, _) => {
              let fm = edge.node.frontmatter;
              if (fm.series.includes(series[0]))
                return (
                  <li key={edge.node.id}>
                    <Link to={edge.node.parent.name}>
                      {/* {fm.lang} */}
                      <h3>{fm.title_en}</h3>
                      <p>{fm.title_cn}</p>
                    </Link>
                  </li>
                );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default PostsList;
