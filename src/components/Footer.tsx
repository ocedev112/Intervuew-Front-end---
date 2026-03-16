import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LogoSVG } from "./Icons";
import { COLORS } from "../theme/theme";

const Footer: React.FC = () => {
  const nav = useNavigate();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: "#0A0C10",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        px: { xs: "24px", md: "64px" },
        py: "28px",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
      }}
    >
      {/* Logo + copyright */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
        onClick={() => nav("/")}
      >
        <LogoSVG size={22} />
        <Typography
          sx={{
            fontSize: 13,
            color: "rgba(255,255,255,0.22)",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          © {year} Intervuew, Inc.
        </Typography>
      </Box>

      {/* Status */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: COLORS.green,
            boxShadow: "0 0 8px rgba(16,185,129,0.7)",
            animation: "pulse-dot 2.5s ease-in-out infinite",
          }}
        />
        <Typography
          sx={{
            fontSize: 12,
            color: "rgba(255,255,255,0.28)",
            fontFamily: "'DM Mono',monospace",
            letterSpacing: "0.02em",
          }}
        >
          All systems operational
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
