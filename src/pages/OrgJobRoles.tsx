import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { SoftCard, GradientButton } from "../components/shared";
import { Icon } from "../components/Icons";
import { COLORS } from "../theme/theme";
import api from "../api/api";

type StatusFilter = "All" | "Active" | "Closed";

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
  user_id: string | null;
}

interface JobEntry {
  applicants: any[];
  interview: Interview;
}

const statusColor = (s: string) =>
  s === "active" ? COLORS.green : COLORS.textLight;

const parseSkills = (job_requirements: string): string[] => {
  const lines = job_requirements.split("\n");
  return lines
    .filter((line) => line.trim().startsWith("-"))
    .map((line) => line.replace("-", "").trim())
    .filter(Boolean);
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const OrgJobRoles: React.FC = () => {
  const nav = useNavigate();
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [orgName, setOrgName] = useState(" ");
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch org identity and name in parallel
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
      } catch (err) {
        nav("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const filtered = jobs
    .filter((entry) => {
      const status = entry.interview.status;
      if (filter === "All") return true;
      return status.toLowerCase() === filter.toLowerCase();
    })
    .filter((entry) =>
      entry.interview.role.toLowerCase().includes(search.toLowerCase()),
    );

  const activeCount = jobs.filter(
    (e) => e.interview.status === "active",
  ).length;
  const closedCount = jobs.filter(
    (e) => e.interview.status !== "active",
  ).length;

  return (
    <SidebarLayout
      userLabel={orgName}
      userInitial={orgName?.[0] ?? "O"}
      navItems={[
        { icon: "home", label: "Overview", to: `/org` },
        {
          icon: "briefcase",
          label: "Job Roles",
          active: true,
          to: `/org/interview`,
        },
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
            Job Roles
          </Typography>
          <Typography sx={{ fontSize: 15, color: COLORS.textMuted }}>
            {jobs.length} roles total · {activeCount} active
          </Typography>
        </Box>
        <GradientButton size="md" onClick={() => nav(`/org/interview/new`)}>
          + Create Role
        </GradientButton>
      </Box>

      {/* Stats row */}
      <Box
        className="fade-up-1"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "13px",
          mb: "22px",
        }}
      >
        {[
          { label: "Active", val: activeCount, color: COLORS.green },
          { label: "Closed", val: closedCount, color: COLORS.textMuted },
        ].map((s) => (
          <SoftCard
            key={s.label}
            sx={{
              p: "18px 22px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: s.color,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.textMuted,
                flex: 1,
              }}
            >
              {s.label}
            </Typography>
            <Typography sx={{ fontSize: 26, fontWeight: 700, color: s.color }}>
              {s.val}
            </Typography>
          </SoftCard>
        ))}
      </Box>

      {/* Filters */}
      <Box
        className="fade-up-2"
        sx={{ display: "flex", gap: "12px", mb: "18px", flexWrap: "wrap" }}
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
            placeholder="Search roles..."
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
          {(["All", "Active", "Closed"] as StatusFilter[]).map((f) => (
            <Box
              key={f}
              onClick={() => setFilter(f)}
              sx={{
                px: "16px",
                py: "10px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background:
                  filter === f ? alpha(COLORS.indigo, 0.1) : "transparent",
                color: filter === f ? COLORS.indigo : COLORS.textMuted,
                transition: "all 0.15s",
              }}
            >
              {f}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Roles grid */}
      <Box
        className="fade-up-3"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "14px",
        }}
      >
        {loading ? (
          <Typography sx={{ color: COLORS.textMuted, fontSize: 14 }}>
            Loading roles...
          </Typography>
        ) : (
          filtered.map(({ interview, applicants }) => {
            const skills = parseSkills(interview.job_requirements);
            return (
              <SoftCard
                key={interview.id}
                sx={{ p: "24px 26px", cursor: "pointer" }}
                onClick={() => nav(`/org/interview/${interview.id}`)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: "14px",
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "12px" }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "13px",
                        background: alpha(COLORS.indigo, 0.08),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="briefcase" size={18} color={COLORS.indigo} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{ fontWeight: 700, fontSize: 15, mb: "2px" }}
                      >
                        {interview.role}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 12, color: COLORS.textMuted }}
                      >
                        {interview.type} · {interview.duration} min
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      background: alpha(statusColor(interview.status), 0.1),
                      color: statusColor(interview.status),
                      borderRadius: "20px",
                      px: "10px",
                      py: "3px",
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "capitalize",
                    }}
                  >
                    {interview.status}
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: COLORS.textMuted,
                    lineHeight: 1.6,
                    mb: "16px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {interview.description}
                </Typography>

                {/* Skills */}
                <Box
                  sx={{
                    display: "flex",
                    gap: "6px",
                    flexWrap: "wrap",
                    mb: "16px",
                  }}
                >
                  {skills.slice(0, 3).map((s) => (
                    <Box
                      key={s}
                      sx={{
                        background: alpha(COLORS.indigo, 0.07),
                        color: COLORS.indigo,
                        borderRadius: "20px",
                        px: "10px",
                        py: "3px",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {s}
                    </Box>
                  ))}
                  {skills.length > 3 && (
                    <Box
                      sx={{
                        background: "rgba(0,0,0,0.05)",
                        color: COLORS.textMuted,
                        borderRadius: "20px",
                        px: "10px",
                        py: "3px",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      +{skills.length - 3}
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: "14px",
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                  }}
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
                      {applicants.length}
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
                      Opened
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.text,
                        mt: "4px",
                      }}
                    >
                      {formatDate(interview.start_date)}
                    </Typography>
                  </Box>
                </Box>
              </SoftCard>
            );
          })
        )}

        {/* Create new role card */}
        <SoftCard
          sx={{
            p: "24px 26px",
            cursor: "pointer",
            border: "2px dashed rgba(91,93,246,0.2)",
            background: alpha(COLORS.indigo, 0.02),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            minHeight: 200,
          }}
          onClick={() => nav(`/org/interview/new`)}
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
            }}
          >
            <Icon name="plus" size={22} color={COLORS.indigo} />
          </Box>
          <Typography
            sx={{ fontSize: 15, fontWeight: 600, color: COLORS.indigo }}
          >
            Create New Role
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: COLORS.textMuted,
              textAlign: "center",
            }}
          >
            Set up a role and start receiving AI-screened candidates
          </Typography>
        </SoftCard>
      </Box>
    </SidebarLayout>
  );
};

export default OrgJobRoles;
