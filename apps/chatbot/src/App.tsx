import * as amplitude from "@amplitude/analytics-browser";
import LogRocket from "logrocket";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ENV } from "./config/env";
import router from "./router";
import { isProduction } from "./utils/common";
import { trackError } from "./utils/error";

function App() {
  useEffect(() => {
    if (!isProduction) return;

    try {
      amplitude.init(ENV.VITE_AMPLITUDE_API_KEY, {
        autocapture: true,
      });
    } catch (error) {
      trackError(error, {
        action: "initialize_amplitude",
        component: "App",
      });
    }
  }, []);

  useEffect(() => {
    try {
      LogRocket.init(ENV.VITE_LOGROCKET_APP_ID);
    } catch (error) {
      trackError(error, {
        action: "initialize_logrocket",
        component: "App",
      });
    }
  }, []);

  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
