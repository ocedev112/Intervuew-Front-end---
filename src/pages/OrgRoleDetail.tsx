import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { SoftCard, GradientButton, ScoreChip } from "../components/shared";
import { Icon } from "../components/Icons";
import { COLORS } from "../theme/theme";

import api from "../api/api";

interface Interview {
  id: string;
  role: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  duration: number;
  job_requirements: string;
  organization_id: string;
  type: string;
}

interface Applicant {
  id: string;
  name: string;
  interview_date: string | null;
  started_session: boolean | null;
  ended_session: boolean | null;
  score: number | null;
  status: string;
}

interface RoleDetail {
  interview: Interview;
  applicants: { applicant: Applicant; report: any }[];
}

const parseSkills = (job_requirements: string): string[] =>
  job_requirements
    .split("\n")
    .filter((l) => l.trim().startsWith("-"))
    .map((l) => l.replace("-", "").trim())
    .filter(Boolean);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getApplicantStatus = (applicant: Applicant, report: any): string => {
  if (!applicant.started_session) return "Pending";
  if (report?.cheating_detected) return "Declined";
  if (report?.score !== null && report?.score !== undefined)
    return report.score >= 60 ? "Recommended" : "Declined";
  return "Pending";
};

const STATUS_COLORS: Record<string, string> = {
  Recommended: COLORS.green,
  Pending: COLORS.amber,
  Declined: COLORS.red,
};

const OrgRoleDetail: React.FC = () => {
  const nav = useNavigate();
  const { interviewId } = useParams<{ interviewId: string }>();
  const [data, setData] = useState<RoleDetail | null>(null);
  const [orgName, setOrgName] = useState(" ");
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [copied, setCopied] = useState(false);

  const applyUrl = `${window.location.origin}/interview/application/${interviewId}`;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const meRes = await api.get("/Organization/me");
        const orgId = meRes.data.id;

        const jobsRes = await api.get(
          `/Organization/interview/candidate/report/${orgId}`,
        );

        const match = (jobsRes.data as RoleDetail[]).find(
          (entry) => entry.interview?.id === interviewId,
        );

        if (match) setData(match);
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          nav("/login");
        }
      } finally {
        setLoading(false);
      }

      // Non-critical
      try {
        const nameRes = await api.get("/Organization");
        setOrgName(nameRes.data.name);
      } catch {}
    };

    fetchAll();
  }, [interviewId]);

  const handleToggleStatus = async () => {
    setClosing(true);
    try {
      const action = isActive ? "close" : "open";
      await api.patch(
        `/Organization/interview/${interviewId}/status?action=${action}`,
      );
      setData((prev) =>
        prev
          ? {
              ...prev,
              interview: {
                ...prev.interview,
                status: isActive ? "closed" : "active",
              },
            }
          : prev,
      );
    } catch (err) {
      console.error(err);
    } finally {
      setClosing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(applyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !data) {
    return (
      <SidebarLayout
        userLabel={orgName}
        userInitial={orgName?.[0] ?? "O"}
        navItems={[
          { icon: "home", label: "Overview", to: "/org" },
          {
            icon: "briefcase",
            label: "Job Roles",
            active: true,
            to: "/org/interview",
          },
          { icon: "users", label: "Candidates", to: "/org/applicants" },
          { icon: "chart", label: "Analytics", to: "/org/analytics" },
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
          Loading role...
        </Typography>
      </SidebarLayout>
    );
  }

  const { interview, applicants } = data;
  const skills = parseSkills(interview.job_requirements);
  const isActive = interview.status === "active";
  const statusColor = isActive ? COLORS.green : COLORS.textLight;
  const startedApplicants = applicants.filter(
    (a) => a.applicant.started_session,
  );
  const recommendedCount = applicants.filter(
    (a) => getApplicantStatus(a.applicant, a.report) === "Recommended",
  ).length;

  return (
    <SidebarLayout
      userLabel={orgName}
      userInitial={orgName?.[0] ?? "O"}
      navItems={[
        { icon: "home", label: "Overview", to: "/org" },
        {
          icon: "briefcase",
          label: "Job Roles",
          active: true,
          to: "/org/interview",
        },
        { icon: "users", label: "Candidates", to: "/org/applicants" },
        { icon: "chart", label: "Analytics", to: "/org/analytics" },
      ]}
    >
      {/* Back + Header */}
      <Box className="fade-up" sx={{ mb: "28px" }}>
        <Box
          component="button"
          onClick={() => nav("/org/interview")}
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
          ← Back to Roles
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "15px",
                background: alpha(COLORS.indigo, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="briefcase" size={22} color={COLORS.indigo} />
            </Box>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  mb: "4px",
                }}
              >
                <Typography variant="h4" sx={{ fontSize: 24 }}>
                  {interview.role}
                </Typography>
                <Box
                  sx={{
                    background: alpha(statusColor, 0.1),
                    color: statusColor,
                    borderRadius: "20px",
                    px: "10px",
                    py: "2px",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                >
                  {interview.status}
                </Box>
              </Box>
              <Typography sx={{ fontSize: 14, color: COLORS.textMuted }}>
                {interview.type} · {interview.duration} min · Opened{" "}
                {formatDate(interview.start_date)}
              </Typography>
            </Box>
          </Box>

          <GradientButton
            size="sm"
            variant={isActive ? "danger" : "ghost"}
            onClick={closing ? undefined : handleToggleStatus}
            sx={{
              opacity: closing ? 0.6 : 1,
              pointerEvents: closing ? "none" : "auto",
            }}
          >
            {closing
              ? isActive
                ? "Closing..."
                : "Opening..."
              : isActive
                ? "Close Role"
                : "Open Role"}
          </GradientButton>
        </Box>
      </Box>

      {/* Application link */}
      <SoftCard
        className="fade-up-1"
        sx={{
          p: "16px 22px",
          mb: "18px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <Icon name="link" size={15} color={COLORS.indigo} />
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: COLORS.textLight,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              mb: "2px",
            }}
          >
            Application Link
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: COLORS.textMuted,
              fontFamily: "'DM Mono', monospace",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {applyUrl}
          </Typography>
        </Box>
        <Box
          onClick={handleCopy}
          sx={{
            px: "14px",
            py: "7px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
            transition: "all 0.15s",
            background: copied
              ? alpha(COLORS.green, 0.1)
              : alpha(COLORS.indigo, 0.08),
            color: copied ? COLORS.green : COLORS.indigo,
          }}
        >
          {copied ? "✓ Copied" : "Copy Link"}
        </Box>
      </SoftCard>

      {/* Stats */}
      <Box
        className="fade-up-2"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "13px",
          mb: "22px",
        }}
      >
        {[
          {
            label: "Total Applicants",
            val: applicants.length,
            color: COLORS.indigo,
          },
          {
            label: "Sessions Started",
            val: startedApplicants.length,
            color: COLORS.purple,
          },
          { label: "Recommended", val: recommendedCount, color: COLORS.green },
        ].map((s) => (
          <SoftCard key={s.label} sx={{ p: "18px 22px" }}>
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
                color: s.color,
                lineHeight: 1,
              }}
            >
              {s.val}
            </Typography>
          </SoftCard>
        ))}
      </Box>

      {/* Description + Skills */}
      <SoftCard className="fade-up-3" sx={{ p: "26px 28px", mb: "22px" }}>
        <Typography variant="h6" sx={{ fontSize: 14, mb: "12px" }}>
          Role Description
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1.7,
            color: COLORS.textMuted,
            mb: "20px",
          }}
        >
          {interview.description}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: 13,
            mb: "10px",
            color: COLORS.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: 700,
          }}
        >
          Required Skills
        </Typography>
        <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {skills.map((s) => (
            <Box
              key={s}
              sx={{
                background: alpha(COLORS.indigo, 0.08),
                color: COLORS.indigo,
                borderRadius: "20px",
                px: "12px",
                py: "5px",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {s}
            </Box>
          ))}
        </Box>
      </SoftCard>

      {/* Interview sessions */}
      <Box className="fade-up-4">
        <Typography variant="h6" sx={{ fontSize: 15, mb: "14px" }}>
          Interview Sessions
          <Box
            component="span"
            sx={{
              ml: "8px",
              fontSize: 13,
              fontWeight: 500,
              color: COLORS.textMuted,
            }}
          >
            ({startedApplicants.length})
          </Box>
        </Typography>

        {startedApplicants.length === 0 ? (
          <SoftCard sx={{ p: "48px", textAlign: "center" }}>
            <Typography sx={{ color: COLORS.textMuted }}>
              No sessions started yet. Share the application link to begin
              screening.
            </Typography>
          </SoftCard>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {startedApplicants.map(({ applicant, report }, i) => {
              const status = getApplicantStatus(applicant, report);
              return (
                <SoftCard
                  key={applicant.id}
                  sx={{
                    p: "18px 24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                  onClick={() => nav(`/org/applicants/${applicant.id}`)}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: `hsl(${i * 90 + 200},70%,92%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: `hsl(${i * 90 + 200},60%,40%)`,
                      flexShrink: 0,
                    }}
                  >
                    {applicant.name[0]}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{ fontWeight: 600, fontSize: 14, mb: "2px" }}
                    >
                      {applicant.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
                      {applicant.ended_session ? "Completed" : "In Progress"} ·{" "}
                      {formatDate(applicant.interview_date)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      background: alpha(STATUS_COLORS[status], 0.1),
                      color: STATUS_COLORS[status],
                      borderRadius: "20px",
                      px: "12px",
                      py: "3px",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {status}
                  </Box>
                  {report?.score !== null && report?.score !== undefined && (
                    <ScoreChip score={report.score} />
                  )}
                  <Typography sx={{ color: COLORS.textLight, fontSize: 16 }}>
                    →
                  </Typography>
                </SoftCard>
              );
            })}
          </Box>
        )}
      </Box>
    </SidebarLayout>
  );
};

export default OrgRoleDetail;
