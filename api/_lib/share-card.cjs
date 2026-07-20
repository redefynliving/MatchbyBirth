'use strict';

const BREAKDOWN_LABELS = {
  chemistry: 'Chemistry',
  communication: 'Communication',
  stability: 'Stability',
  growth: 'Growth',
  intuition: 'Intuition',
};

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function clampText(value, maxLength) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trim()}...`;
}

function getScore(result) {
  const score = Number(result?.mode === 'group' ? result?.groupScore : result?.score);
  return Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0;
}

function getScoreBand(score) {
  if (score >= 85) {
    return {
      label: 'Strong natural rhythm',
      note: 'Clear strengths with one real watch area.',
      accent: '#6f4caf',
      wash: '#f0e9f7',
    };
  }
  if (score >= 70) {
    return {
      label: 'Good compatibility',
      note: 'Enough ease to explore, enough texture to discuss.',
      accent: '#7a5b9e',
      wash: '#f3edf8',
    };
  }
  if (score >= 50) {
    return {
      label: 'Mixed rhythm',
      note: 'Some natural flow, some translation required.',
      accent: '#8b6c45',
      wash: '#f5eee4',
    };
  }
  return {
    label: 'Different rhythms',
    note: 'Useful if both people can name the friction early.',
    accent: '#73566f',
    wash: '#f4ecef',
  };
}

function getNames(result) {
  if (result?.mode === 'group') {
    return `Group of ${result?.people?.length || 3}`;
  }
  const names = Array.isArray(result?.people)
    ? result.people.map((person) => person?.name).filter(Boolean)
    : [];
  return names.length >= 2 ? `${names[0]} & ${names[1]}` : 'Compatibility result';
}

function getWatchArea(result) {
  const breakdown = result?.breakdown || {};
  const entries = Object.entries(breakdown)
    .filter(([key, value]) => key !== 'overall' && Number.isFinite(Number(value)))
    .sort((left, right) => Number(left[1]) - Number(right[1]));

  if (entries.length > 0) {
    return BREAKDOWN_LABELS[entries[0][0]] || entries[0][0];
  }

  if (result?.mode === 'group' && result?.bestPair?.personA && result?.bestPair?.personB) {
    return `${result.bestPair.personA.name} + ${result.bestPair.personB.name}`;
  }

  return 'The next conversation';
}

function getTopAspect(result) {
  if (result?.calculationMode !== 'full-synastry') return '';
  const evidence = Array.isArray(result?.synastry?.evidence) ? result.synastry.evidence : [];
  return clampText(evidence.find((item) => item?.label)?.label, 48);
}

function buildShareCardMeta(result) {
  const score = getScore(result);
  const band = getScoreBand(score);
  const names = clampText(getNames(result), 44);
  const watchArea = clampText(getWatchArea(result), 30);
  const topAspect = getTopAspect(result);
  const readingLabel = topAspect ? 'Full timed synastry' : 'Birth-date compatibility';
  const title = result?.mode === 'group'
    ? `${names}: ${score}% group fit`
    : `${names}: ${score}% compatibility`;

  return {
    score,
    band,
    names,
    watchArea,
    topAspect,
    readingLabel,
    title,
    description: topAspect
      ? `${band.label}. Top synastry aspect: ${topAspect}.`
      : `${band.label}. Watch area: ${watchArea}.`,
  };
}

function buildShareCardSvg(result) {
  const meta = buildShareCardMeta(result);
  const { score, band, names, watchArea, topAspect, readingLabel } = meta;
  const evidenceLine = topAspect ? `Top aspect: ${topAspect}` : `Watch area: ${watchArea}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#fbf8f3"/>
  <rect x="70" y="64" width="1060" height="502" rx="38" fill="#fffdf9" stroke="#e7ded2" stroke-width="2"/>
  <circle cx="982" cy="120" r="116" fill="${band.wash}"/>
  <circle cx="198" cy="508" r="138" fill="#f5efe8"/>
  <text x="120" y="132" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="6" fill="#7a559f">MATCH BY BIRTH</text>
  <text x="1080" y="132" text-anchor="end" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="2" fill="#7a559f">${escapeXml(readingLabel.toUpperCase())}</text>
  <text x="120" y="218" font-family="Georgia, serif" font-size="68" fill="#27222d">${escapeXml(names)}</text>
  <text x="120" y="286" font-family="Arial, sans-serif" font-size="30" fill="#71687b">${escapeXml(band.label)}</text>
  <text x="120" y="397" font-family="Georgia, serif" font-size="142" font-weight="700" fill="${band.accent}">${score}%</text>
  <text x="425" y="388" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="4" fill="#7a559f">OVERALL FIT</text>
  <text x="425" y="430" font-family="Arial, sans-serif" font-size="28" fill="#5f5668">${escapeXml(band.note)}</text>
  <rect x="425" y="462" width="560" height="62" rx="31" fill="${band.wash}" stroke="#dfd3e9"/>
  <text x="455" y="503" font-family="Arial, sans-serif" font-size="22" fill="#3a3342">${escapeXml(evidenceLine)}</text>
  <text x="1080" y="503" text-anchor="end" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#7a559f">matchbybirth.com</text>
</svg>`;
}

module.exports = {
  buildShareCardMeta,
  buildShareCardSvg,
  getScoreBand,
};
