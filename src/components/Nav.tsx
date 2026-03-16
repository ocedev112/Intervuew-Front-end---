import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo, GradientButton } from "./shared";
import { COLORS } from "../theme/theme";

const navLinks = [
  { label: "Features", to: "/features" },
  { label: "Demo", to: "/demo" },
];

const Nav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        px: { xs: "20px", md: "48px" },
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(248,249,252,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Logo size={30} />

      {/* Desktop links */}
      <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
        {navLinks.map((l) => {
          const active = pathname === l.to;
          return (
            <Box
              key={l.label}
              component="button"
              onClick={() => nav(l.to)}
              sx={{
                background: active ? "rgba(91,93,246,0.08)" : "none",
                border: "none",
                cursor: "pointer",
                px: "14px",
                py: "8px",
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? COLORS.indigo : COLORS.textMuted,
                fontFamily: "'DM Sans',sans-serif",
                borderRadius: "10px",
                transition: "all 0.15s ease",
                "&:hover": {
                  color: COLORS.text,
                  background: "rgba(0,0,0,0.04)",
                },
              }}
            >
              {l.label}
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          gap: "10px",
          alignItems: "center",
        }}
      >
        <GradientButton variant="ghost" size="sm" to="/login">
          Sign in
        </GradientButton>
        <GradientButton size="sm" to="/login">
          Get started free →
        </GradientButton>
      </Box>

      {/* Mobile hamburger */}
      <Box
        component="button"
        onClick={() => setMenuOpen((o) => !o)}
        sx={{
          display: { xs: "flex", md: "none" },
          background: "none",
          border: "none",
          cursor: "pointer",
          flexDirection: "column",
          gap: "5px",
          p: "6px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 22,
              height: 2,
              background: COLORS.text,
              borderRadius: 1,
              transition: "all 0.2s",
              transform:
                menuOpen && i === 0
                  ? "rotate(45deg) translate(5px,5px)"
                  : menuOpen && i === 2
                    ? "rotate(-45deg) translate(5px,-5px)"
                    : "none",
              opacity: menuOpen && i === 1 ? 0 : 1,
            }}
          />
        ))}
      </Box>

      {/* Mobile menu */}
      {menuOpen && (
        <Box
          sx={{
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            background: "rgba(248,249,252,0.98)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            p: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {navLinks.map((l) => (
            <Box
              key={l.label}
              component="button"
              onClick={() => nav(l.to)}
              sx={{
                background: "none",
                border: "none",
                cursor: "pointer",
                p: "12px 14px",
                fontSize: 15,
                fontWeight: 500,
                color: COLORS.text,
                fontFamily: "'DM Sans',sans-serif",
                borderRadius: "10px",
                textAlign: "left",
                "&:hover": { background: "rgba(0,0,0,0.04)" },
              }}
            >
              {l.label}
            </Box>
          ))}
          <Box sx={{ mt: "8px", display: "flex", gap: "8px" }}>
            <GradientButton
              variant="ghost"
              size="sm"
              to="/login"
              sx={{ flex: 1 }}
            >
              Sign in
            </GradientButton>
            <GradientButton size="sm" to="/login" sx={{ flex: 1 }}>
              Get started →
            </GradientButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Nav;
