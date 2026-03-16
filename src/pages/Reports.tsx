import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { SoftCard, ScoreChip } from "../components/shared";
import { Icon } from "../components/Icons";
import { COLORS } from "../theme/theme";
import api from "../api/api";

interface Interview {
  id: string;
  role: string;
  start_date: string;
  duration: number;
}

interface PrepSession {
  applicant_id: string;
  interview: Interview;
  score: number | null;
  started_session: boolean | null;
  ended_session: boolean | null;
  interview_date: string | null;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Reports: React.FC = () => {
  const nav = useNavigate();
  const [anim, setAnim] = useState(false);
  const [sessions, setSessions] = useState<PrepSession[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState(" ");
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
    const fetchSessions = async () => {
      try {
        const res = await api.get(`/User/${userId}/prep/interviews`);
        setSessions(res.data ?? []);
        setTimeout(() => setAnim(true), 300);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [userId]);

  const scoresOnly = sessions
    .map((s) => s.score)
    .filter((s): s is number => s !== null && s !== undefined);

  const avgScore =
    scoresOnly.length > 0
      ? Math.round(scoresOnly.reduce((a, b) => a + b, 0) / scoresOnly.length)
      : null;

  const bestScore = scoresOnly.length > 0 ? Math.max(...scoresOnly) : null;

  const completedSessions = sessions.filter((s) => s.ended_session);

  const sortedByDate = [...sessions]
    .filter((s) => s.score !== null && s.interview_date)
    .sort(
      (a, b) =>
        new Date(a.interview_date!).getTime() -
        new Date(b.interview_date!).getTime(),
    );
  const trend =
    sortedByDate.length >= 2
      ? (sortedByDate[sortedByDate.length - 1].score ?? 0) -
        (sortedByDate[0].score ?? 0)
      : null;

  const chartSessions = [...sessions]
    .filter((s) => s.score !== null)
    .sort((a, b) => {
      const dateA = a.interview_date ?? a.interview.start_date;
      const dateB = b.interview_date ?? b.interview.start_date;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

  const maxScore = Math.max(...chartSessions.map((s) => s.score ?? 0), 1);

  return (
    <SidebarLayout
      userLabel={userName}
      userInitial={userName?.[0] ?? "U"}
      navItems={[
        { icon: "home", label: "Dashboard", to: "/dashboard" },
        { icon: "clock", label: "History", to: "/history" },
        { icon: "chart", label: "Reports", active: true },
      ]}
    >
      {/* Header */}
      <Box className="fade-up" sx={{ mb: "28px" }}>
        <Typography variant="h4" sx={{ fontSize: 25, mb: "4px" }}>
          Analytics & Reports
        </Typography>
        <Typography sx={{ fontSize: 15, color: COLORS.textMuted }}>
          Performance overview across all prep sessions
        </Typography>
      </Box>

      {/* Top stats */}
      <Box
        className="fade-up-1"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          mb: "22px",
        }}
      >
        {[
          {
            label: "Sessions",
            val: loading ? "—" : sessions.length,
            unit: "",
            color: COLORS.indigo,
            sub: "total",
          },
          {
            label: "Average Score",
            val: loading ? "—" : (avgScore ?? "—"),
            unit: "",
            color: COLORS.green,
            sub: "across all sessions",
          },
          {
            label: "Best Score",
            val: loading ? "—" : (bestScore ?? "—"),
            unit: "",
            color: COLORS.amber,
            sub: "personal best",
          },
          {
            label: "Trend",
            val:
              loading || trend === null ? "—" : trend > 0 ? `+${trend}` : trend,
            unit: trend !== null ? " pts" : "",
            color:
              trend === null
                ? COLORS.textMuted
                : trend > 0
                  ? COLORS.green
                  : COLORS.red,
            sub: "vs. first session",
          },
        ].map((s) => (
          <SoftCard key={s.label} sx={{ p: "22px 24px" }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: COLORS.textMuted,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                mb: "8px",
              }}
            >
              {s.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: s.color,
                lineHeight: 1,
                mb: "4px",
              }}
            >
              {s.val}
              {s.unit}
            </Typography>
            <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
              {s.sub}
            </Typography>
          </SoftCard>
        ))}
      </Box>

      {/* Score progression */}
      <SoftCard className="fade-up-2" sx={{ p: "28px 30px", mb: "18px" }}>
        <Typography variant="h6" sx={{ fontSize: 15, mb: "22px" }}>
          Score Progression
        </Typography>

        {chartSessions.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>
            No scored sessions yet.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: "10px",
              height: 120,
            }}
          >
            {chartSessions.map((s, i) => {
              const h = anim ? ((s.score ?? 0) / maxScore) * 110 : 4;
              const color =
                (s.score ?? 0) >= 88
                  ? COLORS.green
                  : (s.score ?? 0) >= 78
                    ? COLORS.indigo
                    : COLORS.amber;
              return (
                <Box
                  key={s.applicant_id}
                  onClick={() => nav(`/report/${s.interview.id}`)}
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                >
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color }}>
                    {s.score}
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: anim ? h : 4,
                      borderRadius: "6px 6px 4px 4px",
                      background: `linear-gradient(180deg, ${color}, ${alpha(color, 0.5)})`,
                      transition: `height 0.9s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s`,
                      "&:hover": { filter: "brightness(1.1)" },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: COLORS.textMuted,
                      textAlign: "center",
                      lineHeight: 1.2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {s.interview.role.split(" ")[0]}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </SoftCard>

      {/* All sessions list */}
      <Box className="fade-up-3">
        <Typography variant="h6" sx={{ fontSize: 15, mb: "14px" }}>
          All Sessions
        </Typography>

        {loading ? (
          <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>
            Loading...
          </Typography>
        ) : sessions.length === 0 ? (
          <SoftCard sx={{ p: "48px", textAlign: "center" }}>
            <Typography sx={{ color: COLORS.textMuted, fontSize: 15 }}>
              No sessions yet.
            </Typography>
          </SoftCard>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sessions
              .filter((s) => s?.interview)
              .sort((a, b) => {
                const dateA = a.interview_date ?? a.interview.start_date;
                const dateB = b.interview_date ?? b.interview.start_date;
                return new Date(dateB).getTime() - new Date(dateA).getTime();
              })
              .map((s) => (
                <SoftCard
                  key={s.applicant_id}
                  sx={{
                    p: "18px 22px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                  onClick={() => nav(`/report/${s.interview.id}`)}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "11px",
                      background: alpha(COLORS.indigo, 0.08),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="briefcase" size={16} color={COLORS.indigo} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{ fontWeight: 600, fontSize: 14, mb: "2px" }}
                    >
                      {s.interview.role}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
                      {formatDate(s.interview_date ?? s.interview.start_date)} ·{" "}
                      {s.interview.duration} min ·{" "}
                      {s.ended_session
                        ? "Completed"
                        : s.started_session
                          ? "In Progress"
                          : "Not Started"}
                    </Typography>
                  </Box>
                  {s.score !== null && s.score !== undefined ? (
                    <ScoreChip score={s.score} />
                  ) : (
                    <Typography sx={{ fontSize: 13, color: COLORS.textLight }}>
                      —
                    </Typography>
                  )}
                  <Typography sx={{ color: COLORS.textLight, fontSize: 16 }}>
                    →
                  </Typography>
                </SoftCard>
              ))}
          </Box>
        )}
      </Box>
    </SidebarLayout>
  );
};

export default Reports;
