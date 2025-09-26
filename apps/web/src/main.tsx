import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast"; // Import Toaster
import { config } from "./lib/wagmi.ts";
import App from "./App.tsx";

import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton CSS
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" reverseOrder={false} />{" "}
        {/* Add Toaster */}
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
