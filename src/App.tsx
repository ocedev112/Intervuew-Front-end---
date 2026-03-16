import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";

import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

// Prepper (individual user) app
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import ApplyPage from "./pages/interviewApplication";
import PrepApplyPage from "./pages/PreppedInterviewApply";
import Report from "./pages/Report";
import Reports from "./pages/Reports";
import History from "./pages/History";

// Org app
import OrgDash from "./pages/OrgDash";
import OrgJobRoles from "./pages/OrgJobRoles";
import OrgRoleDetail from "./pages/OrgRoleDetail";
import OrgCreateRole from "./pages/OrgCreateRole";
import OrgCandidates from "./pages/OrgCandidates";
import OrgCandidateDetail from "./pages/OrgCandidateDetail";
import OrgAnalytics from "./pages/OrgAnalytics";

// Marketing
import Features from "./pages/Features";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";

// Hide Nav/Footer on all app shell pages
const BARE_PREFIXES = [
  "/interview",
  "/dashboard",
  "/report",
  "/reports",
  "/history",
  "/settings",
  "/org",
];

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
};

const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const isBare = BARE_PREFIXES.some((p) => pathname.startsWith(p));
  const isLogin = pathname === "/login";

  return (
    <>
      <ScrollToTop />
      {!isBare && !isLogin && <Nav />}
      <Routes>
        {/* ── Marketing ─────────────────────────────── */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/features" element={<Features />} />
        <Route path="/demo" element={<Demo />} />

        {/* ── Prepper app ───────────────────────────── */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/interview/:applicationId/:interviewId"
          element={<Interview />}
        />
        <Route
          path="/interview/application/:interviewId"
          element={<ApplyPage />}
        />
        <Route path="/prep_interview/new" element={<PrepApplyPage />} />
        <Route path="/report/:interviewId" element={<Report />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/history" element={<History />} />

        {/* ── Org app ───────────────────────────────── */}
        <Route path="/org" element={<OrgDash />} />
        <Route path="/org/interview" element={<OrgJobRoles />} />
        <Route path="/org/interview/new" element={<OrgCreateRole />} />
        <Route path="/org/interview/:interviewId" element={<OrgRoleDetail />} />
        <Route path="/org/applicants" element={<OrgCandidates />} />
        <Route
          path="/org/applicants/:applicantId"
          element={<OrgCandidateDetail />}
        />
        <Route path="/org/analytics" element={<OrgAnalytics />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isBare && !isLogin && <Footer />}
    </>
  );
};

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
