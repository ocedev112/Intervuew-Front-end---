import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { COLORS, RADIUS, SHADOWS } from "../theme/theme";
import api from "../api/api";

interface InterviewData {
  role: string;
  type: string;
  description: string;
  startDate: string;
  endDate: string;
  requirements: string[];
  status: string;
}

export default function ApplyPage() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    file?: string;
    submit?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(
    null,
  );
  const [userId, setUserId] = useState(null);

  const param = useParams();
  const interviewId = param.interviewId;
  const nav = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/User/me");
        setUserId(response.data);
      } catch (err) {
        nav("/login");
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/Interview/full/${interviewId}`);
        const data = res.data;

        const parseRequirements = (job_requirements: string): string[] =>
          job_requirements
            .split("\n")
            .filter((l) => l.trim().startsWith("-"))
            .map((l) => l.replace("-", "").trim())
            .filter(Boolean);

        const formatDate = (dateStr: string) =>
          new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

        setInterviewData({
          role: data.role,
          type: `${data.type} · ${data.duration} min`,
          description: data.description,
          startDate: formatDate(data.start_date),
          endDate: formatDate(data.end_date),
          requirements: parseRequirements(data.job_requirements),
          status: data.status,
        });
      } catch {
        // non-blocking
      }
    };

    if (interviewId) fetchInterview();
  }, [interviewId]);

  const handleFile = (f: File | null) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setErrors((prev) => ({ ...prev, file: undefined }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!file) newErrors.file = "Please upload a PDF resume";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const { data: user } = await api.get("/User/me");

      const formData = new FormData();
      formData.append(
        "applicant",
        JSON.stringify({
          name: name.trim(),
          user_id: user.id,
        }),
      );
      formData.append("file", file!);

      await api.post(
        `/Applicant/create/?interview_id=${interviewId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setSubmitted(true);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrors({ submit: "You must be logged in to apply" });
      } else {
        setErrors({
          submit: error.response?.data?.detail || "Something went wrong",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: COLORS.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          width: "100%",
          maxWidth: 900,
          alignItems: "start",
        }}
      >
        {/* Left: Interview Details */}
        <Box
          sx={{
            bgcolor: COLORS.white,
            borderRadius: RADIUS.card,
            boxShadow: SHADOWS.card,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 3, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <Chip
              label={
                interviewData
                  ? interviewData.status === "active"
                    ? "Open position"
                    : "Closed position"
                  : "Loading..."
              }
              size="small"
              sx={{
                mb: 1.5,
                bgcolor:
                  interviewData?.status === "active" ? "#f0fdf4" : "#f3f4f6",
                color:
                  interviewData?.status === "active"
                    ? COLORS.green
                    : COLORS.textMuted,
                fontWeight: 600,
              }}
            />
            <Typography variant="h5">{interviewData?.role ?? "—"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {interviewData?.type ?? "—"}
            </Typography>
          </Box>

          <Box
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <Box>
              <Typography variant="overline">Description</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {interviewData?.description ?? "—"}
              </Typography>
            </Box>

            <Divider />

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <Box>
                <Typography variant="overline">Start date</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {interviewData?.startDate ?? "—"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="overline">End date</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {interviewData?.endDate ?? "—"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right: Application Form */}
        <Box
          sx={{
            bgcolor: COLORS.white,
            borderRadius: RADIUS.card,
            boxShadow: SHADOWS.card,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 3, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <Chip
              label="Application form"
              size="small"
              sx={{
                mb: 1.5,
                bgcolor: "#eff6ff",
                color: COLORS.blue,
                fontWeight: 600,
              }}
            />
            <Typography variant="h5">Apply for this role</Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in your details and upload your resume.
            </Typography>
          </Box>
          <Box
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            {/* Name */}
            <Box>
              <Typography
                variant="caption"
                sx={{ mb: 0.75, display: "block", color: COLORS.textMuted }}
              >
                Full name
              </Typography>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  height: 40,
                  padding: "0 12px",
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  border: `1.5px solid ${errors.name ? COLORS.red : "rgba(0,0,0,0.1)"}`,
                  borderRadius: RADIUS.input,
                  outline: "none",
                  background: "#FAFAFA",
                  color: COLORS.text,
                }}
              />
              {errors.name && (
                <Typography
                  variant="caption"
                  sx={{ color: COLORS.red, mt: 0.5, display: "block" }}
                >
                  {errors.name}
                </Typography>
              )}
            </Box>

            {/* File Upload */}
            <Box>
              <Typography
                variant="caption"
                sx={{ mb: 0.75, display: "block", color: COLORS.textMuted }}
              >
                Resume (PDF)
              </Typography>
              <Box
                onClick={() => document.getElementById("resume-input")?.click()}
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
                  borderRadius: RADIUS.input,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  bgcolor: dragOver ? "#f5f5ff" : "#FAFAFA",
                  "&:hover": {
                    borderColor: COLORS.indigo,
                    bgcolor: "#f5f5ff",
                  },
                }}
              >
                <input
                  id="resume-input"
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: RADIUS.icon,
                    bgcolor: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 1,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.blue}
                    strokeWidth="1.5"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  <span style={{ color: COLORS.blue, fontWeight: 600 }}>
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </Typography>
                <Typography variant="caption">PDF only, max 10MB</Typography>
              </Box>

              {file && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                    p: 1,
                    bgcolor: "#f0fdf4",
                    borderRadius: RADIUS.input,
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={COLORS.green}
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.green, fontWeight: 600 }}
                  >
                    {file.name}
                  </Typography>
                </Box>
              )}
              {errors.file && (
                <Typography
                  variant="caption"
                  sx={{ color: COLORS.red, mt: 0.5, display: "block" }}
                >
                  {errors.file}
                </Typography>
              )}
            </Box>

            {errors.submit && (
              <Typography variant="caption" sx={{ color: COLORS.red }}>
                {errors.submit}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              disabled={loading || submitted}
              onClick={handleSubmit}
              sx={{ height: 44 }}
            >
              {loading ? (
                <CircularProgress size={18} sx={{ color: "#fff" }} />
              ) : submitted ? (
                "Application submitted"
              ) : (
                "Submit application"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
