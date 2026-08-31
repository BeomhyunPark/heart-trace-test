export function getSpecialOutcomeValues(outcomes: readonly string[]): Set<string> {
  const counts = outcomes.reduce<Map<string, number>>((result, outcome) => {
    result.set(outcome, (result.get(outcome) ?? 0) + 1);
    return result;
  }, new Map());
  const largestGroupSize = Math.max(0, ...counts.values());

  if (largestGroupSize <= 1) {
    return new Set();
  }

  return new Set(
    [...counts.entries()]
      .filter(([, count]) => count <= 3 && count < largestGroupSize)
      .map(([outcome]) => outcome),
  );
}
