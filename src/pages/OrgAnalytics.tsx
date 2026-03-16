import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { SoftCard } from "../components/shared";
import { COLORS } from "../theme/theme";
import api from "../api/api";

interface Interview {
  id: string;
  role: string;
  status: string;
  duration: number;
  type: string;
}

interface Report {
  score: number | null;
  cheating_detected: boolean | null;
}

interface Applicant {
  id: string;
  name: string;
  started_session: boolean | null;
  ended_session: boolean | null;
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

const ROLE_COLORS = [
  COLORS.indigo,
  COLORS.green,
  COLORS.amber,
  COLORS.purple,
  COLORS.pink,
];

const getStatus = (applicant: Applicant, report: Report | null): string => {
  if (!applicant.started_session) return "Pending";
  if (report?.cheating_detected) return "Declined";
  if (report?.score !== null && report?.score !== undefined)
    return report.score >= 60 ? "Recommended" : "Declined";
  return "Pending";
};

const OrgAnalytics: React.FC = () => {
  const nav = useNavigate();
  const [anim, setAnim] = useState(false);
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [orgName, setOrgName] = useState(" ");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const meRes = await api.get("/Organization/me");
        const orgId = meRes.data.id;

        const jobsRes = await api.get(
          `/Organization/interview/candidate/report/${orgId}`,
        );

        const valid: JobEntry[] = (jobsRes.data as any[]).filter(
          (entry) => entry?.interview,
        );
        setJobs(valid);
        setTimeout(() => setAnim(true), 300);
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          nav("/login");
        }
      } finally {
        setLoading(false);
      }

      try {
        const nameRes = await api.get("/Organization");
        setOrgName(nameRes.data.name);
      } catch {}
    };

    fetchAll();
  }, []);

  // All applicants flat
  const allApplicants = jobs.flatMap((j) =>
    j.applicants.map((a) => ({
      ...a.applicant,
      role: j.interview.role,
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

  const recommended = allApplicants.filter(
    (a) => a.status === "Recommended",
  ).length;

  const conversionRate =
    totalCandidates > 0 ? Math.round((recommended / totalCandidates) * 100) : 0;

  // Status funnel
  const funnel = [
    {
      label: "Pending",
      val: allApplicants.filter((a) => a.status === "Pending").length,
    },
    {
      label: "Recommended",
      val: allApplicants.filter((a) => a.status === "Recommended").length,
    },
    {
      label: "Declined",
      val: allApplicants.filter((a) => a.status === "Declined").length,
    },
  ];

  // Top 5 roles by applicant count
  const top5Roles = [...jobs]
    .sort((a, b) => b.applicants.length - a.applicants.length)
    .slice(0, 5);

  // Score distribution per role — buckets based on each role's avg score
  const roleScoreData = top5Roles.map((j, i) => {
    const scores = j.applicants
      .map((a) => a.report?.score)
      .filter((s): s is number => s !== null && s !== undefined);
    const avg =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    return {
      role: j.interview.role,
      avg,
      total: j.applicants.length,
      color: ROLE_COLORS[i],
    };
  });

  const maxAvg = Math.max(...roleScoreData.map((r) => r.avg), 1);

  // Per-role stats table
  const roleStats = jobs
    .map((j) => {
      const scores = j.applicants
        .map((a) => a.report?.score)
        .filter((s): s is number => s !== null && s !== undefined);
      const avg =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : null;
      const rec = j.applicants.filter(
        (a) => getStatus(a.applicant, a.report) === "Recommended",
      ).length;
      return {
        id: j.interview.id,
        role: j.interview.role,
        total: j.applicants.length,
        avg,
        recommended: rec,
      };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <SidebarLayout
      userLabel={orgName}
      userInitial={orgName?.[0] ?? "O"}
      navItems={[
        { icon: "home", label: "Overview", to: `/org` },
        { icon: "briefcase", label: "Job Roles", to: `/org/interview` },
        { icon: "users", label: "Candidates", to: `/org/applicants` },
        {
          icon: "chart",
          label: "Analytics",
          active: true,
          to: `/org/analytics`,
        },
      ]}
    >
      <Box className="fade-up" sx={{ mb: "28px" }}>
        <Typography variant="h4" sx={{ fontSize: 25, mb: "4px" }}>
          Analytics
        </Typography>
        <Typography sx={{ fontSize: 15, color: COLORS.textMuted }}>
          Performance insights across all roles and candidates.
        </Typography>
      </Box>

      {/* Top KPIs */}
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
            label: "Total Interviewed",
            val: totalCandidates,
            unit: "",
            color: COLORS.indigo,
            sub: "all time",
          },
          {
            label: "Average Score",
            val: scoresOnly.length > 0 ? avgScore : "—",
            unit: "",
            color: COLORS.green,
            sub: "across all roles",
          },
          {
            label: "Recommended",
            val: recommended,
            unit: "",
            color: COLORS.amber,
            sub: "candidates",
          },
          {
            label: "Conversion Rate",
            val: totalCandidates > 0 ? conversionRate : "—",
            unit: totalCandidates > 0 ? "%" : "",
            color: COLORS.purple,
            sub: "to recommended",
          },
        ].map((s) => (
          <SoftCard key={s.label} sx={{ p: "20px 22px" }}>
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
                mb: "4px",
              }}
            >
              {loading ? "—" : `${s.val}${s.unit}`}
            </Typography>
            <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
              {s.sub}
            </Typography>
          </SoftCard>
        ))}
      </Box>

      {/* Score distribution (top 5 roles) + Funnel */}
      <Box
        className="fade-up-2"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
          mb: "18px",
        }}
      >
        {/* Score distribution — top 5 roles bar chart */}
        <SoftCard sx={{ p: "26px 28px" }}>
          <Typography variant="h6" sx={{ fontSize: 15, mb: "6px" }}>
            Score Distribution
          </Typography>
          <Typography
            sx={{ fontSize: 12, color: COLORS.textMuted, mb: "20px" }}
          >
            Average score · top 5 roles by applicants
          </Typography>

          {loading || roleScoreData.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>
              No data yet.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: "10px",
                height: 120,
                mb: "12px",
              }}
            >
              {roleScoreData.map((r, i) => {
                const h = anim ? (r.avg / maxAvg) * 100 : 4;
                return (
                  <Box
                    key={r.role}
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 11, fontWeight: 700, color: r.color }}
                    >
                      {r.avg || "—"}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: h,
                        borderRadius: "6px 6px 4px 4px",
                        background: `linear-gradient(180deg,${r.color},${alpha(r.color, 0.45)})`,
                        transition: `height 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 10,
                        color: COLORS.textMuted,
                        textAlign: "center",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {r.role}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Legend */}
          <Box
            sx={{ display: "flex", gap: "10px", flexWrap: "wrap", mt: "4px" }}
          >
            {roleScoreData.map((r) => (
              <Box
                key={r.role}
                sx={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: r.color,
                  }}
                />
                <Typography sx={{ fontSize: 10, color: COLORS.textMuted }}>
                  {r.total} applicant{r.total !== 1 ? "s" : ""}
                </Typography>
              </Box>
            ))}
          </Box>
        </SoftCard>

        {/* Candidate funnel */}
        <SoftCard sx={{ p: "26px 28px" }}>
          <Typography variant="h6" sx={{ fontSize: 15, mb: "20px" }}>
            Candidate Funnel
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {funnel.map((f) => (
              <Box key={f.label}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: "5px",
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                    {f.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: STATUS_COLORS[f.label],
                      fontFamily: "'DM Mono',monospace",
                    }}
                  >
                    {f.val}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 7,
                    borderRadius: 4,
                    background: "#F3F4F6",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width:
                        anim && totalCandidates > 0
                          ? `${(f.val / totalCandidates) * 100}%`
                          : "0%",
                      height: "100%",
                      borderRadius: 4,
                      background: STATUS_COLORS[f.label],
                      transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </SoftCard>
      </Box>

      {/* Role performance table */}
      <SoftCard className="fade-up-3" sx={{ p: "26px 28px" }}>
        <Typography variant="h6" sx={{ fontSize: 15, mb: "18px" }}>
          Performance by Role
        </Typography>

        {/* Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 80px",
            gap: "12px",
            pb: "10px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.textLight,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {["Role", "Applicants", "Recommended", "Avg Score", ""].map((h) => (
            <Box key={h}>{h}</Box>
          ))}
        </Box>

        {loading ? (
          <Typography
            sx={{ color: COLORS.textMuted, fontSize: 14, pt: "20px" }}
          >
            Loading...
          </Typography>
        ) : roleStats.length === 0 ? (
          <Typography
            sx={{ color: COLORS.textMuted, fontSize: 14, pt: "20px" }}
          >
            No data yet.
          </Typography>
        ) : (
          roleStats.map((r, i) => (
            <Box
              key={r.id}
              onClick={() => nav(`/org/interview/${r.id}`)}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 80px",
                gap: "12px",
                py: "13px",
                borderBottom:
                  i < roleStats.length - 1
                    ? "1px solid rgba(0,0,0,0.04)"
                    : "none",
                alignItems: "center",
                cursor: "pointer",
                borderRadius: "8px",
                transition: "background 0.15s",
                "&:hover": { background: alpha(COLORS.indigo, 0.03) },
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                {r.role}
              </Typography>
              <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>
                {r.total}
              </Typography>
              <Typography
                sx={{ fontSize: 13, color: COLORS.green, fontWeight: 600 }}
              >
                {r.recommended}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Box
                  sx={{
                    flex: 1,
                    height: 5,
                    borderRadius: 3,
                    background: "#F3F4F6",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: anim && r.avg !== null ? `${r.avg}%` : "0%",
                      height: "100%",
                      borderRadius: 3,
                      background:
                        r.avg !== null && r.avg >= 75
                          ? COLORS.green
                          : r.avg !== null && r.avg >= 60
                            ? COLORS.indigo
                            : COLORS.amber,
                      transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color:
                      r.avg !== null && r.avg >= 75
                        ? COLORS.green
                        : r.avg !== null && r.avg >= 60
                          ? COLORS.indigo
                          : COLORS.amber,
                    minWidth: 28,
                    textAlign: "right",
                    fontFamily: "'DM Mono',monospace",
                  }}
                >
                  {r.avg ?? "—"}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: COLORS.textLight,
                  fontSize: 16,
                  textAlign: "right",
                }}
              >
                →
              </Typography>
            </Box>
          ))
        )}
      </SoftCard>
    </SidebarLayout>
  );
};

export default OrgAnalytics;
