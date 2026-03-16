import React from "react";
import MicIcon from "@mui/icons-material/Mic";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShieldIcon from "@mui/icons-material/Shield";
import BoltIcon from "@mui/icons-material/Bolt";
import DownloadIcon from "@mui/icons-material/Download";
import WorkIcon from "@mui/icons-material/Work";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StopIcon from "@mui/icons-material/Stop";
import LockIcon from "@mui/icons-material/Lock";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import LinkIcon from "@mui/icons-material/Link";
import UploadIcon from "@mui/icons-material/Upload";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  color = "currentColor",
  style = {},
}) => {
  const sx = { fontSize: size, color, ...style };

  const map: Record<string, React.ReactNode> = {
    mic: <MicIcon sx={sx} />,
    home: <HomeIcon sx={sx} />,
    chart: <BarChartIcon sx={sx} />,
    clock: <AccessTimeIcon sx={sx} />,
    settings: <SettingsIcon sx={sx} />,
    users: <PeopleIcon sx={sx} />,
    play: <PlayArrowIcon sx={sx} />,
    shield: <ShieldIcon sx={sx} />,
    zap: <BoltIcon sx={sx} />,
    download: <DownloadIcon sx={sx} />,
    briefcase: <WorkIcon sx={sx} />,
    brain: <PsychologyIcon sx={sx} />,
    arrow: <ArrowForwardIcon sx={sx} />,
    check: <CheckCircleOutlineIcon sx={sx} />,
    stop: <StopIcon sx={sx} />,
    lock: <LockIcon sx={sx} />,
    search: <SearchIcon sx={sx} />,
    plus: <AddIcon sx={sx} />,
    link: <LinkIcon sx={sx} />,
    upload: <UploadIcon sx={sx} />,
  };

  return <>{map[name] || <span style={{ fontSize: size }}>■</span>}</>;
};

export const LogoSVG: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="10" fill="url(#logoGrad)" />
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
        <stop stopColor="#5B5DF6" />
        <stop offset="1" stopColor="#8B8EFA" />
      </linearGradient>
    </defs>
    <path
      d="M8 10h6l3 12 3-12h4"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="22" cy="22" r="2" fill="white" />
  </svg>
);

export default Icon;
