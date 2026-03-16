import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GradientButton, OrbBackground } from '../components/shared';
import { COLORS } from '../theme/theme';

const NotFound: React.FC = () => {
  const nav = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', pt: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: COLORS.bg }}>
      <Box className="dot-grid" sx={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
      <OrbBackground />
      <Box className="fade-up" sx={{ textAlign: 'center', position: 'relative', maxWidth: 440 }}>
        <Typography sx={{ fontSize: 96, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1, background: `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: '8px' }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontSize: 24, mb: '12px' }}>Page not found</Typography>
        <Typography sx={{ fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7, mb: '36px' }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <GradientButton size="md" to="/">Go home</GradientButton>
          <GradientButton variant="ghost" size="md" onClick={() => nav(-1 as any)}>Go back</GradientButton>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFound;
