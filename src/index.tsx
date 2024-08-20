import "@/setup/pwa";
import "core-js/stable";
import "./stores/__old/imports";
import "@/setup/ga";
import "@/assets/css/index.css";

import { StrictMode, Suspense } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { BrowserRouter, HashRouter } from "react-router-dom";

import { Loading } from "@/components/layout/Loading";
import { ErrorBoundary } from "@/pages/errors/ErrorBoundary";
import { LargeTextPart } from "@/pages/parts/util/LargeTextPart";
import App from "@/setup/App";
import { conf } from "@/setup/config";
import { ThemeProvider } from "@/stores/theme";

import { initializeChromecast } from "./setup/chromecast";

// initialize
initializeChromecast();

function LoadingScreen(props: { type: "user" | "lazy" }) {
  const mapping = {
    user: "screens.loadingUser",
    lazy: "screens.loadingApp",
  };
  const { t } = useTranslation();
  return (
    <LargeTextPart iconSlot={<Loading />}>
      {t(mapping[props.type] ?? "unknown.translation")}
    </LargeTextPart>
  );
}

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <Suspense fallback={<LoadingScreen type="lazy" />}>
          <ThemeProvider applyGlobal>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </Suspense>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
