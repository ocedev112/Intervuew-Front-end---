import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Logo, SidebarLink } from "./shared";
import { Icon } from "./Icons";
import { COLORS } from "../theme/theme";
import { NavItem } from "../types";

interface SidebarLayoutProps {
  navItems: NavItem[];
  userLabel: string;
  userInitial?: string;
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  navItems,
  userLabel,
  userInitial = "A",
  children,
}) => (
  <Box sx={{ display: "flex", minHeight: "100vh", background: COLORS.bg }}>
    <Box
      component="aside"
      sx={{
        width: 218,
        background: COLORS.white,
        borderRight: "1px solid rgba(0,0,0,0.06)",
        p: "18px 12px",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        bottom: 0,
      }}
    >
      <Box sx={{ mb: "26px", p: "4px 6px" }}>
        <Logo size={28} />
      </Box>
      <Box
        component="nav"
        sx={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}
      >
        {navItems.map((item) => (
          <SidebarLink
            key={item.label}
            icon={<Icon name={item.icon} size={16} />}
            label={item.label}
            active={item.active}
            onClick={item.onClick}
            to={item.to}
          />
        ))}
      </Box>
      <Box
        sx={{
          p: "13px",
          background: alpha(COLORS.indigo, 0.06),
          borderRadius: "14px",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: "7px",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {userInitial}
        </Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>
          {userLabel}
        </Typography>
      </Box>
    </Box>
    <Box component="main" sx={{ ml: "218px", flex: 1, p: "34px 38px" }}>
      {children}
    </Box>
  </Box>
);

export default SidebarLayout;
