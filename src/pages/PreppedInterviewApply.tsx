import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { COLORS, RADIUS, SHADOWS } from "../theme/theme";
import { SoftCard, GradientButton } from "../components/shared";
import { Icon } from "../components/Icons";
import api from "../api/api";

interface InterviewRequest {
  role: string;
  description: string;
  start_date: string;
  end_date: string;
  duration: number;
  organization_id: null;
  user_id?: string;
  job_requirements: {
    role: string;
    languages: Record<string, number>[];
    domains: Record<string, number>[];
    softskills: string[];
  };
}

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
}> = ({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows = 4,
  type = "text",
}) => (
  <Box>
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
          boxSizing: "border-box",
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
          boxSizing: "border-box",
          "&:focus": { borderColor: COLORS.indigo, background: COLORS.white },
        }}
      />
    )}
  </Box>
);

const PrepApplyPage: React.FC = () => {
  const nav = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<
    "normal" | "loading" | "success" | "error"
  >("normal");
  const [langInput, setLangInput] = useState({ key: "", value: 0 });
  const [domainInput, setDomainInput] = useState({ key: "", value: 0 });
  const [softskillInput, setSoftskillInput] = useState("");

  const [interview, setInterview] = useState<InterviewRequest>({
    role: "",
    description: "",
    start_date: "",
    end_date: "",
    duration: 10,
    organization_id: null,
    job_requirements: {
      role: "",
      languages: [],
      domains: [],
      softskills: [],
    },
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/User/me");
        setUserId(res.data.id);
        setName(res.data.name ?? "");
      } catch {
        nav("/login");
      }
    };
    fetchMe();
  }, []);

  const handleFile = (f: File | null) => {
    if (f && f.type === "application/pdf") setFile(f);
  };

  const handleAddLanguage = () => {
    if (!langInput.key) return;
    if (interview.job_requirements.languages.some((l) => langInput.key in l)) {
      alert("Already added!");
      return;
    }
    setInterview((prev) => ({
      ...prev,
      job_requirements: {
        ...prev.job_requirements,
        languages: [
          ...prev.job_requirements.languages,
          { [langInput.key]: langInput.value },
        ],
      },
    }));
    setLangInput({ key: "", value: 0 });
  };

  const handleAddDomain = () => {
    if (!domainInput.key) return;
    if (interview.job_requirements.domains.some((d) => domainInput.key in d)) {
      alert("Already added!");
      return;
    }
    setInterview((prev) => ({
      ...prev,
      job_requirements: {
        ...prev.job_requirements,
        domains: [
          ...prev.job_requirements.domains,
          { [domainInput.key]: domainInput.value },
        ],
      },
    }));
    setDomainInput({ key: "", value: 0 });
  };

  const handleAddSoftskill = () => {
    const skill = softskillInput.trim();
    if (!skill) return;
    if (interview.job_requirements.softskills.includes(skill)) {
      alert("Already added!");
      return;
    }
    setInterview((prev) => ({
      ...prev,
      job_requirements: {
        ...prev.job_requirements,
        softskills: [...prev.job_requirements.softskills, skill],
      },
    }));
    setSoftskillInput("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!file) {
      alert("Please upload your resume (PDF)");
      return;
    }
    if (!interview.role || !interview.start_date || !interview.end_date) {
      alert("Please fill in all required fields");
      return;
    }
    if (!userId) {
      alert("Not authenticated");
      return;
    }

    setStatus("loading");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append(
        "request",
        JSON.stringify({
          ...interview,
          job_requirements: {
            ...interview.job_requirements,
            role: interview.role,
          },
        }),
      );
      formData.append("file", file);

      const res = await api.post(`/Prepper/create/new/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus("success");
      const { interview_id, applicant_id } = res.data;

      setTimeout(() => {
        nav(`/interview/${applicant_id}/${interview_id}`);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      alert(err?.response?.data?.detail || "Something went wrong");
      setTimeout(() => setStatus("normal"), 3000);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.bg,
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Header */}
      <Box sx={{ maxWidth: 1000, mx: "auto", mb: "28px" }}>
        <Box
          component="button"
          onClick={() => nav("/")}
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
          ← Back to Dashboard
        </Box>
        <Typography variant="h4" sx={{ fontSize: 25, mb: "4px" }}>
          New Prep Session
        </Typography>
        <Typography sx={{ fontSize: 15, color: COLORS.textMuted }}>
          Set up your role, upload your resume, and start practicing with AI.
        </Typography>
      </Box>

      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" },
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* Left col */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Personal Info */}
          <SoftCard sx={{ p: "26px 28px" }}>
            <Typography variant="h6" sx={{ fontSize: 14, mb: "18px" }}>
              Your Info
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field
                label="Full Name"
                value={name}
                onChange={setName}
                placeholder="John Doe"
              />

              {/* Resume upload */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLORS.textMuted,
                    mb: "6px",
                  }}
                >
                  Resume (PDF)
                </Typography>
                <Box
                  onClick={() =>
                    document.getElementById("resume-prep")?.click()
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFile(e.dataTransfer.files[0]);
                  }}
                  sx={{
                    border: `1.5px dashed ${dragOver ? COLORS.indigo : "rgba(0,0,0,0.12)"}`,
                    borderRadius: "12px",
                    p: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    bgcolor: dragOver ? alpha(COLORS.indigo, 0.04) : COLORS.bg,
                    "&:hover": {
                      borderColor: COLORS.indigo,
                      bgcolor: alpha(COLORS.indigo, 0.04),
                    },
                  }}
                >
                  <input
                    id="resume-prep"
                    type="file"
                    accept=".pdf"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "10px",
                      bgcolor: alpha(COLORS.indigo, 0.08),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: "8px",
                    }}
                  >
                    <Icon name="upload" size={15} color={COLORS.indigo} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <span style={{ color: COLORS.indigo, fontWeight: 600 }}>
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </Typography>
                  <Typography variant="caption">PDF only</Typography>
                </Box>
                {file && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      mt: "8px",
                      p: "8px 12px",
                      bgcolor: alpha(COLORS.green, 0.06),
                      borderRadius: "10px",
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: COLORS.green,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: COLORS.green,
                        fontWeight: 600,
                      }}
                    >
                      {file.name}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </SoftCard>

          {/* Role Details */}
          <SoftCard sx={{ p: "26px 28px" }}>
            <Typography variant="h6" sx={{ fontSize: 14, mb: "18px" }}>
              Role Details
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field
                label="Job Title"
                value={interview.role}
                onChange={(v) =>
                  setInterview((prev) => ({
                    ...prev,
                    role: v,
                    job_requirements: { ...prev.job_requirements, role: v },
                  }))
                }
                placeholder="e.g. Senior Frontend Engineer"
              />
              <Field
                label="Description"
                value={interview.description}
                onChange={(v) =>
                  setInterview((prev) => ({ ...prev, description: v }))
                }
                placeholder="What does this role involve?"
                multiline
                rows={3}
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
                  onChange={(v) =>
                    setInterview((prev) => ({ ...prev, start_date: v }))
                  }
                  type="datetime-local"
                />
                <Field
                  label="End Date"
                  value={interview.end_date}
                  onChange={(v) =>
                    setInterview((prev) => ({ ...prev, end_date: v }))
                  }
                  type="datetime-local"
                />
              </Box>
            </Box>
          </SoftCard>

          {/* Languages */}
          <SoftCard sx={{ p: "26px 28px" }}>
            <Typography variant="h6" sx={{ fontSize: 14, mb: "18px" }}>
              Languages & Frameworks
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
                placeholder="Yrs"
                sx={{
                  width: "80px",
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
            <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
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
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {key} · {value}y
                    <Box
                      onClick={() =>
                        setInterview((prev) => ({
                          ...prev,
                          job_requirements: {
                            ...prev.job_requirements,
                            languages: prev.job_requirements.languages.filter(
                              (l) => !(key in l),
                            ),
                          },
                        }))
                      }
                      sx={{
                        cursor: "pointer",
                        opacity: 0.6,
                        "&:hover": { opacity: 1 },
                        fontSize: 16,
                      }}
                    >
                      ×
                    </Box>
                  </Box>
                );
              })}
              {interview.job_requirements.languages.length === 0 && (
                <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
                  None added yet.
                </Typography>
              )}
            </Box>
          </SoftCard>

          {/* Domains */}
          <SoftCard sx={{ p: "26px 28px" }}>
            <Typography variant="h6" sx={{ fontSize: 14, mb: "18px" }}>
              Domains
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
                placeholder="Yrs"
                sx={{
                  width: "80px",
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
            <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
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
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {key} · {value}y
                    <Box
                      onClick={() =>
                        setInterview((prev) => ({
                          ...prev,
                          job_requirements: {
                            ...prev.job_requirements,
                            domains: prev.job_requirements.domains.filter(
                              (d) => !(key in d),
                            ),
                          },
                        }))
                      }
                      sx={{
                        cursor: "pointer",
                        opacity: 0.6,
                        "&:hover": { opacity: 1 },
                        fontSize: 16,
                      }}
                    >
                      ×
                    </Box>
                  </Box>
                );
              })}
              {interview.job_requirements.domains.length === 0 && (
                <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
                  None added yet.
                </Typography>
              )}
            </Box>
          </SoftCard>

          {/* Softskills */}
          <SoftCard sx={{ p: "26px 28px" }}>
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
            <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
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
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {skill}
                  <Box
                    onClick={() =>
                      setInterview((prev) => ({
                        ...prev,
                        job_requirements: {
                          ...prev.job_requirements,
                          softskills: prev.job_requirements.softskills.filter(
                            (s) => s !== skill,
                          ),
                        },
                      }))
                    }
                    sx={{
                      cursor: "pointer",
                      opacity: 0.6,
                      "&:hover": { opacity: 1 },
                      fontSize: 16,
                    }}
                  >
                    ×
                  </Box>
                </Box>
              ))}
              {interview.job_requirements.softskills.length === 0 && (
                <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
                  None added yet.
                </Typography>
              )}
            </Box>
          </SoftCard>
        </Box>

        {/* Right col — Preview + Submit */}
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

            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: "6px" }}>
              {interview.role || "Role title"}
            </Typography>

            {name && (
              <Typography
                sx={{ fontSize: 13, color: COLORS.textMuted, mb: "8px" }}
              >
                {name}
              </Typography>
            )}

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
              <Box sx={{ mb: "10px" }}>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: COLORS.textMuted,
                    mb: "6px",
                  }}
                >
                  Languages
                </Typography>
                <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {interview.job_requirements.languages
                    .slice(0, 4)
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
              <Box sx={{ mb: "10px" }}>
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

            {file && (
              <Box
                sx={{
                  mt: "12px",
                  pt: "12px",
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: COLORS.green,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{ fontSize: 12, color: COLORS.green, fontWeight: 600 }}
                >
                  {file.name}
                </Typography>
              </Box>
            )}
          </SoftCard>

          <GradientButton fullWidth size="lg" onClick={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {status === "loading" && (
                <CircularProgress size={15} sx={{ color: COLORS.white }} />
              )}
              {status === "success"
                ? "Starting session..."
                : status === "loading"
                  ? "Creating..."
                  : "Start Prep Session"}
            </Box>
          </GradientButton>

          <GradientButton fullWidth variant="ghost" onClick={() => nav("/")}>
            Cancel
          </GradientButton>
        </Box>
      </Box>
    </Box>
  );
};

export default PrepApplyPage;
