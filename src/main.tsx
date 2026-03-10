import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import ProtectedRoute from "./router/ProtectedRoute.tsx";

import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AnalyticsDashboard from "./pages/AnalyticsDashboard.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import QRStudio from "./pages/QRStudio.tsx";
import AdminSettings from "./pages/AdminSettings.tsx";
import ExperienceView from "./pages/ExperienceView.tsx";
import WelcomePage from "./pages/WelcomePage.tsx";
import AccessibilitySettings from "./pages/AccessibilitySettings.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Portal (protected) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collections"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/qr-studio"
              element={
                <ProtectedRoute>
                  <QRStudio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Visitor / Public */}
            <Route path="/welcome/:id" element={<WelcomePage />} />
            <Route path="/experience/:id" element={<ExperienceView />} />
            <Route
              path="/experience/:id/settings"
              element={<AccessibilitySettings />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
