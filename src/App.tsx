import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Layout from "./components/Layout";
import routes from "tempo-routes";

// Lazy load components for better performance
const NewsFeed = lazy(() => import("./components/dashboard/NewsFeed"));
const AlertsPanel = lazy(() => import("./components/dashboard/AlertsPanel"));
const TradeTracker = lazy(() => import("./components/dashboard/TradeTracker"));
const PerformanceMetrics = lazy(
  () => import("./components/dashboard/PerformanceMetrics"),
);

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl">Loading...</p>
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/news"
            element={
              <Layout>
                <NewsFeed />
              </Layout>
            }
          />
          <Route
            path="/alerts"
            element={
              <Layout>
                <AlertsPanel />
              </Layout>
            }
          />
          <Route
            path="/trades"
            element={
              <Layout>
                <TradeTracker />
              </Layout>
            }
          />
          <Route
            path="/performance"
            element={
              <Layout>
                <PerformanceMetrics />
              </Layout>
            }
          />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
