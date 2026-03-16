import React from "react";
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

const features = [
  {
    icon: "mic",
    title: "Real-Time Voice AI",
    color: COLORS.indigo,
    desc: "Sub-2s AI responses with natural conversational flow. The AI speaks, listens, and adapts to every candidate in real time.",
    bullets: [
      "Live audio streaming",
      "Adaptive follow-up questions",
      "Real-time transcription",
    ],
  },
  {
    icon: "shield",
    title: "Proctoring & Cheating Detection",
    color: COLORS.red,
    desc: "Live video monitoring throughout the session with automatic flagging of suspicious behaviour and a full alert log.",
    bullets: [
      "Frame-by-frame analysis",
      "Cheating detected flag",
      "Per-alert reason log",
    ],
  },
  {
    icon: "brain",
    title: "AI-Generated Questions",
    color: COLORS.purple,
    desc: "Role-specific interview questions generated automatically from your job requirements — no manual writing needed.",
    bullets: [
      "Languages & frameworks",
      "Domain experience",
      "Softskill coverage",
    ],
  },
  {
    icon: "chart",
    title: "Candidate Reports",
    color: COLORS.blue,
    desc: "Every applicant gets a report with their overall score, session status, cheating detection result, and proctoring alerts.",
    bullets: [
      "0–100 AI score",
      "Session completion status",
      "Proctoring alert table",
    ],
  },
  {
    icon: "users",
    title: "Organization Dashboard",
    color: COLORS.green,
    desc: "Create roles, generate shareable application links, manage all candidates, and track analytics from one workspace.",
    bullets: [
      "Shareable apply link",
      "Candidate status tracking",
      "Role open/close control",
    ],
  },
  {
    icon: "briefcase",
    title: "Resume-Aware Interviews",
    color: COLORS.amber,
    desc: "Candidates upload their resume on application. The AI uses it to generate personalised, context-aware questions.",
    bullets: [
      "PDF resume parsing",
      "Resume-based question gen",
      "Skill gap identification",
    ],
  },
  {
    icon: "clock",
    title: "Prep Sessions for Candidates",
    color: COLORS.lavender,
    desc: "Users can create their own practice interviews with custom roles and requirements to prepare before the real thing.",
    bullets: [
      "Custom role setup",
      "Session history",
      "Score tracking over time",
    ],
  },
  {
    icon: "zap",
    title: "Analytics Overview",
    color: COLORS.pink,
    desc: "See score distributions across your top roles, candidate funnel breakdowns, and role-level performance at a glance.",
    bullets: [
      "Score distribution chart",
      "Recommended vs declined funnel",
      "Per-role avg score",
    ],
  },
];

const Features: React.FC = () => {
  return (
    <Box sx={{ pt: "64px" }}>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          py: "90px",
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
            maxWidth: 740,
            mx: "auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <SectionLabel>Platform Features</SectionLabel>
          <Typography
            variant="h1"
            sx={{
              fontSize: "clamp(36px,5vw,62px)",
              mb: "20px",
              letterSpacing: "-0.03em",
            }}
          >
            Every tool your team needs.
            <br />
            <Box
              component="span"
              sx={{
                background: `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Nothing you don't.
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: 18,
              color: COLORS.textMuted,
              lineHeight: 1.7,
              mb: "40px",
              maxWidth: 520,
              mx: "auto",
            }}
          >
            Intervuew combines real-time voice AI, live proctoring, and
            structured candidate reports into one platform built for modern
            hiring.
          </Typography>
        </Box>
      </Box>

      {/* Feature grid */}
      <Box sx={{ maxWidth: 1140, mx: "auto", px: "48px", py: "40px" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "16px",
          }}
        >
          {features.map((f, i) => (
            <SoftCard
              key={i}
              sx={{
                p: "30px",
                transition:
                  "transform 0.22s ease,box-shadow 0.22s ease,border-color 0.22s ease",
                border: `1px solid rgba(0,0,0,0.04)`,
                "&:hover": {
                  borderColor: alpha(f.color, 0.2),
                  boxShadow: `0 16px 50px ${alpha(f.color, 0.1)}`,
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  background: alpha(f.color, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: "18px",
                }}
              >
                <Icon name={f.icon} size={22} color={f.color} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontSize: 17, mb: "10px", letterSpacing: "-0.015em" }}
              >
                {f.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  color: COLORS.textMuted,
                  mb: "18px",
                }}
              >
                {f.desc}
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "7px" }}
              >
                {f.bullets.map((b, bi) => (
                  <Box
                    key={bi}
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: f.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        color: COLORS.textMuted,
                        fontWeight: 500,
                      }}
                    >
                      {b}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </SoftCard>
          ))}
        </Box>
      </Box>

      {/* Comparison table */}
      <Box
        sx={{
          background: alpha(COLORS.indigo, 0.025),
          borderTop: `1px solid ${alpha(COLORS.indigo, 0.07)}`,
          borderBottom: `1px solid ${alpha(COLORS.indigo, 0.07)}`,
          py: "72px",
          px: "48px",
        }}
      >
        <Box sx={{ maxWidth: 860, mx: "auto" }}>
          <Box sx={{ textAlign: "center", mb: "48px" }}>
            <SectionLabel>Why Intervuew</SectionLabel>
            <Typography variant="h2" sx={{ fontSize: "clamp(26px,3vw,40px)" }}>
              See the difference
            </Typography>
          </Box>
          <SoftCard sx={{ overflow: "hidden", p: 0 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                background: "linear-gradient(135deg,#0F1115,#1a1d2e)",
                px: "28px",
                py: "18px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Capability
              </Typography>
              {["Traditional", "Intervuew"].map((h) => (
                <Typography
                  key={h}
                  sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color:
                      h === "Intervuew"
                        ? COLORS.lavender
                        : "rgba(255,255,255,0.4)",
                    textAlign: "center",
                  }}
                >
                  {h}
                </Typography>
              ))}
            </Box>
            {[
              ["Consistent scoring across candidates", false, true],
              ["Available 24/7 without scheduling", false, true],
              ["Live proctoring & cheating detection", false, true],
              ["Instant transcript of every session", false, true],
              ["AI-generated role-specific questions", false, true],
              ["Resume-aware personalised interview", false, true],
              ["Candidate report with score & alerts", false, true],
              ["Human empathy & edge case handling", true, "~"],
            ].map(([cap, trad, intv], i) => (
              <Box
                key={i}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  px: "28px",
                  py: "15px",
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  background:
                    i % 2 === 0 ? "white" : alpha(COLORS.indigo, 0.012),
                }}
              >
                <Typography
                  sx={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}
                >
                  {cap as string}
                </Typography>
                {[trad, intv].map((v, vi) => (
                  <Box key={vi} sx={{ textAlign: "center" }}>
                    {v === true ? (
                      <Box
                        sx={{
                          display: "inline-block",
                          color: COLORS.green,
                          fontSize: 16,
                        }}
                      >
                        ✓
                      </Box>
                    ) : v === false ? (
                      <Box
                        sx={{
                          display: "inline-block",
                          color: COLORS.red,
                          fontSize: 16,
                        }}
                      >
                        ✕
                      </Box>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: COLORS.amber,
                          fontWeight: 600,
                        }}
                      >
                        Partial
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            ))}
          </SoftCard>
        </Box>
      </Box>

      {/* CTA */}
      <Box
        sx={{
          maxWidth: 1140,
          mx: "auto",
          px: "48px",
          py: "80px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: "clamp(28px,3.5vw,46px)", mb: "16px" }}
        >
          Ready to modernise your hiring?
        </Typography>
        <Typography sx={{ fontSize: 16, color: COLORS.textMuted, mb: "36px" }}>
          Get started free — no credit card required.
        </Typography>
        <Box sx={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <GradientButton size="lg" to="/login">
            Start now
          </GradientButton>
          <GradientButton variant="ghost" size="lg" to="/demo">
            View Demo
          </GradientButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Features;
