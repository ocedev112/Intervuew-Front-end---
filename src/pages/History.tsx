import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { SoftCard, ScoreChip } from "../components/shared";
import { Icon } from "../components/Icons";
import { COLORS } from "../theme/theme";
import api from "../api/api";

type SortBy = "date" | "score";

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

const History: React.FC = () => {
  const nav = useNavigate();
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [search, setSearch] = useState("");
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

  const bestScore = scoresOnly.length > 0 ? Math.max(...scoresOnly) : null;
  const avgScore =
    scoresOnly.length > 0
      ? Math.round(scoresOnly.reduce((a, b) => a + b, 0) / scoresOnly.length)
      : null;

  const filtered = sessions
    .filter((s) => s?.interview)
    .filter((s) =>
      s.interview.role.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "score") return (b.score ?? -1) - (a.score ?? -1);
      const dateA = a.interview_date ?? a.interview.start_date;
      const dateB = b.interview_date ?? b.interview.start_date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  return (
    <SidebarLayout
      userLabel={userName}
      userInitial={userName?.[0] ?? "U"}
      navItems={[
        { icon: "home", label: "Dashboard", to: "/dashboard" },
        { icon: "clock", label: "History", active: true },
        { icon: "chart", label: "Reports", to: "/reports" },
      ]}
    >
      {/* Header */}
      <Box
        className="fade-up"
        sx={{
          mb: "28px",
        }}
      >
        <Typography variant="h4" sx={{ fontSize: 25, mb: "4px" }}>
          Session History
        </Typography>
        <Typography sx={{ fontSize: 15, color: COLORS.textMuted }}>
          {loading ? "—" : `${sessions.length} sessions total`}
        </Typography>
      </Box>

      {/* Summary stats */}
      <Box
        className="fade-up-1"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "14px",
          mb: "24px",
        }}
      >
        {[
          {
            label: "Total Sessions",
            val: loading ? "—" : sessions.length,
            color: COLORS.indigo,
          },
          {
            label: "Average Score",
            val: loading ? "—" : (avgScore ?? "—"),
            color: COLORS.green,
          },
          {
            label: "Best Score",
            val: loading ? "—" : (bestScore ?? "—"),
            color: COLORS.amber,
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
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: s.color,
                lineHeight: 1,
              }}
            >
              {s.val}
            </Typography>
          </SoftCard>
        ))}
      </Box>

      {/* Search + Sort */}
      <Box
        className="fade-up-2"
        sx={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          mb: "18px",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <Icon name="search" size={14} color={COLORS.textLight} />
          </Box>
          <Box
            component="input"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            placeholder="Search by role..."
            sx={{
              width: "100%",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "12px",
              padding: "10px 14px 10px 36px",
              fontSize: 14,
              fontFamily: "'DM Sans',sans-serif",
              background: COLORS.white,
              color: COLORS.text,
              outline: "none",
              "&:focus": { borderColor: COLORS.indigo },
            }}
          />
        </Box>

        {/* Sort */}
        <Box
          sx={{
            display: "flex",
            background: COLORS.white,
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          {(
            [
              ["date", "Recent"],
              ["score", "Score"],
            ] as [SortBy, string][]
          ).map(([val, label]) => (
            <Box
              key={val}
              onClick={() => setSortBy(val)}
              sx={{
                px: "14px",
                py: "10px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background:
                  sortBy === val ? alpha(COLORS.indigo, 0.1) : "transparent",
                color: sortBy === val ? COLORS.indigo : COLORS.textMuted,
                transition: "all 0.15s",
              }}
            >
              {label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Session list */}
      <Box
        className="fade-up-3"
        sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {loading ? (
          <Typography sx={{ color: COLORS.textMuted, fontSize: 14 }}>
            Loading...
          </Typography>
        ) : filtered.length === 0 ? (
          <SoftCard sx={{ p: "48px", textAlign: "center" }}>
            <Typography sx={{ color: COLORS.textMuted, fontSize: 15 }}>
              No sessions match your search.
            </Typography>
          </SoftCard>
        ) : (
          filtered.map((s) => (
            <SoftCard
              key={s.applicant_id}
              sx={{
                p: "20px 24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
              onClick={() => nav(`/report/${s.interview.id}`)}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "13px",
                  background: alpha(COLORS.indigo, 0.08),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="briefcase" size={18} color={COLORS.indigo} />
              </Box>

              {/* Info */}
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 15, mb: "3px" }}>
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

              {/* Score */}
              {s.score !== null && s.score !== undefined ? (
                <ScoreChip score={s.score} />
              ) : (
                <Typography
                  sx={{ fontSize: 13, color: COLORS.textLight, minWidth: 40 }}
                >
                  —
                </Typography>
              )}

              {/* Arrow */}
              <Box sx={{ color: COLORS.textLight, fontSize: 18, ml: "4px" }}>
                →
              </Box>
            </SoftCard>
          ))
        )}
      </Box>
    </SidebarLayout>
  );
};

export default History;
