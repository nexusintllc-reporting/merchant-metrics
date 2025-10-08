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

// Modern SVG icons
const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18"/>
    <path d="m19 9-5 5-4-4-3 3"/>
  </svg>
);

const ProductIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <path d="M3 9h18"/>
    <path d="M3 15h18"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

// Modern Loading Component
function GlobalLoadingProgress() {
  return (
    <div className="modern-loading">
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-icon">📊</div>
          <h2>Nexus Analytics</h2>
        </div>
        <div className="loading-animation">
          <div className="pulse-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p>Loading your business intelligence...</p>
        </div>
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
        
        {/* Modern Mobile-First CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            [data-runtime-loading] {
              display: none !important;
            }

            /* ==================== MODERN MOBILE DESIGN SYSTEM ==================== */
            
            /* Base Reset */
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              background: #0f172a;
              color: #f8fafc;
              line-height: 1.6;
            }

            /* ==================== MODERN HEADER ==================== */
            .app-header {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              z-index: 1000;
              background: rgba(15, 23, 42, 0.95);
              backdrop-filter: blur(20px);
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding: 1rem;
            }

            .header-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              max-width: 1200px;
              margin: 0 auto;
            }

            .brand {
              display: flex;
              align-items: center;
              gap: 0.75rem;
            }

            .logo {
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #6366f1, #8b5cf6);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.25rem;
              color: white;
              box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            }

            .brand-text h1 {
              font-size: 1.25rem;
              font-weight: 700;
              color: white;
              margin: 0;
              background: linear-gradient(135deg, #f8fafc, #cbd5e1);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            .brand-text p {
              font-size: 0.75rem;
              color: #94a3b8;
              margin: 0;
            }

            .mobile-menu-btn {
              display: none;
              background: none;
              border: none;
              color: #cbd5e1;
              padding: 0.5rem;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .mobile-menu-btn:hover {
              background: rgba(255, 255, 255, 0.1);
            }

            .nav-menu {
              display: flex;
              gap: 0.5rem;
              align-items: center;
            }

            .nav-link {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.75rem 1.25rem;
              border-radius: 12px;
              text-decoration: none;
              font-weight: 600;
              font-size: 0.875rem;
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
            }

            .nav-link::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
              transition: left 0.5s ease;
            }

            .nav-link:hover::before {
              left: 100%;
            }

            .nav-link:not(.active) {
              background: rgba(255, 255, 255, 0.05);
              color: #cbd5e1;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .nav-link.active {
              background: linear-gradient(135deg, #6366f1, #8b5cf6);
              color: white;
              box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
              transform: translateY(-1px);
            }

            .nav-link svg {
              width: 18px;
              height: 18px;
            }

            /* ==================== MAIN CONTENT ==================== */
            .app-main {
              margin-top: 80px;
              padding: 1.5rem 1rem;
              min-height: calc(100vh - 80px);
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            }

            /* ==================== MODERN LOADING ==================== */
            .modern-loading {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 10000;
            }

            .loading-content {
              text-align: center;
              animation: fadeInUp 0.6s ease-out;
            }

            .loading-logo {
              margin-bottom: 2rem;
            }

            .logo-icon {
              font-size: 3rem;
              margin-bottom: 1rem;
              animation: bounce 2s infinite;
            }

            .loading-logo h2 {
              font-size: 1.5rem;
              font-weight: 700;
              background: linear-gradient(135deg, #6366f1, #8b5cf6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin: 0;
            }

            .loading-animation p {
              color: #94a3b8;
              margin-top: 1rem;
              font-size: 0.9rem;
            }

            .pulse-dots {
              display: flex;
              gap: 0.5rem;
              justify-content: center;
              margin-bottom: 1rem;
            }

            .dot {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: #6366f1;
              animation: pulse 1.4s ease-in-out infinite both;
            }

            .dot:nth-child(2) {
              animation-delay: 0.2s;
            }

            .dot:nth-child(3) {
              animation-delay: 0.4s;
            }

            /* ==================== MOBILE RESPONSIVE ==================== */
            @media (max-width: 768px) {
              .app-header {
                padding: 0.75rem 1rem;
              }

              .mobile-menu-btn {
                display: block;
              }

              .nav-menu {
                position: fixed;
                top: 72px;
                left: 0;
                right: 0;
                background: rgba(15, 23, 42, 0.98);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding: 1rem;
                flex-direction: column;
                gap: 0.5rem;
                transform: translateY(-100%);
                opacity: 0;
                transition: all 0.3s ease;
                pointer-events: none;
              }

              .nav-menu.open {
                transform: translateY(0);
                opacity: 1;
                pointer-events: all;
              }

              .nav-link {
                width: 100%;
                justify-content: center;
                padding: 1rem;
              }

              .app-main {
                margin-top: 72px;
                padding: 1rem;
              }

              .brand-text h1 {
                font-size: 1.1rem;
              }

              .brand-text p {
                font-size: 0.7rem;
              }

              .logo {
                width: 36px;
                height: 36px;
                font-size: 1.1rem;
              }
            }

            @media (max-width: 480px) {
              .app-header {
                padding: 0.5rem;
              }

              .brand {
                gap: 0.5rem;
              }

              .brand-text h1 {
                font-size: 1rem;
              }

              .logo {
                width: 32px;
                height: 32px;
                font-size: 1rem;
              }

              .app-main {
                margin-top: 64px;
                padding: 0.75rem;
              }
            }

            /* Tablet Styles */
            @media (min-width: 769px) and (max-width: 1024px) {
              .app-header {
                padding: 1rem 1.5rem;
              }

              .app-main {
                padding: 2rem 1.5rem;
              }

              .nav-link {
                padding: 0.75rem 1rem;
                font-size: 0.8rem;
              }
            }

            /* ==================== ANIMATIONS ==================== */
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
              }
              40% {
                transform: translateY(-10px);
              }
              60% {
                transform: translateY(-5px);
              }
            }

            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.1);
                opacity: 0.7;
              }
            }

            /* ==================== SCREENSHOT TOOL POSITION ==================== */
            .screenshot-tool-container {
              position: fixed;
              bottom: 1rem;
              right: 1rem;
              z-index: 9999;
            }

            /* Smooth scrolling */
            html {
              scroll-behavior: smooth;
            }

            /* Custom scrollbar */
            ::-webkit-scrollbar {
              width: 6px;
            }

            ::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
            }

            ::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, #6366f1, #8b5cf6);
              border-radius: 3px;
            }
          `
        }} />
      </head>
      <body>
        {/* Show modern loading screen during navigation */}
        {navigation.state === 'loading' && <GlobalLoadingProgress />}
        
        {/* Only show main app when not loading */}
        {navigation.state !== 'loading' && (
          <AppProvider i18n={enTranslations}>
            <header className="app-header">
              <div className="header-content">
                <div className="brand">
                  <div className="logo">📊</div>
                  <div className="brand-text">
                    <h1>Nexus Analytics</h1>
                    <p>Real-time Business Intelligence</p>
                  </div>
                </div>

                <button className="mobile-menu-btn" id="mobileMenuBtn">
                  <MenuIcon />
                </button>

                <nav className="nav-menu" id="navMenu">
                  <NavLink
                    to="/app"
                    end
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <AnalyticsIcon />
                    <span>Orders Dashboard</span>
                  </NavLink>

                  <NavLink
                    to="/products"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <ProductIcon />
                    <span>Products</span>
                  </NavLink>
                </nav>
              </div>
            </header>

            <main className="app-main">
              <Outlet />
            </main>

            {/* Floating Screenshot Button */}
            <div className="screenshot-tool-container">
              <ScreenshotTool />
            </div>

            <ScrollRestoration />
            <Scripts />

            {/* Mobile Menu Script */}
            <script dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener('DOMContentLoaded', function() {
                  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                  const navMenu = document.getElementById('navMenu');
                  
                  if (mobileMenuBtn && navMenu) {
                    mobileMenuBtn.addEventListener('click', function() {
                      navMenu.classList.toggle('open');
                    });
                    
                    // Close menu when clicking outside
                    document.addEventListener('click', function(event) {
                      if (!event.target.closest('.app-header')) {
                        navMenu.classList.remove('open');
                      }
                    });
                  }
                });
              `
            }} />
          </AppProvider>
        )}
      </body>
    </html>
  );
}