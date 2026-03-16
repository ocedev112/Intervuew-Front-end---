import React from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Icon } from '../components/Icons';
import { SoftCard, GradientButton, SectionLabel } from '../components/shared';
import { COLORS } from '../theme/theme';

const useCases = [
  { tag: 'Startups', title: 'Move fast without sacrificing quality', stat: '10×', statLabel: 'faster screening', desc: "When every hire defines your company culture, you can't afford bad fits. Intervuew lets two-person teams run structured interviews at the scale of a 50-person talent org.", color: COLORS.indigo },
  { tag: 'Scale-ups', title: 'Standardise across every team & region', stat: '63%', statLabel: 'reduction in time-to-hire', desc: 'Keep scoring consistent whether you\'re hiring in New York or Nairobi. Centralised analytics give your TA leaders a single source of truth for pipeline health.', color: COLORS.purple },
  { tag: 'Enterprise', title: 'Security, compliance, and scale', stat: '500+', statLabel: 'concurrent interviews', desc: 'SSO, SAML, SOC 2 Type II, and a dedicated Customer Success Manager. Integrate with your existing ATS, HRIS, and onboarding workflow out of the box.', color: COLORS.blue },
];

const teamFeatures = [
  { icon: 'users',     title: 'Multi-seat workspace',    desc: 'Invite the whole team with role-based permissions — Admin, Reviewer, or Observer.' },
  { icon: 'chart',     title: 'Shared analytics',        desc: 'Every interview contributes to team-wide benchmarks and pipeline reports.' },
  { icon: 'shield',    title: 'Granular permissions',    desc: 'Control who can create roles, review candidates, or export data.' },
  { icon: 'briefcase', title: 'ATS integrations',        desc: 'Greenhouse, Lever, Workday, BambooHR, and 30+ more — push scores automatically.' },
  { icon: 'zap',       title: 'SSO & SAML',             desc: 'Enterprise-grade auth that works with Okta, Azure AD, and Google Workspace.' },
  { icon: 'clock',     title: 'Audit logs',              desc: 'Full activity history for compliance teams. Every action, every actor, every timestamp.' },
];

const ForTeams: React.FC = () => {
  return (
    <Box sx={{ pt: '64px' }}>
      {/* Hero */}
      <Box sx={{ position: 'relative', py: '90px', px: '48px', overflow: 'hidden', background: 'linear-gradient(180deg,#0A0C10 0%,#0F1115 100%)' }}>
        <Box className="dot-grid" sx={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(91,93,246,0.25) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ maxWidth: 740, mx: 'auto', textAlign: 'center', position: 'relative' }}>
          <SectionLabel>For Teams</SectionLabel>
          <Typography variant="h1" sx={{ fontSize: 'clamp(36px,5vw,60px)', mb: '20px', letterSpacing: '-0.03em', color: 'white' }}>
            Hiring at scale,<br />
            <Box component="span" sx={{ background: `linear-gradient(135deg,${COLORS.indigo},${COLORS.lavender})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>without the headcount.</Box>
          </Typography>
          <Typography sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, mb: '40px', maxWidth: 500, mx: 'auto' }}>
            One platform for every team that touches hiring — TA, engineering, HR, and leadership.
          </Typography>
          <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <GradientButton size="lg" to="/login">Get started free</GradientButton>
            <GradientButton variant="dark" size="lg" to="/demo">Book a demo</GradientButton>
          </Box>
        </Box>
      </Box>

      {/* Use cases */}
      <Box sx={{ maxWidth: 1140, mx: 'auto', px: '48px', py: '80px' }}>
        <Box sx={{ textAlign: 'center', mb: '52px' }}>
          <SectionLabel>Use Cases</SectionLabel>
          <Typography variant="h2" sx={{ fontSize: 'clamp(28px,3vw,42px)' }}>Built for every stage of growth</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {useCases.map((u, i) => (
            <SoftCard key={i} sx={{ p: '34px 30px', border: `1px solid ${alpha(u.color, 0.12)}`, '&:hover': { borderColor: alpha(u.color, 0.3), boxShadow: `0 20px 60px ${alpha(u.color, 0.1)}`, transform: 'translateY(-4px)' } }}>
              <Box sx={{ display: 'inline-flex', background: alpha(u.color, 0.1), borderRadius: '20px', px: '12px', py: '4px', mb: '20px', fontSize: 11, fontWeight: 700, color: u.color, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{u.tag}</Box>
              <Typography variant="h5" sx={{ fontSize: 20, mb: '10px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>{u.title}</Typography>
              <Typography sx={{ fontSize: 13.5, lineHeight: 1.7, color: COLORS.textMuted, mb: '24px' }}>{u.desc}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '8px', pt: '20px', borderTop: `1px solid ${alpha(u.color, 0.1)}` }}>
                <Typography sx={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.04em', color: u.color, lineHeight: 1 }}>{u.stat}</Typography>
                <Typography sx={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>{u.statLabel}</Typography>
              </Box>
            </SoftCard>
          ))}
        </Box>
      </Box>

      {/* Team features */}
      <Box sx={{ background: alpha(COLORS.indigo, 0.025), borderTop: `1px solid ${alpha(COLORS.indigo, 0.07)}`, borderBottom: `1px solid ${alpha(COLORS.indigo, 0.07)}`, py: '72px', px: '48px' }}>
        <Box sx={{ maxWidth: 1140, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: '48px' }}>
            <SectionLabel>Platform</SectionLabel>
            <Typography variant="h2" sx={{ fontSize: 'clamp(26px,3vw,40px)' }}>Everything teams need</Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {teamFeatures.map((f, i) => (
              <SoftCard key={i} sx={{ p: '26px 28px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: alpha(COLORS.indigo, 0.09), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={f.icon} size={18} color={COLORS.indigo} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, mb: '6px' }}>{f.title}</Typography>
                  <Typography sx={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>{f.desc}</Typography>
                </Box>
              </SoftCard>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Social proof */}
      <Box sx={{ maxWidth: 1140, mx: 'auto', px: '48px', py: '80px' }}>
        <Box sx={{ textAlign: 'center', mb: '48px' }}>
          <SectionLabel>Trusted By</SectionLabel>
          <Typography variant="h2" sx={{ fontSize: 'clamp(24px,3vw,38px)' }}>Teams that have made the switch</Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
          {[
            { quote: 'We went from 3-week screening cycles to 3 days. Intervuew is the single biggest lever in our hiring stack.', author: 'Mia Torres', title: 'Head of Talent, Fintech Series B', score: '3× faster' },
            { quote: 'The consistency alone was worth it. Every candidate gets the same experience — no more bias complaints from legal.', author: 'James Okafor', title: 'VP People, 400-person SaaS', score: '98% consistent' },
            { quote: "Our engineers stopped dreading phone screens. The AI handles the first round and we only talk to people we're genuinely excited about.", author: 'Yuki Nakamura', title: 'CTO, Developer Tools Startup', score: '80% less eng time' },
          ].map((q, i) => (
            <SoftCard key={i} sx={{ p: '32px', position: 'relative', '&:hover': { transform: 'translateY(-3px)' } }}>
              <Typography sx={{ fontSize: 36, color: COLORS.indigo, lineHeight: 0.8, mb: '12px', fontFamily: 'serif' }}>"</Typography>
              <Typography sx={{ fontSize: 14, lineHeight: 1.75, color: COLORS.textMuted, mb: '24px', fontStyle: 'italic' }}>{q.quote}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pt: '18px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{q.author}</Typography>
                  <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>{q.title}</Typography>
                </Box>
                <Box sx={{ background: alpha(COLORS.green, 0.1), borderRadius: '20px', px: '12px', py: '4px', fontSize: 11, fontWeight: 700, color: COLORS.green, whiteSpace: 'nowrap' }}>{q.score}</Box>
              </Box>
            </SoftCard>
          ))}
        </Box>
      </Box>

      {/* CTA */}
      <Box sx={{ mx: '48px', mb: '80px', borderRadius: '28px', background: 'linear-gradient(135deg,#0F1115,#1a1d2e)', p: '60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle,rgba(91,93,246,0.3) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <Typography variant="h2" sx={{ fontSize: 'clamp(28px,3.5vw,44px)', color: 'white', mb: '14px', position: 'relative' }}>Ready to scale your team?</Typography>
        <Typography sx={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', mb: '34px', position: 'relative' }}>Start free. No credit card needed.</Typography>
        <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'center', position: 'relative' }}>
          <GradientButton size="lg" to="/login">Start for free</GradientButton>
          <GradientButton variant="dark" size="lg" to="/contact">Talk to sales</GradientButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ForTeams;
