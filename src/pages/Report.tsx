import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { SoftCard, ScoreRing } from "../components/shared";
import { COLORS } from "../theme/theme";
import api from "../api/api";

interface ProctoringAlert {
  frame: number;
  reason: string;
}

interface ReportData {
  role: string;
  duration: number;
  interview_date: string | null;
  started_session: boolean | null;
  ended_session: boolean | null;
  score: number | null;
  cheating_detected: boolean | null;
  proctoring_alerts: ProctoringAlert[];
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Report: React.FC = () => {
  const nav = useNavigate();
  const { interviewId } = useParams<{ interviewId: string }>();
  const [anim, setAnim] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/User/report/${interviewId}`);
        setReport(res.data);
        setTimeout(() => setAnim(true), 300);
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          nav("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [interviewId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: COLORS.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: COLORS.textMuted, fontSize: 14 }}>
          Loading report...
        </Typography>
      </Box>
    );
  }

  if (!report) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: COLORS.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: COLORS.textMuted, fontSize: 14 }}>
          Report not found.
        </Typography>
      </Box>
    );
  }

  const scoreLabel =
    report.score === null
      ? "Pending"
      : report.score >= 88
        ? "Excellent"
        : report.score >= 78
          ? "Good"
          : "Needs Work";

  const scoreLabelColor =
    report.score === null
      ? COLORS.textLight
      : report.score >= 88
        ? COLORS.green
        : report.score >= 78
          ? COLORS.amber
          : COLORS.red;

  const alerts = report.proctoring_alerts ?? [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: COLORS.bg,
        p: "32px 44px",
        maxWidth: 980,
        mx: "auto",
      }}
    >
      {/* Header */}
      <Box className="fade-up" sx={{ mb: "34px" }}>
        <Box
          component="button"
          onClick={() => nav(-1 as any)}
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
            mb: "8px",
            p: 0,
            "&:hover": { color: COLORS.text },
          }}
        >
          ← Back
        </Box>
        <Typography variant="h4" sx={{ fontSize: 25, mb: "4px" }}>
          Interview Report
        </Typography>
        <Typography sx={{ fontSize: 14, color: COLORS.textMuted }}>
          {report.role} · {formatDate(report.interview_date)} ·{" "}
          {report.duration} min
        </Typography>
      </Box>

      {/* Score + Session status */}
      <Box
        className="fade-up-1"
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
            p: "34px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 210,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: COLORS.textMuted,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              mb: "18px",
            }}
          >
            Overall Score
          </Typography>
          {report.score !== null ? (
            <ScoreRing score={report.score} animated={anim} />
          ) : (
            <Typography
              sx={{ fontSize: 32, fontWeight: 700, color: COLORS.textLight }}
            >
              —
            </Typography>
          )}
          <Box
            sx={{
              mt: "14px",
              borderRadius: "20px",
              px: "14px",
              py: "5px",
              fontSize: 13,
              fontWeight: 700,
              background: alpha(scoreLabelColor, 0.1),
              color: scoreLabelColor,
            }}
          >
            {scoreLabel}
          </Box>
        </SoftCard>

        {/* Session info + cheating */}
        <SoftCard sx={{ p: "30px 34px" }}>
          <Typography variant="h6" sx={{ fontSize: 15, mb: "20px" }}>
            Session Details
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              {
                label: "Interview Date",
                val: formatDate(report.interview_date),
              },
              {
                label: "Duration",
                val: `${report.duration} min`,
              },
              {
                label: "Session Status",
                val: report.ended_session
                  ? "Completed"
                  : report.started_session
                    ? "In Progress"
                    : "Not Started",
              },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLORS.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
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
            ))}

            {/* Divider */}
            <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.05)", pt: "14px" }}>
              {report.cheating_detected === null ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: COLORS.textLight,
                    }}
                  />
                  <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>
                    No proctoring data available
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    p: "14px 16px",
                    borderRadius: "12px",
                    background: report.cheating_detected
                      ? alpha("#ef4444", 0.06)
                      : alpha(COLORS.green, 0.06),
                    border: `1px solid ${
                      report.cheating_detected
                        ? alpha("#ef4444", 0.2)
                        : alpha(COLORS.green, 0.2)
                    }`,
                  }}
                >
                  <Typography sx={{ fontSize: 18 }}>
                    {report.cheating_detected ? "⚠️" : "✓"}
                  </Typography>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: report.cheating_detected
                          ? "#ef4444"
                          : COLORS.green,
                        mb: "2px",
                      }}
                    >
                      {report.cheating_detected
                        ? "Cheating Detected"
                        : "No Cheating Detected"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
                      {alerts.length > 0
                        ? `${alerts.length} alert${alerts.length > 1 ? "s" : ""} flagged`
                        : "Session completed with no flags"}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </SoftCard>
      </Box>

      {/* Proctoring alerts table */}
      {alerts.length > 0 && (
        <SoftCard className="fade-up-2" sx={{ p: "26px 30px" }}>
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
    </Box>
  );
};

export default Report;
