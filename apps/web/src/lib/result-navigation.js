export function buildResultNavigation(response) {
  const persisted = response?.persisted === true
    && Boolean(response?.shareSlug)
    && Boolean(response?.resultId);
  const shareSlug = persisted ? String(response.shareSlug) : null;

  return {
    path: persisted
      ? `/result?share=${encodeURIComponent(shareSlug)}`
      : '/result',
    state: {
      resultId: persisted ? response.resultId : null,
      shareSlug,
      persisted,
      canShare: persisted,
      canPurchase: persisted,
      result: response.result,
    },
  };
}
