import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Icon } from "../components/Icons";
import {
  SoftCard,
  GradientButton,
  OrbBackground,
  SectionLabel,
} from "../components/shared";
import { COLORS } from "../theme/theme";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const DEMO_LINK = import.meta.env.VITE_DEMO_LINK as string;

const getYoutubeId = (url: string) => {
  const match = url?.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
};

const highlights = [
  {
    icon: "brain",
    title: "See the AI conduct a live interview",
    desc: "Watch a full voice interview from start to finish — questions, follow-ups, and real-time transcription.",
  },
  {
    icon: "shield",
    title: "Live proctoring in action",
    desc: "See how the AI monitors candidates and flags suspicious behaviour during the session.",
  },
  {
    icon: "chart",
    title: "Candidate report walkthrough",
    desc: "We walk through the score, proctoring alerts, and cheating detection on a real report.",
  },
  {
    icon: "users",
    title: "Org dashboard & role setup",
    desc: "See how to create a role, generate an application link, and manage candidates in minutes.",
  },
];

console.log("DEMO_LINK:", import.meta.env.VITE_DEMO_LINK);
console.log("ALL ENV:", import.meta.env);

const Demo: React.FC = () => {
  const videoId = getYoutubeId(DEMO_LINK);
  const [started, setStarted] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!videoId) {
    return (
      <Box sx={{ pt: "64px", textAlign: "center", py: "80px" }}>
        <Typography sx={{ color: COLORS.textMuted }}>
          Demo link not configured.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: "64px" }}>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          py: "80px",
          px: "48px",
          overflow: "hidden",
          background:
            "linear-gradient(180deg,rgba(91,93,246,0.04) 0%,transparent 100%)",
        }}
      >
        <Box
          className="dot-grid"
          sx={{ position: "absolute", inset: 0, opacity: 0.4 }}
        />
        <OrbBackground />
        <Box
          sx={{
            maxWidth: 640,
            mx: "auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <SectionLabel>See Intervuew Live</SectionLabel>
          <Typography
            variant="h1"
            sx={{
              fontSize: "clamp(36px,5vw,58px)",
              mb: "18px",
              letterSpacing: "-0.03em",
            }}
          >
            See it in action
            <br />
            <Box
              component="span"
              sx={{
                background: `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              before you commit.
            </Box>
          </Typography>
          <Typography
            sx={{ fontSize: 17, color: COLORS.textMuted, lineHeight: 1.7 }}
          >
            Watch the full product tour at your own pace — from role setup to
            final candidate report.
          </Typography>
        </Box>
      </Box>

      {/* Main */}
      <Box sx={{ maxWidth: 1060, mx: "auto", px: "48px", pb: "80px" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {/* Video card */}
          <SoftCard sx={{ p: 0, overflow: "hidden" }}>
            <Box
              sx={{
                position: "relative",
                paddingTop: "56.25%",
                background: "#0F1115",
                overflow: "hidden",
              }}
            >
              {!started ? (
                <>
                  {/* Thumbnail */}
                  <Box
                    component="img"
                    src={thumbnailUrl}
                    alt="Demo thumbnail"
                    onError={(e: any) => {
                      e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.4)",
                    }}
                  />
                  {/* Play button */}
                  <Box
                    onClick={() => setStarted(true)}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "14px",
                      cursor: "pointer",
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 76,
                        height: 76,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 0 50px ${alpha(COLORS.indigo, 0.7)}`,
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.1)",
                          boxShadow: `0 0 70px ${alpha(COLORS.indigo, 0.9)}`,
                        },
                      }}
                    >
                      <PlayArrowIcon sx={{ color: "white", fontSize: 36 }} />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.85)",
                        fontWeight: 600,
                        background: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "20px",
                        px: "14px",
                        py: "5px",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      Watch product tour
                    </Typography>
                  </Box>
                </>
              ) : (
                <iframe
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&color=white`}
                  title="Product Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
              )}
            </Box>

            <Box sx={{ p: "20px 24px" }}>
              <Typography variant="h6" sx={{ mb: "4px", fontSize: 15 }}>
                Full Product Walkthrough
              </Typography>
              <Typography
                sx={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}
              >
                See the complete interview workflow — role setup, live AI
                interview, proctoring, and candidate report — in one tour.
              </Typography>
            </Box>
          </SoftCard>

          {/* Highlights */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Typography variant="h6" sx={{ fontSize: 16, mb: "4px" }}>
              What you'll see
            </Typography>
            {highlights.map((h, i) => (
              <SoftCard
                key={i}
                sx={{
                  p: "20px 22px",
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "11px",
                    background: alpha(COLORS.indigo, 0.08),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={h.icon} size={16} color={COLORS.indigo} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, mb: "4px" }}>
                    {h.title}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>
                    {h.desc}
                  </Typography>
                </Box>
              </SoftCard>
            ))}

            <SoftCard
              sx={{
                p: "20px 22px",
                background: `linear-gradient(135deg,${alpha(COLORS.indigo, 0.06)},${alpha(COLORS.lavender, 0.06)})`,
                border: `1px solid ${alpha(COLORS.indigo, 0.12)}`,
                mt: "4px",
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: 14, mb: "8px" }}>
                Ready to try it yourself?
              </Typography>
              <Typography
                sx={{ fontSize: 13, color: COLORS.textMuted, mb: "14px" }}
              >
                Create a free account and set up your first AI interview in
                under 2 minutes.
              </Typography>
              <GradientButton size="sm" to="/register" fullWidth>
                Get Started Free
              </GradientButton>
            </SoftCard>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Demo;
