import { RouterProvider } from "react-router-dom";
import router from "./router";

function App() {
  return (
    <main className="h-screen">
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
