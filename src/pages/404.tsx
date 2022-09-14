import * as React from "react";

import DefaultLayout from "../components/layouts";

const NotFoundPage = () => {
  return (
    <DefaultLayout>
      <main>
        <div className="wrapper">
          <section>
            <h1>404</h1>
            <p>Nothing here</p>
          </section>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default NotFoundPage;
