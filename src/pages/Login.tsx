import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Alert,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Psychology,
  Business,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { GradientButton } from "../components/shared";
import { UserRole } from "../types";
import api from "../api/api";

const Login: React.FC = () => {
  const nav = useNavigate();
  const [role, setRole] = useState<UserRole>("applicant");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isSignup) {
        await createAccount(formData, role);
      } else {
        await handleLogin(formData, role);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (data: typeof formData, type: typeof role) => {
    const loginData = { email: data.email, password: data.password };
    try {
      if (type === "applicant") {
        const res = await api.post("/User/login", loginData);
        localStorage.setItem("user_id", res.data.id);
        nav("/dashboard");
      } else {
        const res = await api.post("/Organization/login", loginData);
        localStorage.setItem("org_id", res.data.id);
        nav("/org");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password");
    }
  };

  const createAccount = async (data: typeof formData, type: typeof role) => {
    try {
      if (type === "applicant") {
        const res = await api.post("/User/create", data);
        localStorage.setItem("user_id", res.data.id);
        nav("/dashboard");
      } else {
        const res = await api.post("/Organization/create", data);
        localStorage.setItem("org_id", res.data.id);
        nav("/org");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not create account");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F8F9FC",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <Box
        sx={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(91, 94, 246, 0.72) 0%, transparent 70%)",
          top: "-200px",
          right: "-200px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(154, 143, 255, 0.81) 0%, transparent 70%)",
          bottom: "-150px",
          left: "-150px",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 440,
          px: 3,
        }}
      >
        {/* Glass card */}
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            border: `1px solid ${alpha("#5B5DF6", 0.1)}`,
            boxShadow: "0px 24px 64px rgba(91,93,246,0.1)",
            p: 4,
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                mx: "auto",
                mb: 2,
                background: "linear-gradient(135deg, #5B5DF6, #9B8FFF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Psychology sx={{ color: "#fff", fontSize: 26 }} />
            </Box>
          </Box>

          <Typography
            variant="h4"
            sx={{ mb: 0.5, textAlign: "center", fontSize: "1.375rem" }}
          >
            {isSignup ? "Create account" : "Welcome back"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#8B8FA8", textAlign: "center", mb: 3 }}
          >
            {isSignup
              ? "Start your free interview journey"
              : "Sign in to continue"}
          </Typography>

          {/* Role Toggle */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#8B8FA8",
                fontWeight: 600,
                letterSpacing: "0.08em",
                mb: 1,
                display: "block",
              }}
            >
              I AM A
            </Typography>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(_e, v) => v && setRole(v)}
              fullWidth
              sx={{
                "& .MuiToggleButton-root": {
                  borderRadius: "10px !important",
                  border: `1px solid ${alpha("#5B5DF6", 0.15)} !important`,
                  color: "#8B8FA8",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  py: 1.25,
                  transition: "all 200ms",
                  "&.Mui-selected": {
                    bgcolor: alpha("#5B5DF6", 0.08),
                    color: "#5B5DF6",
                    fontWeight: 600,
                    border: `1px solid ${alpha("#5B5DF6", 0.3)} !important`,
                  },
                },
                gap: 1,
              }}
            >
              <ToggleButton value="applicant" disableRipple>
                <Person sx={{ fontSize: 16, mr: 1 }} />
                Applicant
              </ToggleButton>
              <ToggleButton value="org" disableRipple>
                <Business sx={{ fontSize: 16, mr: 1 }} />
                Organization
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2.5, borderRadius: 2, fontSize: "0.8125rem" }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            {isSignup && (
              <TextField
                label={role === "org" ? "Company Name" : "Full Name"}
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              label="Email address"
              fullWidth
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Password"
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      size="small"
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <GradientButton fullWidth size="md" sx={{ mb: 2.5, py: "13px" }}>
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create Account →"
                  : "Sign In →"}
            </GradientButton>
          </Box>

          <Typography
            sx={{ textAlign: "center", fontSize: "0.875rem", color: "#8B8FA8" }}
          >
            {isSignup ? "Already have an account? " : "New to Intervuew? "}
            <Box
              component="span"
              sx={{
                color: "#5B5DF6",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Sign in" : "Create account"}
            </Box>
          </Typography>
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            mt: 3,
            fontSize: "0.75rem",
            color: "#B0B3C6",
          }}
        >
          By continuing, you agree to our Terms & Privacy Policy
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
