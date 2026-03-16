import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import { SoftCard, GradientButton } from "../components/shared";
import { COLORS } from "../theme/theme";
import { InterviewRequest } from "@/types";
import { CircularProgress } from "@mui/material";
import api from "../api/api";

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  width?: string | number;
}> = ({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows = 4,
  type = "text",
  width = "100%",
}) => (
  <Box sx={{ width }}>
    <Typography
      sx={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, mb: "6px" }}
    >
      {label}
    </Typography>
    {multiline ? (
      <Box
        component="textarea"
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        sx={{
          width: "200%",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "12px",
          padding: "10px 14px",
          fontSize: 14,
          fontFamily: "'DM Sans',sans-serif",
          background: COLORS.bg,
          color: COLORS.text,
          outline: "none",
          resize: "none",
          "&:focus": { borderColor: COLORS.indigo, background: COLORS.white },
        }}
      />
    ) : (
      <Box
        component="input"
        type={type}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder}
        sx={{
          width: "100%",
          border: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "12px",
          padding: "10px 14px",
          fontSize: 14,
          fontFamily: "'DM Sans',sans-serif",
          background: COLORS.bg,
          color: COLORS.text,
          outline: "none",
          resize: "none",
          "&:focus": { borderColor: COLORS.indigo, background: COLORS.white },
        }}
      />
    )}
  </Box>
);

const OrgCreateRole: React.FC = () => {
  const [status, setStatus] = useState<
    "loading" | "error" | "normal" | "success"
  >("normal");
  const [orgName, setOrgName] = useState(" ");

  const [interview, setInterview] = useState<InterviewRequest>({
    role: "",
    description: "",
    organization_id: "",
    start_date: "",
    end_date: "",
    duration: 10,
    job_requirements: {
      role: "",
      languages: [],
      domains: [],
      softskills: [],
    },
  });

  const nav = useNavigate();
  const [langInput, setLangInput] = useState({ key: "", value: 0 });
  const [domainInput, setDomainInput] = useState({ key: "", value: 0 });
  const [softskillInput, setSoftskillInput] = useState("");

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await api.get("/Organization");
        setOrgName(res.data.name);
      } catch {}
    };
    fetchOrg();
  }, []);

  const handleAddLanguage = () => {
    if (!langInput.key) return;
    const languageExists = interview.job_requirements.languages.some(
      (lang) => langInput.key in lang,
    );
    if (languageExists) {
      alert("Language already added!");
      return;
    }
    setInterview({
      ...interview,
      job_requirements: {
        ...interview.job_requirements,
        languages: [
          ...interview.job_requirements.languages,
          { [langInput.key]: langInput.value },
        ],
      },
    });
    setLangInput({ key: "", value: 0 });
  };

  const handleAddDomain = () => {
    if (!domainInput.key) return;
    const domainExists = interview.job_requirements.domains.some(
      (domain) => domainInput.key in domain,
    );
    if (domainExists) {
      alert("Domain already added!");
      return;
    }
    setInterview({
      ...interview,
      job_requirements: {
        ...interview.job_requirements,
        domains: [
          ...interview.job_requirements.domains,
          { [domainInput.key]: domainInput.value },
        ],
      },
    });
    setDomainInput({ key: "", value: 0 });
  };

  const handleAddSoftskill = () => {
    const skill = softskillInput.trim();
    if (!skill) return;
    if (interview.job_requirements.softskills.includes(skill)) {
      alert("Softskill already added!");
      return;
    }
    setInterview({
      ...interview,
      job_requirements: {
        ...interview.job_requirements,
        softskills: [...interview.job_requirements.softskills, skill],
      },
    });
    setSoftskillInput("");
  };

  const handleRemoveLanguage = (key: string) => {
    setInterview({
      ...interview,
      job_requirements: {
        ...interview.job_requirements,
        languages: interview.job_requirements.languages.filter(
          (lang) => !(key in lang),
        ),
      },
    });
  };

  const handleRemoveDomain = (key: string) => {
    setInterview({
      ...interview,
      job_requirements: {
        ...interview.job_requirements,
        domains: interview.job_requirements.domains.filter(
          (domain) => !(key in domain),
        ),
      },
    });
  };

  const handleRemoveSoftskill = (skill: string) => {
    setInterview({
      ...interview,
      job_requirements: {
        ...interview.job_requirements,
        softskills: interview.job_requirements.softskills.filter(
          (s) => s !== skill,
        ),
      },
    });
  };

  const createInterview = async () => {
    try {
      if (!interview.role || !interview.start_date || !interview.end_date) {
        alert("Please fill in all required fields");
        return;
      }
      if (
        !interview.duration ||
        interview.duration < 10 ||
        interview.duration > 40
      ) {
        alert("Duration must be between 10 and 40 minutes");
        return;
      }

      setStatus("loading");

      const meRes = await api.get("/Organization/me");
      const orgId = meRes.data.id;

      const request = {
        ...interview,
        organization_id: orgId,
      };

      console.log("Sending request:", JSON.stringify(request, null, 2));

      const response = await api.post("/Interview/create", request);
      console.log("Interview created successfully:", response.data);

      setStatus("success");
      alert("Role created successfully!");
      setTimeout(() => setStatus("normal"), 3000);
    } catch (error) {
      console.error("Error creating interview:", error);
      setStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create interview";
      alert(errorMessage);
      setTimeout(() => setStatus("normal"), 3000);
    }
  };

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
        <Typography variant="h4" sx={{ fontSize: 25, mb: "4px" }}>
          Create An Interview
        </Typography>
        <Typography sx={{ fontSize: 15, color: COLORS.textMuted }}>
          Set up the role and AI will generate tailored interview questions.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* Left col */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <SoftCard className="fade-up-1" sx={{ p: "26px 28px" }}>
            <Typography variant="h6" sx={{ fontSize: 14, mb: "18px" }}>
              Role Details
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Field
                label="Job Title"
                value={interview.role}
                onChange={(v: string) => {
                  setInterview((prev) => ({
                    ...prev,
                    role: v,
                    job_requirements: {
                      ...prev.job_requirements,
                      role: v,
                    },
                  }));
                }}
                placeholder="e.g. Senior Product Manager"
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                }}
              >
                <Field
                  label="Start Date"
                  value={interview.start_date}
                  onChange={(v: string) =>
                    setInterview({ ...interview, start_date: v })
                  }
                  type="datetime-local"
                />
                <Field
                  label="End Date"
                  value={interview.end_date}
                  onChange={(v: string) =>
                    setInterview({ ...interview, end_date: v })
                  }
                  type="datetime-local"
                />
                <Field
                  label="Description"
                  value={interview.description}
                  onChange={(v: string) =>
                    setInterview({ ...interview, description: v })
                  }
                  placeholder="Enter Job description"
                  multiline
                  rows={4}
                />
              </Box>
            </Box>
          </SoftCard>

          {/* Languages */}
          <SoftCard className="fade-up-2" sx={{ p: "26px 28px" }}>
            <Typography variant="h6" sx={{ fontSize: 14, mb: "18px" }}>
              Languages and Frameworks (with Experience)
            </Typography>
            <Box sx={{ display: "flex", gap: "8px", mb: "12px" }}>
              <Box
                component="input"
                value={langInput.key}
                onChange={(e: any) =>
                  setLangInput({ ...langInput, key: e.target.value })
                }
                placeholder="e.g. Python"
                sx={{
                  flex: 1,
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontSize: 14,
                  fontFamily: "'DM Sans',sans-serif",
                  background: COLORS.bg,
                  color: COLORS.text,
                  outline: "none",
                  "&:focus": { borderColor: COLORS.indigo },
                }}
              />
              <Box
                component="input"
                type="number"
                value={langInput.value || ""}
                onChange={(e: any) =>
                  setLangInput({ ...langInput, value: Number(e.target.value) })
                }
                placeholder="Years"
                sx={{
                  width: "100px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontSize: 14,
                  fontFamily: "'DM Sans',sans-serif",
                  background: COLORS.bg,
                  color: COLORS.text,
                  outline: "none",
                  "&:focus": { borderColor: COLORS.indigo },
                }}
              />
              <GradientButton size="sm" onClick={handleAddLanguage}>
                Add
              </GradientButton>
            </Box>
            <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", mt: 2 }}>
              {interview.job_requirements.languages.map((lang) => {
                const [key, value] = Object.entries(lang)[0];
                return (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: alpha(COLORS.indigo, 0.08),
                      color: COLORS.indigo,
                      borderRadius: "20px",
                      px: "12px",
                      py: "5px",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {key} | {value} yrs
                    <Box
                      onClick={() => handleRemoveLanguage(key)}
                      sx={{
                        cursor: "pointer",
                        opacity: 0.6,
                        "&:hover": { opacity: 1 },
                        fontSize: 16,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </Box>
                  </Box>
                );
              })}
              {interview.job_requirements.languages.length === 0 && (
                <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>
                  No languages added yet.
                </Typography>
              )}
            </Box>
          </SoftCard>

          {/* Domains */}
          <SoftCard className="fade-up-2" sx={{ p: "26px 28px" }}>
            <Typography variant="h6" sx={{ fontSize: 14, mb: "18px" }}>
              Domains (with Experience)
            </Typography>
            <Box sx={{ display: "flex", gap: "8px", mb: "12px" }}>
              <Box
                component="input"
                value={domainInput.key}
                onChange={(e: any) =>
                  setDomainInput({ ...domainInput, key: e.target.value })
                }
                placeholder="e.g. Machine Learning"
                sx={{
                  flex: 1,
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontSize: 14,
                  fontFamily: "'DM Sans',sans-serif",
                  background: COLORS.bg,
                  color: COLORS.text,
                  outline: "none",
                  "&:focus": { borderColor: COLORS.indigo },
                }}
              />
              <Box
                component="input"
                type="number"
                value={domainInput.value || ""}
                onChange={(e: any) =>
                  setDomainInput({
                    ...domainInput,
                    value: Number(e.target.value),
                  })
                }
                placeholder="Years"
                sx={{
                  width: "100px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontSize: 14,
                  fontFamily: "'DM Sans',sans-serif",
                  background: COLORS.bg,
                  color: COLORS.text,
                  outline: "none",
                  "&:focus": { borderColor: COLORS.indigo },
                }}
              />
              <GradientButton size="sm" onClick={handleAddDomain}>
                Add
              </GradientButton>
            </Box>
            <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", mt: 2 }}>
              {interview.job_requirements.domains.map((domain) => {
                const [key, value] = Object.entries(domain)[0];
                return (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: alpha(COLORS.indigo, 0.08),
                      color: COLORS.indigo,
                      borderRadius: "20px",
                      px: "12px",
                      py: "5px",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {key} | {value} yrs
                    <Box
                      onClick={() => handleRemoveDomain(key)}
                      sx={{
                        cursor: "pointer",
                        opacity: 0.6,
                        "&:hover": { opacity: 1 },
                        fontSize: 16,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </Box>
                  </Box>
                );
              })}
              {interview.job_requirements.domains.length === 0 && (
                <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>
                  No domains added yet.
                </Typography>
              )}
            </Box>
          </SoftCard>

          {/* Softskills */}
          <SoftCard className="fade-up-2" sx={{ p: "26px 28px" }}>
            <Typography variant="h6" sx={{ fontSize: 14, mb: "18px" }}>
              Softskills
            </Typography>
            <Box sx={{ display: "flex", gap: "8px", mb: "12px" }}>
              <Box
                component="input"
                value={softskillInput}
                onChange={(e: any) => setSoftskillInput(e.target.value)}
                onKeyDown={(e: any) =>
                  e.key === "Enter" && handleAddSoftskill()
                }
                placeholder="Tools and attitude e.g. (Git, Docker, Problem Solving)"
                sx={{
                  flex: 1,
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  fontSize: 14,
                  fontFamily: "'DM Sans',sans-serif",
                  background: COLORS.bg,
                  color: COLORS.text,
                  outline: "none",
                  "&:focus": { borderColor: COLORS.indigo },
                }}
              />
              <GradientButton size="sm" onClick={handleAddSoftskill}>
                Add
              </GradientButton>
            </Box>
            <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", mt: 2 }}>
              {interview.job_requirements.softskills.map((skill) => (
                <Box
                  key={skill}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: alpha(COLORS.indigo, 0.08),
                    color: COLORS.indigo,
                    borderRadius: "20px",
                    px: "12px",
                    py: "5px",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {skill}
                  <Box
                    onClick={() => handleRemoveSoftskill(skill)}
                    sx={{
                      cursor: "pointer",
                      opacity: 0.6,
                      "&:hover": { opacity: 1 },
                      fontSize: 16,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </Box>
                </Box>
              ))}
              {interview.job_requirements.softskills.length === 0 && (
                <Typography sx={{ fontSize: 13, color: COLORS.textMuted }}>
                  No softskills added yet.
                </Typography>
              )}
            </Box>
          </SoftCard>
        </Box>

        {/* Right col - Preview */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <SoftCard
            sx={{
              p: "22px 24px",
              background: alpha(COLORS.indigo, 0.03),
              border: `1px solid ${alpha(COLORS.indigo, 0.1)}`,
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: COLORS.indigo,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                mb: "12px",
              }}
            >
              Preview
            </Typography>

            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: "8px" }}>
              {interview.role || "Role title"}
            </Typography>

            {interview.description && (
              <Typography
                sx={{
                  fontSize: 13,
                  color: COLORS.textMuted,
                  lineHeight: 1.6,
                  mb: "12px",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {interview.description}
              </Typography>
            )}

            {(interview.start_date || interview.end_date) && (
              <Box sx={{ display: "flex", gap: "16px", mb: "12px" }}>
                {interview.start_date && (
                  <Box>
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
                      Start
                    </Typography>
                    <Typography
                      sx={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}
                    >
                      {new Date(interview.start_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </Typography>
                  </Box>
                )}
                {interview.end_date && (
                  <Box>
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
                      End
                    </Typography>
                    <Typography
                      sx={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}
                    >
                      {new Date(interview.end_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {interview.job_requirements.languages.length > 0 && (
              <Box sx={{ mb: "12px" }}>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: COLORS.textMuted,
                    mb: "6px",
                  }}
                >
                  Languages & Frameworks
                </Typography>
                <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {interview.job_requirements.languages
                    .slice(0, 3)
                    .map((lang) => {
                      const [key, value] = Object.entries(lang)[0];
                      return (
                        <Box
                          key={key}
                          sx={{
                            background: alpha(COLORS.indigo, 0.1),
                            color: COLORS.indigo,
                            borderRadius: "20px",
                            px: "10px",
                            py: "3px",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {key} ({value}y)
                        </Box>
                      );
                    })}
                </Box>
              </Box>
            )}

            {interview.job_requirements.domains.length > 0 && (
              <Box sx={{ mb: "12px" }}>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: COLORS.textMuted,
                    mb: "6px",
                  }}
                >
                  Domains
                </Typography>
                <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {interview.job_requirements.domains
                    .slice(0, 3)
                    .map((domain) => {
                      const [key, value] = Object.entries(domain)[0];
                      return (
                        <Box
                          key={key}
                          sx={{
                            background: alpha(COLORS.indigo, 0.1),
                            color: COLORS.indigo,
                            borderRadius: "20px",
                            px: "10px",
                            py: "3px",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {key} ({value}y)
                        </Box>
                      );
                    })}
                </Box>
              </Box>
            )}

            {interview.job_requirements.softskills.length > 0 && (
              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: COLORS.textMuted,
                    mb: "6px",
                  }}
                >
                  Softskills
                </Typography>
                <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {interview.job_requirements.softskills
                    .slice(0, 4)
                    .map((skill) => (
                      <Box
                        key={skill}
                        sx={{
                          background: alpha(COLORS.indigo, 0.1),
                          color: COLORS.indigo,
                          borderRadius: "20px",
                          px: "10px",
                          py: "3px",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                </Box>
              </Box>
            )}
          </SoftCard>

          <GradientButton fullWidth size="lg" onClick={createInterview}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {status === "loading" && (
                <CircularProgress size={15} sx={{ color: COLORS.white }} />
              )}{" "}
              {status === "success" ? "Role Created!" : "Create Role"}
            </Box>
          </GradientButton>
          <GradientButton
            fullWidth
            variant="ghost"
            onClick={() => nav("/org/interview")}
          >
            Cancel
          </GradientButton>
        </Box>
      </Box>
    </SidebarLayout>
  );
};

export default OrgCreateRole;
