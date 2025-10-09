import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useLocation,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import ScreenshotTool from "./components/ScreenshotTool";
import { useEffect, useRef } from "react";

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

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// Generic Loading Component with smaller mobile text
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
  const location = useLocation();
  const navMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu function
  const closeMobileMenu = () => {
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (navMenu) {
      navMenu.classList.remove('mobile-open');
    }
    
    if (mobileMenuBtn) {
      const menuIcon = mobileMenuBtn.querySelector('svg');
      if (menuIcon) {
        menuIcon.innerHTML = '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
      }
    }
  };

  // Toggle mobile menu function
  const toggleMobileMenu = () => {
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (navMenu && mobileMenuBtn) {
      const isOpen = navMenu.classList.contains('mobile-open');
      
      if (isOpen) {
        closeMobileMenu();
      } else {
        navMenu.classList.add('mobile-open');
        const menuIcon = mobileMenuBtn.querySelector('svg');
        if (menuIcon) {
          menuIcon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
        }
      }
    }
  };

  // Initialize mobile menu functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navMenu = document.getElementById('navMenu');
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      
      if (navMenu && 
          mobileMenuBtn && 
          !navMenu.contains(event.target as Node) && 
          !mobileMenuBtn.contains(event.target as Node) &&
          navMenu.classList.contains('mobile-open')) {
        closeMobileMenu();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    };

    // Set body padding for fixed header
    const header = document.getElementById('rootHeader');
    if (header) {
      document.body.style.paddingTop = header.offsetHeight + 'px';
    }

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        
        {/* CSS for Root Header Only */}
        <style dangerouslySetInnerHTML={{
          __html: `
            [data-runtime-loading] {
              display: none !important;
            }

            /* ==================== ROOT HEADER ONLY - MODERN STICKY DESIGN ==================== */
            
            /* Base body styles to accommodate sticky header */
            body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            /* Main app container */
            .app-container {
              min-height: 100vh;
              background: #f8fafc;
            }

            /* Fixed Sticky Header */
            .root-header {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              z-index: 1000;
              background: rgba(15, 23, 42, 0.98);
              backdrop-filter: blur(20px);
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding: 1rem;
              transition: all 0.3s ease;
            }

            .header-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              max-width: 1400px;
              margin: 0 auto;
            }

            /* Brand Logo - Clickable */
            .brand-link {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              text-decoration: none;
              cursor: pointer;
              transition: transform 0.2s ease;
            }

            .brand-link:hover {
              transform: translateY(-1px);
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

            /* Mobile Menu Button */
            .mobile-menu-btn {
              display: none;
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: #cbd5e1;
              padding: 0.5rem;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .mobile-menu-btn:hover {
              background: rgba(255, 255, 255, 0.2);
              transform: scale(1.05);
            }

            /* Navigation Menu */
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

            .nav-link:not(.active) {
              background: rgba(255, 255, 255, 0.05);
              color: #cbd5e1;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .nav-link:not(.active):hover {
              background: rgba(255, 255, 255, 0.1);
              transform: translateY(-1px);
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

            /* Main Content Area - Adjusted for fixed header */
            .main-content {
              margin-top: 10px;
              min-height: calc(100vh - 80px);
              padding: 0.7rem;
              background: #f8fafc;
            }

            /* ==================== MOBILE RESPONSIVE ==================== */
            @media (max-width: 768px) {
              .root-header {
                padding: 0.75rem 1rem;
              }

              .mobile-menu-btn {
                display: flex;
                align-items: center;
                justify-content: center;
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

              .nav-menu.mobile-open {
                transform: translateY(0);
                opacity: 1;
                pointer-events: all;
              }

              .nav-link {
                width: 100%;
                justify-content: center;
                padding: 1rem;
              }

              .main-content {
                margin-top: 10px;
                padding: 0.7rem;
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
              .root-header {
                padding: 0.5rem;
              }

              .brand-link {
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

              .main-content {
                margin-top: 10px;
                padding: 0.75rem;
              }
            }

            /* Tablet Styles */
            @media (min-width: 769px) and (max-width: 1024px) {
              .root-header {
                padding: 1rem 1.5rem;
              }

              .main-content {
                padding: 0.6rem 0.4rem;
              }

              .nav-link {
                padding: 0.75rem 1rem;
                font-size: 0.8rem;
              }
            }

            /* Smooth scrolling */
            html {
              scroll-behavior: smooth;
            }

            /* ==================== FIXED LOADING STYLES - SMALLER ON MOBILE ==================== */
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

            /* Mobile loading text adjustments */
            @media (max-width: 768px) {
              .global-loading-progress {
                padding: 1rem;
              }

              .global-loading-header h2 {
                font-size: 22px;
              }

              .global-loading-header p {
                font-size: 14px;
                margin-bottom: 30px;
              }

              .global-progress-bar-container {
                margin-bottom: 30px;
              }

              .global-loading-steps {
                gap: 12px;
                max-width: 100%;
              }

              .global-loading-step {
                gap: 12px;
                padding: 8px 0;
              }

              .global-step-indicator {
                font-size: 16px;
              }

              .global-step-text {
                font-size: 14px;
              }
            }

            @media (max-width: 480px) {
              .global-loading-header h2 {
                font-size: 20px;
              }

              .global-loading-header p {
                font-size: 13px;
                margin-bottom: 25px;
              }

              .global-step-text {
                font-size: 13px;
              }
            }
          `
        }} />
      </head>
      <body>
        {/* Show loading screen during navigation */}
        {navigation.state === 'loading' && <GlobalLoadingProgress />}
        
        {/* Only show main app when not loading */}
        {navigation.state !== 'loading' && (
          <AppProvider i18n={enTranslations}>
            <div className="app-container">
              {/* Fixed Sticky Header */}
              <header className="root-header" id="rootHeader">
                <div className="header-content">
                  {/* Clickable Logo that goes to app index */}
                  <NavLink to="/app" className="brand-link">
                    <div className="logo">📊</div>
                    <div className="brand-text">
                      <h1>Nexus Analytics</h1>
                      <p>Real-time Business Intelligence</p>
                    </div>
                  </NavLink>

                  {/* Mobile Menu Button */}
                  <button 
                    className="mobile-menu-btn" 
                    id="mobileMenuBtn"
                    onClick={toggleMobileMenu}
                    ref={mobileMenuBtnRef}
                  >
                    <MenuIcon />
                  </button>

                  {/* Navigation Menu */}
                  <nav className="nav-menu" id="navMenu" ref={navMenuRef}>
                    <NavLink
                      to="/app"
                      end
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      <AnalyticsIcon />
                      <span>Orders Dashboard</span>
                    </NavLink>

                    <NavLink
                      to="/products"
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      <ProductIcon />
                      <span>Products</span>
                    </NavLink>
                  </nav>
                </div>
              </header>

              {/* Main Content */}
              <main className="main-content">
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
            </div>

            <ScrollRestoration />
            <Scripts />
          </AppProvider>
        )}
      </body>
    </html>
  );
}