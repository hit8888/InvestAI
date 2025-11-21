import React from "react";
import ReactDOM from "react-dom/client";
import { ChatInterface } from "./components/ChatInterface";
import "./main.css";

ReactDOM.createRoot(document.getElementById("sevak-client-root")!).render(
  <React.StrictMode>
    <div className="h-screen w-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sevak Client
          </h1>
          <p className="text-gray-600">Sevak Chat Interface</p>
        </div>
        <div className="h-[700px] rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
          <ChatInterface
            serverUrl={
              import.meta.env.VITE_SEVAK_SERVER_URL || "http://localhost:8080"
            }
            placeholder="Ask me anything about the dashboard..."
            showConnectionStatus={true}
          />
        </div>
      </div>
    </div>
  </React.StrictMode>,
);
