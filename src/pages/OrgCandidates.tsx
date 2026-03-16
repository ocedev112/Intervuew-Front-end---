import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { SoftCard, GradientButton, ScoreChip } from "../components/shared";
import { Icon } from "../components/Icons";
import { COLORS } from "../theme/theme";
import { STATUS_COLORS } from "../data/orgData";
import api from "../api/api";

type CandidateStatus = "Recommended" | "Pending" | "Declined";
type StatusFilter = "All" | CandidateStatus;

interface Candidate {
  id: string;
  name: string;
  interview_id: string;
  role: string;
  interview_date: string | null;
  score: number | null;
  cheating_detected: boolean | null;
  status: CandidateStatus;
  started_session: boolean | null;
  ended_session: boolean | null;
}

const OrgCandidates: React.FC = () => {
  const nav = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [orgName, setOrgName] = useState(" ");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [meRes, nameRes] = await Promise.all([
          api.get("/Organization/me"),
          api.get("/Organization"),
        ]);

        const orgId = meRes.data.id;
        setOrgName(nameRes.data.name);

        const candidatesRes = await api.get(
          `/Organization/candidates/${orgId}`,
        );
        setCandidates(candidatesRes.data);
      } catch (err) {
        nav("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const filtered = candidates
    .filter((c) => statusFilter === "All" || c.status === statusFilter)
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "score") return (b.score ?? -1) - (a.score ?? -1);
      // sort by date descending, nulls last
      if (!a.interview_date && !b.interview_date) return 0;
      if (!a.interview_date) return 1;
      if (!b.interview_date) return -1;
      return (
        new Date(b.interview_date).getTime() -
        new Date(a.interview_date).getTime()
      );
    });

  const counts = {
    All: candidates.length,
    Recommended: candidates.filter((c) => c.status === "Recommended").length,
    Pending: candidates.filter((c) => c.status === "Pending").length,
    Declined: candidates.filter((c) => c.status === "Declined").length,
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <SidebarLayout
      userLabel={orgName}
      userInitial={orgName?.[0] ?? "O"}
      navItems={[
        { icon: "home", label: "Overview", active: true, to: `/org` },
        { icon: "briefcase", label: "Job Roles", to: `/org/interview` },
        { icon: "users", label: "Candidates", to: `/org/applicants` },
        { icon: "chart", label: "Analytics", to: `/org/analytics` },
      ]}
    >
      {/* Header */}
      <Box
        className="fade-up"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: "28px",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontSize: 25, mb: "4px" }}>
            Candidates
          </Typography>
          <Typography sx={{ fontSize: 15, color: COLORS.textMuted }}>
            {candidates.length} total · {counts.Recommended} recommended
          </Typography>
        </Box>
      </Box>

      {/* Status pills */}
      <Box
        className="fade-up-1"
        sx={{ display: "flex", gap: "8px", mb: "20px", flexWrap: "wrap" }}
      >
        {(["All", "Recommended", "Pending", "Declined"] as StatusFilter[]).map(
          (s) => {
            const color =
              s === "All" ? COLORS.indigo : STATUS_COLORS[s as CandidateStatus];
            const active = statusFilter === s;
            return (
              <Box
                key={s}
                onClick={() => setStatusFilter(s)}
                sx={{
                  px: "14px",
                  py: "7px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: active ? alpha(color, 0.12) : COLORS.white,
                  color: active ? color : COLORS.textMuted,
                  border: `1px solid ${active ? alpha(color, 0.3) : "rgba(0,0,0,0.07)"}`,
                  boxShadow: active ? "none" : "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {s}
                <Box
                  sx={{
                    background: active ? alpha(color, 0.2) : "rgba(0,0,0,0.07)",
                    color: active ? color : COLORS.textMuted,
                    borderRadius: "10px",
                    px: "7px",
                    py: "1px",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {counts[s]}
                </Box>
              </Box>
            );
          },
        )}
      </Box>

      {/* Search + Sort */}
      <Box
        className="fade-up-2"
        sx={{ display: "flex", gap: "12px", mb: "18px" }}
      >
        <Box sx={{ flex: 1, position: "relative" }}>
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
            placeholder="Search by name or role..."
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
            ] as [typeof sortBy, string][]
          ).map(([val, label]) => (
            <Box
              key={val}
              onClick={() => setSortBy(val)}
              sx={{
                px: "16px",
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

      {/* Table */}
      <SoftCard className="fade-up-3" sx={{ overflow: "hidden" }}>
        {/* Table header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2.2fr 1.5fr 1fr 1fr 1.2fr 0.5fr",
            gap: "12px",
            p: "14px 24px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.textLight,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {["Candidate", "Role", "Date", "Score", "Status", ""].map((h) => (
            <Box key={h}>{h}</Box>
          ))}
        </Box>

        {loading ? (
          <Box sx={{ p: "48px", textAlign: "center" }}>
            <Typography sx={{ color: COLORS.textMuted }}>
              Loading candidates...
            </Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ p: "48px", textAlign: "center" }}>
            <Typography sx={{ color: COLORS.textMuted }}>
              No candidates match your search.
            </Typography>
          </Box>
        ) : (
          filtered.map((c, i) => (
            <Box
              key={c.id}
              onClick={() => nav(`/org/applicants/${c.id}`)}
              sx={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1.5fr 1fr 1fr 1.2fr 0.5fr",
                gap: "12px",
                p: "14px 24px",
                borderBottom:
                  i < filtered.length - 1
                    ? "1px solid rgba(0,0,0,0.04)"
                    : "none",
                alignItems: "center",
                cursor: "pointer",
                transition: "background 0.15s",
                "&:hover": { background: alpha(COLORS.indigo, 0.025) },
              }}
            >
              {/* Name + avatar */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: `hsl(${i * 70 + 200},70%,92%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: `hsl(${i * 70 + 200},60%,40%)`,
                    flexShrink: 0,
                  }}
                >
                  {c.name[0]}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    {c.name}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: COLORS.textMuted }}>
                    {c.ended_session ? "Completed" : "Not started"}
                  </Typography>
                </Box>
              </Box>

              <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>
                {c.role}
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: COLORS.textMuted,
                  fontFamily: "'DM Mono',monospace",
                }}
              >
                {formatDate(c.interview_date)}
              </Typography>

              {/* Score — show dash for pending */}
              {c.score !== null ? (
                <ScoreChip score={c.score} />
              ) : (
                <Typography sx={{ fontSize: 13, color: COLORS.textLight }}>
                  —
                </Typography>
              )}

              <Box
                sx={{
                  background: alpha(STATUS_COLORS[c.status], 0.1),
                  color: STATUS_COLORS[c.status],
                  borderRadius: "20px",
                  px: "12px",
                  py: "3px",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "inline-block",
                }}
              >
                {c.status}
              </Box>

              <Typography sx={{ color: COLORS.textLight, fontSize: 16 }}>
                →
              </Typography>
            </Box>
          ))
        )}
      </SoftCard>
    </SidebarLayout>
  );
};

export default OrgCandidates;
