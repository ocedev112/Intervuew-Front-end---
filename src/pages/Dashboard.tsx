import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { SoftCard, ScoreChip } from "../components/shared";
import { Icon } from "../components/Icons";
import { COLORS, RADIUS } from "../theme/theme";
import api from "../api/api";

interface Interview {
  id: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: string;
  type: string;
}

interface AppliedRole {
  applicant_id: string;
  interview: Interview;
}

interface PrepSession {
  applicant_id: string;
  interview: Interview;
  score: number | null;
  started_session: boolean | null;
  ended_session: boolean | null;
  interview_date: string | null;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const Dashboard: React.FC = () => {
  const nav = useNavigate();
  const h = new Date().getHours();
  const greeting =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState(" ");
  const [appliedRoles, setAppliedRoles] = useState<AppliedRole[]>([]);
  const [prepSessions, setPrepSessions] = useState<PrepSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const [meRes, nameRes] = await Promise.all([
          api.get("/User/me"),
          api.get("/User"),
        ]);
        setUserId(meRes.data.id);
        setUserName(nameRes.data.name);
      } catch {
        nav("/login");
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchAll = async () => {
      try {
        const [appliedRes, prepRes] = await Promise.all([
          api.get(`/User/${userId}/applicant/interviews`),
          api.get(`/User/${userId}/prep/interviews`),
        ]);
        console.log("appliedRoles raw:", appliedRes.data);
        console.log("prepSessions raw:", prepRes.data);
        setAppliedRoles(appliedRes.data ?? []);
        setPrepSessions(prepRes.data ?? []);
      } catch (err) {
        console.error("fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId]);

  const completedSessions = prepSessions.filter((s) => s.ended_session);
  const totalSessions = prepSessions.length;
  const scoresOnly = completedSessions
    .map((s) => s.score)
    .filter((s): s is number => s !== null && s !== undefined);
  const avgScore =
    scoresOnly.length > 0
      ? Math.round(scoresOnly.reduce((a, b) => a + b, 0) / scoresOnly.length)
      : null;

  return (
    <SidebarLayout
      userLabel={userName}
      userInitial={userName?.[0] ?? "U"}
      navItems={[
        { icon: "home", label: "Dashboard", active: true },
        { icon: "clock", label: "History", to: "/history" },
        { icon: "chart", label: "Reports", to: "/reports" },
      ]}
    >
      {/* Header */}
      <Box className="fade-up" sx={{ mb: "32px" }}>
        <Typography variant="h4" sx={{ fontSize: 25, mb: "4px" }}>
          {greeting}, {userName} ✦
        </Typography>
        <Typography sx={{ fontSize: 15, color: COLORS.textMuted }}>
          Ready to practice? Your AI interviewer is waiting.
        </Typography>
      </Box>

      {/* Top cards */}
      <Box
        className="fade-up-1"
        sx={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "14px",
          mb: "22px",
        }}
      >
        {/* Quick start */}
        <Box
          sx={{
            background: "linear-gradient(135deg,#0F1115,#1a1d2e)",
            borderRadius: RADIUS.card,
            p: "30px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(91,93,246,0.35) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              mb: "9px",
            }}
          >
            Quick Start
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "white", mb: "9px", lineHeight: 1.25, fontSize: 21 }}
          >
            Start Your
            <br />
            Interview
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: "rgba(255,255,255,0.42)",
              mb: "20px",
              lineHeight: 1.5,
            }}
          >
            Practice with AI-powered real-time questions tailored to your role.
          </Typography>
        </Box>

        {/* Stats */}
        {[
          {
            label: "Prep Sessions",
            val: loading ? "—" : String(totalSessions),
            sub: `${completedSessions.length} completed`,
            color: COLORS.indigo,
          },
          {
            label: "Avg. Score",
            val: loading ? "—" : avgScore !== null ? String(avgScore) : "—",
            sub: avgScore !== null ? "↑ Keep going" : "No scores yet",
            color: COLORS.green,
          },
        ].map((c) => (
          <SoftCard key={c.label} sx={{ p: "26px 22px" }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: COLORS.textMuted,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                mb: "11px",
              }}
            >
              {c.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: c.color,
                mb: "5px",
                lineHeight: 1,
              }}
            >
              {c.val}
            </Typography>
            <Typography
              sx={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}
            >
              {c.sub}
            </Typography>
          </SoftCard>
        ))}
      </Box>

      {/* Applied Roles */}
      <Box className="fade-up-2" sx={{ mb: "28px" }}>
        <Typography variant="h6" sx={{ fontSize: 15, mb: "14px" }}>
          Applied Roles
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "13px",
          }}
        >
          {appliedRoles
            .filter((r) => r?.interview)
            .map((role, index) => (
              <SoftCard
                key={index}
                sx={{ p: "20px 22px", cursor: "pointer" }}
                onClick={async () => {
                  try {
                    await navigator.mediaDevices.getUserMedia({
                      audio: true,
                      video: true,
                    });
                    nav(`/interview/${role.applicant_id}/${role.interview.id}`);
                  } catch (err) {
                    const error = err as DOMException;
                    if (error.name === "NotAllowedError") {
                      alert(
                        "Microphone access was denied. Please allow it in your browser settings.",
                      );
                    } else if (error.name === "NotFoundError") {
                      alert("No microphone found on this device.");
                    } else {
                      alert("Could not access microphone.");
                    }
                  }
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: "12px",
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
                    }}
                  >
                    <Icon name="briefcase" size={15} color={COLORS.indigo} />
                  </Box>
                  <Box
                    sx={{
                      background:
                        role.interview.status === "active"
                          ? alpha(COLORS.green, 0.1)
                          : alpha(COLORS.textLight, 0.1),
                      color:
                        role.interview.status === "active"
                          ? COLORS.green
                          : COLORS.textLight,
                      borderRadius: "20px",
                      px: "10px",
                      py: "3px",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "capitalize",
                    }}
                  >
                    {role.interview.status}
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 15,
                    letterSpacing: "-0.01em",
                    mb: "4px",
                  }}
                >
                  {role.interview.role}
                </Typography>
                <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
                  {formatDate(role.interview.start_date)} →{" "}
                  {formatDate(role.interview.end_date)}
                </Typography>
              </SoftCard>
            ))}
        </Box>
      </Box>

      {/* Prep Sessions */}
      <Box className="fade-up-3">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "14px",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: 15 }}>
            Prep Sessions
          </Typography>
          <Typography
            onClick={() => nav("/prep_interview/new")}
            sx={{
              fontSize: 13,
              color: COLORS.indigo,
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            + New Session
          </Typography>
        </Box>

        {prepSessions.length === 0 && !loading ? (
          <SoftCard
            sx={{
              p: "40px",
              textAlign: "center",
              cursor: "pointer",
              border: "2px dashed rgba(91,93,246,0.2)",
              background: alpha(COLORS.indigo, 0.02),
            }}
            onClick={() => nav("/prep_interview/new")}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: "14px",
                background: alpha(COLORS.indigo, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: "10px",
              }}
            >
              <Icon name="plus" size={22} color={COLORS.indigo} />
            </Box>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 600,
                color: COLORS.indigo,
                mb: "4px",
              }}
            >
              Create Your First Prep Session
            </Typography>
            <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>
              Set up a role and practice with AI-generated questions.
            </Typography>
          </SoftCard>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "13px",
            }}
          >
            {prepSessions
              .filter((s) => s?.interview)
              .map((s) => (
                <SoftCard
                  key={s.applicant_id}
                  sx={{ p: "20px 22px", cursor: "pointer" }}
                  onClick={async () => {
                    try {
                      await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: true,
                      });
                      nav(`/interview/${s.applicant_id}/${s.interview.id}`);
                    } catch (err) {
                      const error = err as DOMException;
                      if (error.name === "NotAllowedError") {
                        alert(
                          "Microphone access was denied. Please allow it in your browser settings.",
                        );
                      } else if (error.name === "NotFoundError") {
                        alert("No microphone found on this device.");
                      } else {
                        alert("Could not access microphone.");
                      }
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: "12px",
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
                      }}
                    >
                      <Icon name="briefcase" size={15} color={COLORS.indigo} />
                    </Box>
                    {s.score !== null && s.score !== undefined ? (
                      <ScoreChip score={s.score} />
                    ) : (
                      <Box
                        sx={{
                          background: s.started_session
                            ? alpha(COLORS.amber, 0.1)
                            : alpha(COLORS.textLight, 0.1),
                          color: s.started_session
                            ? COLORS.amber
                            : COLORS.textLight,
                          borderRadius: "20px",
                          px: "10px",
                          py: "3px",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {s.started_session ? "In Progress" : "Not Started"}
                      </Box>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 15,
                      letterSpacing: "-0.01em",
                      mb: "4px",
                    }}
                  >
                    {s.interview.role}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
                    {s.interview_date
                      ? formatDate(s.interview_date)
                      : formatDate(s.interview.start_date)}{" "}
                    · {s.interview.duration} min
                  </Typography>
                </SoftCard>
              ))}

            {/* Create new */}
            <SoftCard
              sx={{
                p: "20px 22px",
                cursor: "pointer",
                border: "2px dashed rgba(91,93,246,0.2)",
                background: alpha(COLORS.indigo, 0.02),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                minHeight: 140,
              }}
              onClick={() => nav("/prep_interview/new")}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "11px",
                  background: alpha(COLORS.indigo, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="plus" size={18} color={COLORS.indigo} />
              </Box>
              <Typography
                sx={{ fontSize: 13, fontWeight: 600, color: COLORS.indigo }}
              >
                New Prep Session
              </Typography>
            </SoftCard>
          </Box>
        )}
      </Box>
    </SidebarLayout>
  );
};

export default Dashboard;
