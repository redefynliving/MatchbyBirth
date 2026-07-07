export function titleCase(value) {
  return String(value || '')
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getReportSnapshot(report, result) {
  const breakdownEntries = Object.entries(result?.breakdown || {})
    .filter(([key, value]) => key !== 'overall' && Number.isFinite(Number(value)))
    .sort((left, right) => Number(right[1]) - Number(left[1]));
  const strongest = titleCase(breakdownEntries[0]?.[0] || 'connection');
  const watch = titleCase(breakdownEntries[breakdownEntries.length - 1]?.[0] || 'timing');
  const practical = report?.sections?.find((section) => section.key === 'practical_advice')?.body || '';
  const sayThis = practical.match(/"([^"]+)"/)?.[1] ||
    `Name where ${strongest.toLowerCase()} feels easy, then talk about ${watch.toLowerCase()} before it turns into guessing.`;

  return { strongest, watch, sayThis };
}
