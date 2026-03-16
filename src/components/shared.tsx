import React from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { LogoSVG } from './Icons';
import { COLORS, SHADOWS, RADIUS } from '../theme/theme';
import { InterviewStatus } from '../types';

// ── Logo ─────────────────────────────────────────────────────────────
export const Logo: React.FC<{ size?: number }> = ({ size = 28 }) => {
  const nav = useNavigate();
  return (
    <Box onClick={() => nav('/')} sx={{ display: 'flex', alignItems: 'center', gap: 1.1, cursor: 'pointer', userSelect: 'none' }}>
      <LogoSVG size={size} />
      <Typography sx={{ fontWeight: 700, fontSize: size * 0.55, letterSpacing: '-0.025em', color: COLORS.text }}>
        Intervuew
      </Typography>
    </Box>
  );
};

// ── SoftCard ──────────────────────────────────────────────────────────
interface SoftCardProps { children: React.ReactNode; sx?: object; className?: string; onClick?: () => void; dark?: boolean; }
export const SoftCard: React.FC<SoftCardProps> = ({ children, sx = {}, className, onClick, dark = false }) => (
  <Box className={className} onClick={onClick} sx={{
    background: dark ? 'linear-gradient(135deg,#0F1115,#1a1d2e)' : COLORS.white,
    borderRadius: RADIUS.card, boxShadow: SHADOWS.card,
    border: dark ? 'none' : '1px solid rgba(0,0,0,0.04)',
    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
    cursor: onClick ? 'pointer' : 'default',
    '&:hover': { transform: 'translateY(-2px)', boxShadow: SHADOWS.cardHover },
    ...sx,
  }}>{children}</Box>
);

// ── GlassCard ─────────────────────────────────────────────────────────
export const GlassCard: React.FC<{ children: React.ReactNode; sx?: object }> = ({ children, sx = {} }) => (
  <Box sx={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: RADIUS.card, ...sx }}>
    {children}
  </Box>
);

// ── GradientButton ────────────────────────────────────────────────────
interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;                       // navigate to route
  size?: 'sm' | 'md' | 'lg';
  variant?: 'gradient' | 'ghost' | 'dark' | 'danger' | 'success'; // can also pass
  fullWidth?: boolean;
  sx?: object;
  startIcon?: React.ReactNode;
}
export const GradientButton: React.FC<GradientButtonProps> = ({
  children, onClick, to, size = 'md', variant = 'gradient', fullWidth = false, sx = {}, startIcon,
}) => {
  const nav = useNavigate();
  const handleClick = () => { if (to) nav(to); else onClick?.(); };
  const sizes = { sm: { padding: '8px 18px', fontSize: '13px' }, md: { padding: '11px 22px', fontSize: '14px' }, lg: { padding: '14px 28px', fontSize: '15px' } };
  const variants: Record<string, object> = {
    gradient: { background: `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`, color: '#fff', border: 'none', '&:hover': { boxShadow: SHADOWS.glow, filter: 'brightness(1.05)' } },
    ghost:    { background: 'transparent', color: COLORS.text, border: '1.5px solid rgba(0,0,0,0.12)', '&:hover': { background: COLORS.white, borderColor: COLORS.indigo, color: COLORS.indigo } },
    dark:     { background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', '&:hover': { background: 'rgba(255,255,255,0.14)' } },
    danger:   { background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', '&:hover': { background: 'rgba(239,68,68,0.14)' } },
success:  { background: 'rgba(16,185,129,0.08)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)', '&:hover': { background: 'rgba(16,185,129,0.14)' } },
  };
  return (
    <Box component="button" onClick={handleClick} sx={{
      display: 'inline-flex', alignItems: 'center', gap: 1,
      ...sizes[size], borderRadius: RADIUS.btn,
      fontFamily: "'DM Sans',sans-serif", fontWeight: 600, letterSpacing: '-0.01em',
      cursor: 'pointer', outline: 'none',
      transition: 'transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease',
      width: fullWidth ? '100%' : 'auto', justifyContent: 'center',
      '&:hover': { transform: 'scale(1.02)' }, '&:active': { transform: 'scale(0.99)' },
      ...variants[variant], ...sx,
    }}>
      {startIcon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{startIcon}</Box>}
      {children}
    </Box>
  );
};

// ── StatusBadge ───────────────────────────────────────────────────────
export const StatusBadge: React.FC<{ status: InterviewStatus }> = ({ status }) => {
  const cfg = {
    listening: { label: 'Listening', dot: '#10B981', bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
    thinking:  { label: 'Thinking',  dot: '#F59E0B', bg: 'rgba(245,158,11,0.1)', color: '#D97706' },
    speaking:  { label: 'Speaking',  dot: COLORS.indigo, bg: 'rgba(91,93,246,0.12)', color: COLORS.indigo },
    idle:      { label: 'Idle',      dot: COLORS.textLight, bg: 'rgba(0,0,0,0.06)', color: COLORS.textMuted },
  }[status];
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', px: '10px', py: '4px', borderRadius: '20px', background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono',monospace", letterSpacing: '0.02em' }}>
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />{cfg.label}
    </Box>
  );
};

// ── ScoreChip ─────────────────────────────────────────────────────────
export const ScoreChip: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 85 ? COLORS.green : score >= 75 ? COLORS.amber : COLORS.red;
  return <Box sx={{ background: alpha(color, 0.1), borderRadius: 20, px: '10px', py: '3px', fontSize: 12, fontWeight: 700, color }}>{score}</Box>;
};

// ── ScoreRing ─────────────────────────────────────────────────────────
export const ScoreRing: React.FC<{ score: number; animated?: boolean; size?: number }> = ({ score, animated = true, size = 174 }) => {
  const r = 78, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ, cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth="9" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#sg)" strokeWidth="9" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={animated ? offset : circ}
        transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }} />
      <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="0"><stop stopColor={COLORS.indigo} /><stop offset="1" stopColor={COLORS.lavender} /></linearGradient></defs>
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="38" fontWeight="700" fill={COLORS.text} fontFamily="DM Sans">{score}</text>
      <text x={cx} y={cy + 18} textAnchor="middle" fontSize="13" fill={COLORS.textLight} fontFamily="DM Sans">/100</text>
    </svg>
  );
};

// ── WaveformVisualizer ────────────────────────────────────────────────
export const WaveformVisualizer: React.FC<{ active?: boolean; bars?: number }> = ({ active = true, bars = 18 }) => (
  <Box sx={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: 44 }}>
    {Array.from({ length: bars }).map((_, i) => (
      <Box key={i} className="waveform-bar" sx={{ animationDelay: `${i * 0.055}s`, animationDuration: `${0.5 + (i % 4) * 0.15}s`, opacity: active ? 1 : 0.15, transition: 'opacity 0.3s ease' }} />
    ))}
  </Box>
);

// ── SidebarLink ───────────────────────────────────────────────────────
interface SidebarLinkProps { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; to?: string; }
export const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, active = false, onClick, to }) => {
  const nav = useNavigate();
  return (
    <Box onClick={() => { if (to) nav(to); else onClick?.(); }} sx={{
      display: 'flex', alignItems: 'center', gap: '10px', px: '14px', py: '10px', borderRadius: '12px',
      fontSize: 14, fontWeight: active ? 600 : 500, color: active ? COLORS.indigo : COLORS.textMuted,
      cursor: 'pointer', background: active ? alpha(COLORS.indigo, 0.1) : 'transparent',
      transition: 'all 0.15s ease', userSelect: 'none',
      '&:hover': { background: alpha(COLORS.indigo, 0.07), color: COLORS.indigo },
    }}>
      {icon}{label}
    </Box>
  );
};

// ── CategoryBar ───────────────────────────────────────────────────────
export const CategoryBar: React.FC<{ label: string; score: number; color: string; animated?: boolean; delay?: number }> = ({ label, score, color, animated = true, delay = 0 }) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '7px' }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'DM Mono',monospace" }}>{score}</Typography>
    </Box>
    <Box sx={{ height: 7, borderRadius: 4, background: '#F3F4F6', overflow: 'hidden' }}>
      <Box sx={{ width: animated ? `${score}%` : '0%', height: '100%', borderRadius: 4, background: color, transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${delay}s` }} />
    </Box>
  </Box>
);

// ── OrbBackground ─────────────────────────────────────────────────────
export const OrbBackground: React.FC = () => (
  <>
    <Box sx={{ position: 'absolute', top: -180, left: '58%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle,rgba(91,93,246,0.2) 0%,transparent 70%)', animation: 'orb-float 9s ease-in-out infinite', pointerEvents: 'none' }} />
    <Box sx={{ position: 'absolute', top: 80, left: -80, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,142,250,0.12) 0%,transparent 70%)', animation: 'orb-float2 12s ease-in-out infinite', pointerEvents: 'none' }} />
  </>
);

// ── SectionLabel ──────────────────────────────────────────────────────
export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography sx={{ fontSize: 12, fontWeight: 700, color: COLORS.indigo, letterSpacing: '0.07em', textTransform: 'uppercase', mb: 1.5 }}>
    {children}
  </Typography>
);
