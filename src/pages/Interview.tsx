import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Slider } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { Icon, LogoSVG } from "../components/Icons";
import { COLORS } from "../theme/theme";
import { ApplicantDict, InterviewDict, TranscriptEntry } from "../types";
import api from "../api/api";

const NATIVE_SAMPLE_RATE = 48000;
const TARGET_SAMPLE_RATE = 16000;
const DOWNSAMPLE_RATIO = NATIVE_SAMPLE_RATE / TARGET_SAMPLE_RATE;
const CHUNK_SAMPLES = TARGET_SAMPLE_RATE / 10;

function downsampleBuffer(buffer: Float32Array, ratio: number): Float32Array {
  if (ratio === 1) return buffer;
  const outputLength = Math.floor(buffer.length / ratio);
  const result = new Float32Array(outputLength);
  for (let i = 0; i < outputLength; i++) {
    let sum = 0;
    const start = Math.floor(i * ratio);
    const end = Math.min(start + ratio, buffer.length);
    for (let j = start; j < end; j++) {
      sum += buffer[j];
    }
    result[i] = sum / (end - start);
  }
  return result;
}

const Interview: React.FC = () => {
  const nav = useNavigate();
  const [speaking, setSpeaking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [micActive] = useState(true);
  const [applicant, setApplicant] = useState<ApplicantDict | null>(null);
  const [interview, setInterview] = useState<InterviewDict | null>(null);
  const params = useParams();
  const applicantId = params.applicationId;
  const interviewId = params.interviewId;
  const nextPlayTimeRef = useRef(0);

  const [connected, setConnected] = useState(false);
  const wsRef = useRef<{ audio: WebSocket | null; video: WebSocket | null }>({
    audio: null,
    video: null,
  });
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const processedStreamRef = useRef<MediaStream | null>(null);
  const lastFrameRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [startVideoRequested, setStartVideoRequested] = useState(false);
  const lastSentRef = useRef<number>(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [_userId, setUserId] = useState<string | null>(null);
  const [isClosed, setIsClosed] = useState(false);
  const [closedReason, setClosedReason] =
    useState<string>("Session has closed");
  const pcmBufferRef = useRef<Int16Array[]>([]);
  const bufferedSamplesRef = useRef<number>(0);

  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      nav("/login");
      return;
    }
    setUserId(userId);
  }, []);

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    const v = value as number;
    setVolume(v);
    if (gainNodeRef.current) gainNodeRef.current.gain.value = v;
  };

  const playPCM = (float32: Float32Array) => {
    if (!audioContextRef.current) return;
    const SERVER_SAMPLE_RATE = 24000;
    const audioBuffer = audioContextRef.current.createBuffer(
      1,
      float32.length,
      SERVER_SAMPLE_RATE,
    );
    audioBuffer.copyToChannel(new Float32Array(float32), 0);
    const ctx = audioContextRef.current;
    const currentTime = ctx.currentTime;
    if (nextPlayTimeRef.current < currentTime) {
      nextPlayTimeRef.current = currentTime;
    }
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    if (gainNodeRef.current) {
      source.connect(gainNodeRef.current);
    } else {
      source.connect(ctx.destination);
    }
    source.start(nextPlayTimeRef.current);
    nextPlayTimeRef.current += audioBuffer.duration;
  };

  const convertFloat32ToPCM = (inputData: Float32Array): Int16Array => {
    const pcm16 = new Int16Array(inputData.length);
    for (let i = 0; i < inputData.length; i++) {
      const s = Math.max(-1, Math.min(1, inputData[i]));
      pcm16[i] = s * 32767;
    }
    return pcm16;
  };

  const flushAudioChunk = (ws: WebSocket) => {
    const merged = new Int16Array(bufferedSamplesRef.current);
    let offset = 0;
    for (const chunk of pcmBufferRef.current) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    pcmBufferRef.current = [];
    bufferedSamplesRef.current = 0;
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(merged.buffer);
    }
  };

  const startAudioInterview = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({
        sampleRate: NATIVE_SAMPLE_RATE,
      });
    }
    await audioContextRef.current.resume();

    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.gain.value = volume;
    gainNodeRef.current.connect(audioContextRef.current.destination);

    const ws = new WebSocket(
      `wss://interview-agent-435239562393.us-central1.run.app/interview/start/${interviewId}/${applicantId}`,
    );
    wsRef.current.audio = ws;
    ws.binaryType = "arraybuffer";

    await new Promise<void>((resolve, reject) => {
      ws.onopen = () => {
        setConnected(true);
        resolve();
      };
      ws.onerror = () => reject(new Error("WebSocket failed to connect"));
    });

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        const msg = JSON.parse(event.data);
        if (msg.turn_complete) {
          nextPlayTimeRef.current = 0;
          setSpeaking(false);
        }
        if (msg.role && msg.text) {
          setTranscript((prev) => [
            ...prev,
            { who: msg.role === "candidate" ? "You" : "AI", text: msg.text },
          ]);
        }
      } else {
        const int16 = new Int16Array(event.data);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) {
          float32[i] = int16[i] / 32767;
        }
        if (!speaking) setSpeaking(true);
        playPCM(float32);
      }
    };

    ws.onclose = (event) => {
      setConnected(false);
      setClosedReason(event.reason || "Session has ended.");
      setIsClosed(true);
      stopRecording();
    };

    await audioContextRef.current.audioWorklet.addModule(
      `${window.location.origin}/pcm-recorder-processor.js`,
    );

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: NATIVE_SAMPLE_RATE,
      },
    });
    const source = audioContextRef.current.createMediaStreamSource(stream);
    const audioRecorderNode = new AudioWorkletNode(
      audioContextRef.current,
      "pcm-recorder-processor",
    );

    source.connect(audioRecorderNode);
    audioRecorderNode.connect(audioContextRef.current.destination);

    ws.send(JSON.stringify({ mime_type: "audio/pcm" }));

    audioRecorderNode.port.onmessage = (event) => {
      const downsampled = downsampleBuffer(
        event.data as Float32Array,
        DOWNSAMPLE_RATIO,
      );
      const pcm = convertFloat32ToPCM(downsampled);
      pcmBufferRef.current.push(pcm);
      bufferedSamplesRef.current += pcm.length;
      if (bufferedSamplesRef.current >= CHUNK_SAMPLES) {
        flushAudioChunk(ws);
      }
    };
  };

  const startVideoInterview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user",
          frameRate: { ideal: 30 },
        },
      });

      const ws = new WebSocket(
        `wss://interview-agent-435239562393.us-central1.run.app/interview/visual_interview/start/${interviewId}/${applicantId}`,
      );
      wsRef.current.video = ws;
      ws.binaryType = "arraybuffer";

      await new Promise<void>((resolve) => {
        ws.onopen = () => {
          setConnected(true);
          resolve();
        };
        ws.onerror = () => {
          setClosedReason("Connection error. Session has ended.");
          setIsClosed(true);
          stopRecording();
        };
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const worker = new Worker("/video-processor.js");
      workerRef.current = worker;
      worker.postMessage({ type: "init" });

      worker.onmessage = (e) => {
        if (e.data.type === "blob") {
          const now = Date.now();
          if (now - lastSentRef.current > 1000) {
            lastSentRef.current = now;
            const blob = new Blob([e.data.buffer], { type: "image/jpeg" });
            const reader = new FileReader();
            reader.onloadend = () => {
              if (typeof reader.result === "string") {
                const base64data = reader.result.split(",")[1];
                if (wsRef.current.video?.readyState === WebSocket.OPEN) {
                  wsRef.current.video.send(
                    JSON.stringify({
                      realtime_input: {
                        media_chunks: [
                          { mime_type: "image/jpeg", data: base64data },
                        ],
                      },
                    }),
                  );
                }
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      };

      const sendFrame = async () => {
        const now = Date.now();
        if (
          videoRef.current &&
          videoRef.current.readyState >= 2 &&
          now - lastFrameRef.current > 1000
        ) {
          lastFrameRef.current = now;
          const bitmap = await createImageBitmap(videoRef.current);
          worker.postMessage(
            {
              type: "frame",
              bitmap,
              videoWidth: videoRef.current.videoWidth,
              videoHeight: videoRef.current.videoHeight,
            },
            [bitmap],
          );
        }
        animFrameIdRef.current = requestAnimationFrame(sendFrame);
      };

      if (videoRef.current && videoRef.current.readyState >= 2) {
        requestAnimationFrame(sendFrame);
      } else {
        videoRef.current?.addEventListener("loadedmetadata", () => {
          requestAnimationFrame(sendFrame);
        });
      }

      processedStreamRef.current = stream;
    } catch (err) {
      console.error("video error:", err);
    }
  };

  const startInterview = async () => {
    setSessionStarted(true);
    setStartVideoRequested(true);
    await startAudioInterview();
  };

  useEffect(() => {
    if (videoReady && startVideoRequested) {
      startVideoInterview();
    }
    return () => {
      workerRef.current?.terminate();
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (processedStreamRef.current) {
        processedStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoReady, startVideoRequested]);

  useEffect(() => {
    const t = setInterval(() => {
      if (connected) setTimer((p) => p + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [connected]);

  useEffect(() => {
    const getInterview = async () => {
      try {
        const [interviewResponse, applicantResponse] = await Promise.all([
          api.get(`/Interview/full/${interviewId}`),
          api.get(`/Applicant/${applicantId}`),
        ]);
        const interviewData = interviewResponse.data;
        const applicantData = applicantResponse.data;
        setInterview(interviewData);
        setApplicant(applicantData);
        if (interviewData.status === "closed") {
          setClosedReason("This interview has been closed.");
          setIsClosed(true);
          return;
        }
        if (applicantData.started_session) {
          setClosedReason("You have already completed this session.");
          setIsClosed(true);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    };
    getInterview();
  }, [interviewId, applicantId]);

  useEffect(() => {
    if (transcriptRef.current)
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [transcript]);

  useEffect(() => {
    if (isClosed) stopRecording();
  }, [isClosed]);

  const fmt = (seconds: number) => {
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const stopRecording = () => {
    audioContextRef.current?.close();
    audioContextRef.current = null;
    gainNodeRef.current = null;
    wsRef.current.audio?.close();
    wsRef.current.video?.close();
    workerRef.current?.terminate();
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    processedStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcmBufferRef.current = [];
    bufferedSamplesRef.current = 0;
    setSessionStarted(false);
    setConnected(false);
    setSpeaking(false);
    setIsClosed(true);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0F1115",
          color: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            px: "28px",
            py: "14px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Box onClick={() => nav("/")} sx={{ cursor: "pointer" }}>
              <LogoSVG size={26} />
            </Box>
            <Box>
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, color: "white" }}
              >
                {interview?.role}
              </Typography>
              <Typography
                sx={{ fontSize: 12, color: "rgba(255,255,255,0.38)" }}
              >
                Live Session
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <Typography
              sx={{
                fontFamily: "'DM Mono',monospace",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.05em",
              }}
            >
              {fmt(timer)}/{fmt((interview?.duration ?? 0) * 60)}
            </Typography>
            <Box
              component="button"
              onClick={() => nav("/")}
              sx={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: COLORS.red,
                borderRadius: "12px",
                px: "16px",
                py: "8px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                "&:hover": { background: "rgba(239,68,68,0.2)" },
              }}
            >
              Leave Session
            </Box>
          </Box>
        </Box>

        <Box
          sx={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 310px" }}
        >
          {!sessionStarted && !isClosed && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2rem",
                p: "36px",
                width: "100vw",
              }}
            >
              <Typography
                sx={{
                  fontSize: "2.3rem",
                  fontWeight: "600",
                  textDecoration: "uppercase",
                }}
              >
                Hi, {applicant?.name}. Please start your interview
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.65)" }}>
                Time limit: {interview?.duration} minutes
              </Typography>
              <Box
                component="button"
                onClick={startInterview}
                sx={{
                  background: `linear-gradient(135deg, ${COLORS.indigo}, ${COLORS.lavender})`,
                  border: "none",
                  borderRadius: "3px",
                  px: "40px",
                  py: "16px",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "white",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.02em",
                  transition: "all 0.25s ease",
                  "&:hover": { boxShadow: `0 0 32px rgba(91,93,246,0.7)` },
                }}
              >
                Start Interview
              </Box>
            </Box>
          )}

          {isClosed && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                p: "36px",
                width: "100vw",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  mb: "8px",
                }}
              >
                <Icon name="lock" size={18} color={COLORS.textMuted} />
              </Box>
              <Typography
                sx={{ fontSize: 22, fontWeight: 700, color: "white" }}
              >
                Session Unavailable
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: "rgba(255,255,255,0.5)",
                  textAlign: "center",
                  maxWidth: 400,
                }}
              >
                {closedReason}
              </Typography>
              <Box
                component="button"
                onClick={() => nav("/dashboard")}
                sx={{
                  mt: "16px",
                  background: `linear-gradient(135deg, ${COLORS.indigo}, ${COLORS.lavender})`,
                  border: "none",
                  borderRadius: "12px",
                  px: "28px",
                  py: "12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "white",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  "&:hover": { boxShadow: `0 0 24px rgba(91,93,246,0.5)` },
                }}
              >
                Go to Dashboard
              </Box>
            </Box>
          )}

          <>
            <Box
              sx={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: "36px",
                width: "100vw",
                display: sessionStarted ? "flex" : "none",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "80%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "3rem",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    position: "relative",
                    width: "25%",
                    display: "flex",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <Box
                    sx={{
                      width: 116,
                      height: 116,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "box-shadow 0.5s ease",
                      animation: `${speaking ? "speaking-glow 2s ease-in-out infinite" : "none"}`,
                    }}
                  >
                    <Icon name="brain" size={50} color="white" />
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: "100%",
                    width: "50%",
                    borderRadius: "2px",
                    boxShadow: "0 0 0 0.5px white",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "1.5rem",
                    overflow: "hidden",
                  }}
                >
                  <video
                    ref={(node) => {
                      videoRef.current = node;
                      if (node) setVideoReady(true);
                    }}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  mt: "60px",
                  width: "max-width",
                  p: "20px",
                  borderRadius: "16px",
                  height: 70,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1.1rem",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="button"
                    onClick={() => setShowVolumeSlider((p) => !p)}
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      border: "0.5px solid white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: showVolumeSlider
                        ? `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`
                        : "none",
                    }}
                  >
                    {volume === 0 ? (
                      <VolumeOffIcon sx={{ fontSize: 22, color: "white" }} />
                    ) : (
                      <VolumeUpIcon sx={{ fontSize: 22, color: "white" }} />
                    )}
                  </Box>
                  {showVolumeSlider && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "62px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "rgba(20,20,30,0.97)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "12px",
                        p: "14px 10px",
                        height: 130,
                        display: "flex",
                        alignItems: "center",
                        zIndex: 10,
                      }}
                    >
                      <Slider
                        orientation="vertical"
                        min={0}
                        max={2}
                        step={0.05}
                        value={volume}
                        onChange={handleVolumeChange}
                        sx={{ color: COLORS.indigo, height: 100 }}
                      />
                    </Box>
                  )}
                </Box>

                <Box
                  component="button"
                  onClick={() => setShowTranscript((p) => !p)}
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    border: "1px solid white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: showTranscript
                      ? `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`
                      : "none",
                  }}
                >
                  <ChatIcon sx={{ fontSize: 22, color: "white" }} />
                </Box>

                <Box
                  component="button"
                  onClick={stopRecording}
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: micActive
                      ? "linear-gradient(135deg,#EF4444,#F87171)"
                      : `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      boxShadow: micActive
                        ? "0 0 30px rgba(239,68,68,0.4)"
                        : "0 0 20px rgba(91,93,246,0.3)",
                    },
                  }}
                >
                  <PhoneIcon
                    sx={{
                      fontSize: 22,
                      color: "white",
                      transform: "rotate(135deg)",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {showTranscript && (
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  right: 0,
                  width: 320,
                  height: "100vh",
                  borderLeft: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(15,17,21,0.97)",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  flexDirection: "column",
                  zIndex: 100,
                }}
              >
                <Box
                  sx={{
                    px: "16px",
                    py: "14px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                    Transcript
                  </Typography>
                  <Box
                    component="button"
                    onClick={() => setShowTranscript(false)}
                    sx={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CloseIcon
                      sx={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}
                    />
                  </Box>
                </Box>
                <Box
                  ref={transcriptRef}
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {transcript.length === 0 && (
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.3)",
                        fontSize: 13,
                        textAlign: "center",
                        mt: "2rem",
                      }}
                    >
                      Transcript will appear here…
                    </Typography>
                  )}
                  {transcript.map((entry, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        alignItems:
                          entry.who === "You" ? "flex-end" : "flex-start",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.4)",
                          px: "4px",
                        }}
                      >
                        {entry.who}
                      </Typography>
                      <Box
                        sx={{
                          maxWidth: "85%",
                          px: "12px",
                          py: "8px",
                          borderRadius:
                            entry.who === "You"
                              ? "12px 12px 2px 12px"
                              : "12px 12px 12px 2px",
                          background:
                            entry.who === "You"
                              ? `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`
                              : "rgba(255,255,255,0.08)",
                        }}
                      >
                        <Typography sx={{ fontSize: 13, lineHeight: 1.5 }}>
                          {entry.text}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </>
        </Box>
      </Box>
    </>
  );
};

export default Interview;
