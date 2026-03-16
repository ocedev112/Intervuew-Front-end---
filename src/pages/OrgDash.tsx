import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { SoftCard, GradientButton } from "../components/shared";
import { Icon } from "../components/Icons";
import { COLORS } from "../theme/theme";
import api from "../api/api";

interface Interview {
  id: string;
  role: string;
  description: string;
  status: string;
  start_date: string;
  duration: number;
  job_requirements: string;
  type: string;
}

interface Applicant {
  id: string;
  name: string;
  interview_date: string | null;
  started_session: boolean | null;
  ended_session: boolean | null;
}

interface Report {
  score: number | null;
  cheating_detected: boolean | null;
}

interface JobEntry {
  interview: Interview;
  applicants: { applicant: Applicant; report: Report | null }[];
}

const STATUS_COLORS: Record<string, string> = {
  Recommended: COLORS.green,
  Pending: COLORS.amber,
  Declined: COLORS.red,
};

const getStatus = (applicant: Applicant, report: Report | null): string => {
  if (!applicant.started_session) return "Pending";
  if (report?.cheating_detected) return "Declined";
  if (report?.score !== null && report?.score !== undefined)
    return report.score >= 60 ? "Recommended" : "Declined";
  return "Pending";
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const OrgDash: React.FC = () => {
  const nav = useNavigate();
  const [orgName, setOrgName] = useState(" ");
  const [jobs, setJobs] = useState<JobEntry[]>([]);
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

        const jobsRes = await api.get(
          `/Organization/interview/candidate/report/${orgId}`,
        );

        const valid: JobEntry[] = (jobsRes.data as any[]).filter(
          (entry) => entry?.interview,
        );
        setJobs(valid);
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          nav("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Derived stats
  const activeRoles = jobs.filter((j) => j.interview.status === "active");

  const allApplicants = jobs.flatMap((j) =>
    j.applicants.map((a) => ({
      ...a.applicant,
      role: j.interview.role,
      interviewId: j.interview.id,
      report: a.report,
      status: getStatus(a.applicant, a.report),
    })),
  );

  const totalCandidates = allApplicants.length;

  const scoresOnly = allApplicants
    .map((a) => a.report?.score)
    .filter((s): s is number => s !== null && s !== undefined);
  const avgScore =
    scoresOnly.length > 0
      ? Math.round(scoresOnly.reduce((a, b) => a + b, 0) / scoresOnly.length)
      : 0;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeek = allApplicants.filter(
    (a) => a.interview_date && new Date(a.interview_date) >= oneWeekAgo,
  ).length;

  const recentCandidates = [...allApplicants]
    .filter((a) => a.interview_date)
    .sort(
      (a, b) =>
        new Date(b.interview_date!).getTime() -
        new Date(a.interview_date!).getTime(),
    )
    .slice(0, 4);

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
          mb: "32px",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontSize: 25, mb: "4px" }}>
            Organization Dashboard
          </Typography>
          <Typography sx={{ fontSize: 15, color: COLORS.textMuted }}>
            Manage interviews, candidates, and analytics.
          </Typography>
        </Box>
        <GradientButton size="md" onClick={() => nav(`/org/interview/new`)}>
          + Create Job Role
        </GradientButton>
      </Box>

      {/* Stats */}
      <Box
        className="fade-up-1"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "13px",
          mb: "22px",
        }}
      >
        {[
          {
            label: "Active Roles",
            val: activeRoles.length,
            color: COLORS.indigo,
            to: "/org/interview",
          },
          {
            label: "Candidates",
            val: totalCandidates,
            color: COLORS.purple,
            to: "/org/applicants",
          },
          {
            label: "This Week",
            val: thisWeek,
            color: COLORS.green,
            to: "/org/applicants",
          },
          {
            label: "Avg. Score",
            val: scoresOnly.length > 0 ? avgScore : "—",
            color: COLORS.amber,
            to: "/org/analytics",
          },
        ].map((c) => (
          <SoftCard
            key={c.label}
            sx={{ p: "20px 22px", cursor: "pointer" }}
            onClick={() => nav(c.to)}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: COLORS.textMuted,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                mb: "9px",
              }}
            >
              {c.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: c.color,
                lineHeight: 1,
              }}
            >
              {loading ? "—" : c.val}
            </Typography>
          </SoftCard>
        ))}
      </Box>

      {/* Recent candidates table */}
      <SoftCard
        className="fade-up-2"
        sx={{ p: "26px", overflow: "hidden", mb: "22px" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "20px",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: 15 }}>
            Recent Candidates
          </Typography>
          <Typography
            onClick={() => nav("/org/applicants")}
            sx={{
              fontSize: 13,
              color: COLORS.indigo,
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            View all →
          </Typography>
        </Box>

        {/* Table header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1.3fr",
            gap: "12px",
            pb: "11px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.textLight,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {["Candidate", "Role", "Date", "Score", "Status"].map((h) => (
            <Box key={h}>{h}</Box>
          ))}
        </Box>

        {loading ? (
          <Typography
            sx={{ color: COLORS.textMuted, fontSize: 14, pt: "20px" }}
          >
            Loading...
          </Typography>
        ) : recentCandidates.length === 0 ? (
          <Typography
            sx={{ color: COLORS.textMuted, fontSize: 14, pt: "20px" }}
          >
            No candidates yet.
          </Typography>
        ) : (
          recentCandidates.map((c, i) => (
            <Box
              key={c.id}
              onClick={() => nav(`/org/applicants/${c.id}`)}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1.3fr",
                gap: "12px",
                py: "13px",
                borderBottom:
                  i < recentCandidates.length - 1
                    ? "1px solid rgba(0,0,0,0.04)"
                    : "none",
                alignItems: "center",
                cursor: "pointer",
                borderRadius: "8px",
                transition: "background 0.15s",
                "&:hover": { background: alpha(COLORS.indigo, 0.03) },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: `hsl(${i * 70 + 200},70%,92%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: `hsl(${i * 70 + 200},60%,40%)`,
                    flexShrink: 0,
                  }}
                >
                  {c.name[0]}
                </Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {c.name}
                </Typography>
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
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'DM Mono',monospace",
                  color:
                    c.report?.score !== null && c.report?.score !== undefined
                      ? COLORS.text
                      : COLORS.textLight,
                }}
              >
                {c.report?.score ?? "—"}
              </Typography>
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
            </Box>
          ))
        )}
      </SoftCard>

      {/* Active job roles */}
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
            Active Job Roles
          </Typography>
          <Typography
            onClick={() => nav(`/org/interview`)}
            sx={{
              fontSize: 13,
              color: COLORS.indigo,
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Manage →
          </Typography>
        </Box>

        {loading ? (
          <Typography sx={{ color: COLORS.textMuted, fontSize: 14 }}>
            Loading...
          </Typography>
        ) : activeRoles.length === 0 ? (
          <SoftCard sx={{ p: "32px", textAlign: "center" }}>
            <Typography sx={{ color: COLORS.textMuted }}>
              No active roles. Create one to start screening candidates.
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
            {activeRoles.slice(0, 3).map((j) => {
              const recommended = j.applicants.filter(
                (a) => getStatus(a.applicant, a.report) === "Recommended",
              ).length;
              const scoresArr = j.applicants
                .map((a) => a.report?.score)
                .filter((s): s is number => s !== null && s !== undefined);
              const avg =
                scoresArr.length > 0
                  ? Math.round(
                      scoresArr.reduce((a, b) => a + b, 0) / scoresArr.length,
                    )
                  : null;

              return (
                <SoftCard
                  key={j.interview.id}
                  sx={{ p: "20px 22px", cursor: "pointer" }}
                  onClick={() => nav(`/org/interview/${j.interview.id}`)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
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
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                        {j.interview.role}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 12, color: COLORS.textMuted }}
                      >
                        {j.interview.duration} min · {j.interview.type}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: COLORS.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          mb: "2px",
                        }}
                      >
                        Candidates
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: COLORS.indigo,
                        }}
                      >
                        {j.applicants.length}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: COLORS.textMuted,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          mb: "2px",
                        }}
                      >
                        Avg Score
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: COLORS.green,
                        }}
                      >
                        {avg ?? "—"}
                      </Typography>
                    </Box>
                  </Box>
                </SoftCard>
              );
            })}
          </Box>
        )}
      </Box>
    </SidebarLayout>
  );
};

export default OrgDash;
