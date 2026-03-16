import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    indigo: Palette['primary'];
  }
  interface PaletteOptions {
    indigo?: PaletteOptions['primary'];
  }
}

export const COLORS = {
  indigo: '#5B5DF6',
  indigoDark: '#4A4CE8',
  lavender: '#8B8EFA',
  bg: '#F8F9FC',
  dark: '#0F1115',
  darkCard: '#161A22',
  darkBorder: '#1E2330',
  text: '#0D0F14',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  white: '#FFFFFF',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  pink: '#EC4899',
  purple: '#8B5CF6',
  blue: '#3B82F6',
} as const;

export const SHADOWS = {
  card: '0px 10px 40px rgba(0,0,0,0.06)',
  cardHover: '0px 16px 50px rgba(0,0,0,0.09)',
  glow: '0px 0px 40px rgba(91,93,246,0.22)',
  glowStrong: '0 0 60px rgba(91,93,246,0.7), 0 0 100px rgba(91,93,246,0.35)',
  speakingGlow: '0 0 30px rgba(91,93,246,0.4), 0 0 60px rgba(91,93,246,0.2)',
} as const;

export const RADIUS = {
  card: '22px',
  btn: '14px',
  chip: '20px',
  input: '12px',
  sidebar: '12px',
  icon: '10px',
} as const;

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.indigo,
      dark: COLORS.indigoDark,
      light: COLORS.lavender,
    },
    secondary: {
      main: COLORS.lavender,
    },
    background: {
      default: COLORS.bg,
      paper: COLORS.white,
    },
    text: {
      primary: COLORS.text,
      secondary: COLORS.textMuted,
      disabled: COLORS.textLight,
    },
    success: { main: COLORS.green },
    warning: { main: COLORS.amber },
    error: { main: COLORS.red },
    indigo: {
      main: COLORS.indigo,
      dark: COLORS.indigoDark,
      light: COLORS.lavender,
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.04em',
      lineHeight: 1.06,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.12,
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      lineHeight: 1.65,
    },
    body2: {
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      letterSpacing: '0.04em',
      color: COLORS.textMuted,
    },
    overline: {
      fontSize: '0.7rem',
      fontWeight: 700,
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      color: COLORS.indigo,
    },
  },
  shape: {
    borderRadius: 22,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: ${COLORS.bg};
          color: ${COLORS.text};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }

        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.97); }
        }
        @keyframes orb-float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, 25px) scale(1.08); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes wave {
          0%, 100% { height: 6px; }
          50% { height: 30px; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes speaking-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(91,93,246,0.4), 0 0 60px rgba(91,93,246,0.2); }
          50% { box-shadow: 0 0 60px rgba(91,93,246,0.7), 0 0 100px rgba(91,93,246,0.35); }
        }
        @keyframes dot-fade {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .fade-up { animation: fadeUp 0.5s ease both; }
        .fade-up-1 { animation: fadeUp 0.5s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.5s ease 0.2s both; }
        .fade-up-3 { animation: fadeUp 0.5s ease 0.3s both; }
        .fade-up-4 { animation: fadeUp 0.5s ease 0.4s both; }

        .dot-grid {
          background-image: radial-gradient(circle, rgba(91,93,246,0.12) 1px, transparent 1px);
          background-size: 24px 24px;
          animation: dot-fade 6s ease-in-out infinite;
        }

        .waveform-bar {
          width: 3px;
          border-radius: 2px;
          background: linear-gradient(180deg, ${COLORS.indigo}, ${COLORS.lavender});
          animation: wave 0.8s ease-in-out infinite;
        }

        .speaking-avatar {
          animation: speaking-glow 2s ease-in-out infinite;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: RADIUS.btn,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: '-0.01em',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease',
          '&:hover': {
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.99)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${COLORS.indigo}, ${COLORS.lavender})`,
          color: '#fff',
          boxShadow: 'none',
          '&:hover': {
            background: `linear-gradient(135deg, ${COLORS.indigo}, ${COLORS.lavender})`,
            boxShadow: `0px 0px 40px rgba(91,93,246,0.22)`,
            filter: 'brightness(1.05)',
          },
        },
        outlined: {
          borderColor: 'rgba(0,0,0,0.12)',
          color: COLORS.text,
          borderWidth: '1.5px',
          '&:hover': {
            background: COLORS.white,
            borderColor: COLORS.indigo,
            color: COLORS.indigo,
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: RADIUS.card,
          boxShadow: SHADOWS.card,
          border: '1px solid rgba(0,0,0,0.04)',
          transition: 'transform 0.22s ease, box-shadow 0.22s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: SHADOWS.cardHover,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: "'DM Sans', sans-serif",
          borderRadius: `${RADIUS.input} !important`,
          background: '#FAFAFA',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: `${COLORS.indigo} !important`,
            boxShadow: `0 0 0 3px ${alpha(COLORS.indigo, 0.1)}`,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: '1.5px',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: RADIUS.chip,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: "'DM Sans', sans-serif",
          borderRadius: 8,
          fontSize: '0.75rem',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 7,
          backgroundColor: '#F3F4F6',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
  },
});

export default theme;
