import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { SoftCard, ScoreRing } from "../components/shared";
import { Icon } from "../components/Icons";
import { COLORS } from "../theme/theme";
import { STATUS_COLORS } from "../data/orgData";
import api from "../api/api";

type CandidateStatus = "Recommended" | "Pending" | "Declined";

interface ProctoringAlert {
  frame: number;
  reason: string;
}

interface CandidateDetail {
  id: string;
  name: string;
  interview_id: string;
  role: string;
  interview_date: string | null;
  started_session: boolean | null;
  ended_session: boolean | null;
  score: number | null;
  cheating_detected: boolean | null;
  proctoring_alerts: ProctoringAlert[];
  status: CandidateStatus;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const OrgCandidateDetail: React.FC = () => {
  const nav = useNavigate();
  const { applicantId } = useParams<{ applicantId: string }>();
  const [anim, setAnim] = useState(false);
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [orgName, setOrgName] = useState(" ");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [detailRes, nameRes] = await Promise.all([
          api.get(`/Organization/candidates/detail/${applicantId}`),
          api.get("/Organization"),
        ]);
        setCandidate(detailRes.data);
        setOrgName(nameRes.data.name);
        setTimeout(() => setAnim(true), 300);
      } catch {
        nav("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [applicantId]);

  if (loading || !candidate) {
    return (
      <SidebarLayout
        userLabel={orgName}
        userInitial={orgName?.[0] ?? "O"}
        navItems={[
          { icon: "home", label: "Overview", to: `/org` },
          { icon: "briefcase", label: "Job Roles", to: `/org/interview` },
          {
            icon: "users",
            label: "Candidates",
            active: true,
            to: `/org/applicants`,
          },
          { icon: "chart", label: "Analytics", to: `/org/analytics` },
        ]}
      >
        <Typography
          sx={{
            color: COLORS.textMuted,
            fontSize: 14,
            mt: "40px",
            textAlign: "center",
          }}
        >
          Loading candidate...
        </Typography>
      </SidebarLayout>
    );
  }

  const alerts = candidate.proctoring_alerts ?? [];

  return (
    <SidebarLayout
      userLabel={orgName}
      userInitial={orgName?.[0] ?? "O"}
      navItems={[
        { icon: "home", label: "Overview", to: `/org` },
        { icon: "briefcase", label: "Job Roles", to: `/org/interview` },
        {
          icon: "users",
          label: "Candidates",
          active: true,
          to: `/org/applicants`,
        },
        { icon: "chart", label: "Analytics", to: `/org/analytics` },
      ]}
    >
      {/* Back + Header */}
      <Box className="fade-up" sx={{ mb: "28px" }}>
        <Box
          component="button"
          onClick={() => nav("/org/applicants")}
          sx={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: COLORS.textMuted,
            fontFamily: "'DM Sans',sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            mb: "14px",
            p: 0,
            "&:hover": { color: COLORS.text },
          }}
        >
          ← Back to Candidates
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "white",
            }}
          >
            {candidate.name[0]}
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontSize: 24, mb: "4px" }}>
              {candidate.name}
            </Typography>
            <Typography sx={{ fontSize: 14, color: COLORS.textMuted }}>
              {candidate.role} · Interviewed{" "}
              {formatDate(candidate.interview_date)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Info bar */}
      <SoftCard
        className="fade-up-1"
        sx={{
          p: "20px 26px",
          mb: "18px",
          display: "flex",
          gap: "28px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {[
          {
            icon: "calendar",
            label: "Interview Date",
            val: formatDate(candidate.interview_date),
          },
          {
            icon: "check",
            label: "Session",
            val: candidate.ended_session
              ? "Completed"
              : candidate.started_session
                ? "In Progress"
                : "Not Started",
          },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <Icon name={item.icon} size={14} color={COLORS.textMuted} />
            <Box>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: COLORS.textLight,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}
              >
                {item.val}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* Status badge */}
        <Box sx={{ ml: "auto" }}>
          <Box
            sx={{
              background: alpha(STATUS_COLORS[candidate.status], 0.1),
              color: STATUS_COLORS[candidate.status],
              borderRadius: "20px",
              px: "14px",
              py: "5px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {candidate.status}
          </Box>
        </Box>
      </SoftCard>

      {/* Score + Cheating indicator */}
      <Box
        className="fade-up-2"
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "18px",
          mb: "18px",
        }}
      >
        {/* Score ring */}
        <SoftCard
          sx={{
            p: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 200,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: COLORS.textMuted,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              mb: "16px",
            }}
          >
            Overall Score
          </Typography>
          {candidate.score !== null ? (
            <ScoreRing score={candidate.score} animated={anim} />
          ) : (
            <Typography
              sx={{ fontSize: 28, fontWeight: 700, color: COLORS.textLight }}
            >
              —
            </Typography>
          )}
        </SoftCard>

        {/* Cheating indicator */}
        <SoftCard sx={{ p: "28px 32px" }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: COLORS.textMuted,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              mb: "16px",
            }}
          >
            Cheating Detection
          </Typography>

          {candidate.cheating_detected === null ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: COLORS.textLight,
                }}
              />
              <Typography sx={{ fontSize: 14, color: COLORS.textMuted }}>
                No proctoring data available
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                p: "16px 20px",
                borderRadius: "14px",
                background: candidate.cheating_detected
                  ? alpha("#ef4444", 0.06)
                  : alpha(COLORS.green, 0.06),
                border: `1px solid ${
                  candidate.cheating_detected
                    ? alpha("#ef4444", 0.2)
                    : alpha(COLORS.green, 0.2)
                }`,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background: candidate.cheating_detected
                    ? alpha("#ef4444", 0.12)
                    : alpha(COLORS.green, 0.12),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                {candidate.cheating_detected ? "⚠️" : "✓"}
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: candidate.cheating_detected
                      ? "#ef4444"
                      : COLORS.green,
                    mb: "2px",
                  }}
                >
                  {candidate.cheating_detected
                    ? "Cheating Detected"
                    : "No Cheating Detected"}
                </Typography>
                <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
                  {alerts.length > 0
                    ? `${alerts.length} alert${alerts.length > 1 ? "s" : ""} flagged during session`
                    : "Session completed with no flags"}
                </Typography>
              </Box>
            </Box>
          )}
        </SoftCard>
      </Box>

      {/* Proctoring alerts table */}
      {alerts.length > 0 && (
        <SoftCard className="fade-up-3" sx={{ p: "26px 30px" }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: COLORS.textMuted,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              mb: "16px",
            }}
          >
            Proctoring Alerts · {alerts.length} flagged
          </Typography>

          {/* Table header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: "12px",
              p: "10px 16px",
              borderRadius: "10px 10px 0 0",
              background: alpha(COLORS.indigo, 0.04),
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              fontSize: 11,
              fontWeight: 700,
              color: COLORS.textLight,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <Box>Frame</Box>
            <Box>Reason</Box>
          </Box>

          {/* Table rows */}
          <Box
            sx={{
              border: "1px solid rgba(0,0,0,0.06)",
              borderTop: "none",
              borderRadius: "0 0 10px 10px",
              overflow: "hidden",
            }}
          >
            {alerts.map((alert, i) => (
              <Box
                key={i}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: "12px",
                  p: "12px 16px",
                  alignItems: "center",
                  borderBottom:
                    i < alerts.length - 1
                      ? "1px solid rgba(0,0,0,0.04)"
                      : "none",
                  background:
                    i % 2 === 0 ? "transparent" : alpha(COLORS.indigo, 0.015),
                  "&:hover": { background: alpha("#ef4444", 0.04) },
                  transition: "background 0.15s",
                }}
              >
                <Box
                  sx={{
                    background: alpha("#ef4444", 0.1),
                    color: "#ef4444",
                    borderRadius: "8px",
                    px: "10px",
                    py: "4px",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "'DM Mono', monospace",
                    display: "inline-block",
                    width: "fit-content",
                  }}
                >
                  Frame {alert.frame}
                </Box>
                <Typography
                  sx={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}
                >
                  {alert.reason}
                </Typography>
              </Box>
            ))}
          </Box>
        </SoftCard>
      )}
    </SidebarLayout>
  );
};

export default OrgCandidateDetail;
