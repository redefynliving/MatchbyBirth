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
  const watchEntry = breakdownEntries[breakdownEntries.length - 1] || ['timing', 0];
  const watch = titleCase(watchEntry[0]);
  const watchScore = Number(watchEntry[1]);
  const focusLabel = watchScore >= 80
    ? 'Relative growth edge'
    : watchScore >= 60
      ? 'Area to clarify'
      : 'Watch area';
  const practicalKeys = ['words_to_use', 'repair', 'next_move', 'practical_advice'];
  const practical = report?.sections?.find((section) => practicalKeys.includes(section.key))?.body || '';
  const sayThis = practical.match(/"([^"]+)"/)?.[1] ||
    `Name where ${strongest.toLowerCase()} feels easy, then talk about ${watch.toLowerCase()} before it turns into guessing.`;

  return { strongest, watch, watchScore, focusLabel, sayThis };
}
