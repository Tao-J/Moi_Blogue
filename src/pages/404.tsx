import * as React from "react";

import DefaultLayout from "../layouts";

const NotFoundPage = () => {
  return (
    <DefaultLayout>
      <main>
        <div className="wrapper">
          <section>
            <h1>404</h1>
            <p>This model has not been not built yet.</p>
          </section>
        </div>
      </main>
    </DefaultLayout>
  );
};

export default NotFoundPage;
