import * as amplitude from "@amplitude/analytics-browser";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ENV } from "./config/env";
import router from "./router";

function App() {
  useEffect(() => {
    amplitude.init(ENV.VITE_AMPLITUDE_API_KEY, {
      autocapture: true,
    });
  }, []);

  return (
    <main className="h-screen">
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
