import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { makeServer } from "./mirage/server";
import { ThemeProvider } from "./context/theme-context";
import { SidebarProvider } from "./components/ui/sidebar";

makeServer();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      refetchOnMount: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
