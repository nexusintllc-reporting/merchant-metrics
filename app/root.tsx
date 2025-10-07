import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import ScreenshotTool from "./components/ScreenshotTool";

export const links: LinksFunction = () => [
  { 
    rel: "stylesheet", 
    href: polarisStyles 
  },
  {
    rel: "preconnect",
    href: "https://cdn.shopify.com/",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css",
  },
];

// Simple SVG icons as fallback
const AnalyticsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 00-6 6 6 6 0 006 6 6 6 0 006-6 6 6 0 00-6-6zm-1 6a1 1 0 112 0 1 1 0 01-2 0zm2-4a1 1 0 10-2 0v4a1 1 0 102 0V6z"/>
  </svg>
);

const ProductIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4zm0 6a2 2 0 100 4h12a2 2 0 100-4H4zm0 6a2 2 0 100 4h12a2 2 0 100-4H4z"/>
  </svg>
);

// Generic Loading Component
function GlobalLoadingProgress() {
  const loadingSteps = [
    "Loading your dashboard...",
    "Analyzing store data...", 
    "Processing analytics...",
    "Generating insights...",
    "Finalizing your view..."
  ];

  return (
    <div className="global-loading-progress">
      <div className="global-loading-header">
        <h2>Loading Nexus Analytics</h2>
        <p>Preparing your business intelligence dashboard...</p>
      </div>
      
      <div className="global-progress-bar-container">
        <div className="global-progress-bar">
          <div className="global-progress-fill"></div>
        </div>
      </div>

      <div className="global-loading-steps">
        {loadingSteps.map((step, index) => (
          <div key={index} className="global-loading-step">
            <div className="global-step-indicator">⟳</div>
            <div className="global-step-text">{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const navigation = useNavigation();
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        
        {/* CSS to hide Remix's default loading spinner */}
        <style dangerouslySetInnerHTML={{
          __html: `
            [data-runtime-loading] {
              display: none !important;
            }
          `
        }} />
      </head>
      <body>
        {/* Show full loading screen during navigation */}
        {navigation.state === 'loading' && <GlobalLoadingProgress />}
        
        {/* Only show main app when not loading */}
        {navigation.state !== 'loading' && (
          <AppProvider i18n={enTranslations}>
            <header
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                background: "linear-gradient(135deg, #1e293b 0%, #374151 100%)",
                borderBottom: "1px solid #475569",
                padding: "0.75rem 2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}>
                  <AnalyticsIcon />
                </div>
                <div>
                  <h1 style={{ fontSize: "1.25rem", fontWeight: "700", color: "white", margin: 0 }}>
                    Nexus Analytics
                  </h1>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
                    Real-time Business Intelligence
                  </p>
                </div>
              </div>

              <nav style={{ display: "flex", gap: "0.5rem" }}>
                <NavLink
                  to="/app"
                  end
                  style={({ isActive }) => ({
                    padding: "0.5rem 1.25rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    color: isActive ? "#1e293b" : "#e2e8f0",
                    background: isActive ? "white" : "transparent",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    pointerEvents: isActive ? "none" : "auto",
                    opacity: isActive ? 0.7 : 1,
                    cursor: isActive ? "default" : "pointer",
                  })}
                >
                  <AnalyticsIcon />
                  Orders
                </NavLink>

                <NavLink
                  to="/products"
                  style={({ isActive }) => ({
                    padding: "0.5rem 1.25rem",
                    borderRadius: "6px",
                    textDecoration: "none",
                    color: isActive ? "#1e293b" : "#e2e8f0",
                    background: isActive ? "white" : "transparent",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    pointerEvents: isActive ? "none" : "auto",
                    opacity: isActive ? 0.7 : 1,
                    cursor: isActive ? "default" : "pointer",
                  })}
                >
                  <ProductIcon />
                  Products
                </NavLink>
              </nav>
            </header>

            <main style={{ padding: "2rem", background: "#f8fafc", minHeight: "calc(100vh - 80px)" }}>
              <Outlet />
            </main>

            {/* Floating Screenshot Button */}
            <div style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 9999
            }}>
              <ScreenshotTool />
            </div>

            <ScrollRestoration />
            <Scripts />
          </AppProvider>
        )}

        {/* Global Loading Styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .global-loading-progress {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: white;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              z-index: 10000;
              padding: 2rem;
            }

            .global-loading-header h2 {
              margin: 0 0 8px 0;
              color: #2c3e50;
              font-size: 28px;
              text-align: center;
            }

            .global-loading-header p {
              color: #6c757d;
              margin: 0 0 40px 0;
              font-size: 16px;
              text-align: center;
            }

            .global-progress-bar-container {
              width: 100%;
              max-width: 500px;
              margin-bottom: 40px;
            }

            .global-progress-bar {
              width: 100%;
              height: 8px;
              background: #e9ecef;
              border-radius: 4px;
              overflow: hidden;
              margin-bottom: 8px;
            }

            .global-progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #007bff, #0056b3);
              border-radius: 4px;
              animation: globalLoadingProgress 2s ease-in-out infinite;
            }

            @keyframes globalLoadingProgress {
              0% {
                transform: translateX(-100%);
              }
              50% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(100%);
              }
            }

            .global-loading-steps {
              display: flex;
              flex-direction: column;
              gap: 16px;
              max-width: 500px;
              width: 100%;
            }

            .global-loading-step {
              display: flex;
              align-items: center;
              gap: 16px;
              padding: 12px 0;
            }

            .global-step-indicator {
              font-size: 18px;
              color: #007bff;
              animation: globalSpin 1.5s linear infinite;
            }

            @keyframes globalSpin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }

            .global-step-text {
              color: #495057;
              font-size: 16px;
              text-align: left;
              flex: 1;
            }
          `
        }} />
      </body>
    </html>
  );
}
