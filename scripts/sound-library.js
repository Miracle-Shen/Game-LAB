export const DEFAULT_SOUND_MATCH_THRESHOLD = 0.62;

const normalize = (value = "") => value
  .toLocaleLowerCase("zh-CN")
  .normalize("NFKC")
  .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
  .trim();

function ngrams(value, size = 2) {
  const compact = normalize(value).replace(/\s+/g, "");
  if (compact.length <= size) return new Set(compact ? [compact] : []);
  return new Set(Array.from({ length: compact.length - size + 1 }, (_, index) => compact.slice(index, index + size)));
}

function diceCoefficient(left, right) {
  const leftSet = ngrams(left);
  const rightSet = ngrams(right);
  if (!leftSet.size || !rightSet.size) return 0;
  let overlap = 0;
  leftSet.forEach((token) => { if (rightSet.has(token)) overlap += 1; });
  return (2 * overlap) / (leftSet.size + rightSet.size);
}

export function scoreSoundCard(query, card) {
  const needle = normalize(query);
  if (!needle) return 1;
  const fields = [card.title, card.subtitle, card.audioCategoryLabel, ...(card.keywords || []), ...(card.useCases || [])]
    .filter(Boolean)
    .map(normalize);
  let best = 0;
  let containedTerms = 0;
  fields.forEach((field) => {
    if (field === needle) best = Math.max(best, 1);
    else if (field.includes(needle)) {
      const ratio = Math.min(field.length, needle.length) / Math.max(field.length, needle.length);
      best = Math.max(best, 0.72 + ratio * 0.24);
    } else if (needle.includes(field)) {
      const ratio = field.length / needle.length;
      best = Math.max(best, 0.38 + ratio * 0.5);
      if (field.length >= 2) containedTerms += 1;
    } else {
      best = Math.max(best, diceCoefficient(needle, field) * 0.88);
    }
  });
  const queryTokens = needle.split(/\s+/).filter(Boolean);
  const haystack = fields.join(" ");
  const tokenCoverage = queryTokens.filter((token) => haystack.includes(token)).length / Math.max(1, queryTokens.length);
  const conceptCoverage = containedTerms >= 2 ? Math.min(0.94, 0.64 + containedTerms * 0.08) : 0;
  return Math.min(1, Math.max(best, tokenCoverage * 0.86, conceptCoverage));
}

export function rankSoundCards(query, cards, { limit = cards.length, threshold = 0 } = {}) {
  return cards
    .map((card) => ({ card, score: scoreSoundCard(query, card) }))
    .filter(({ score }) => score >= threshold)
    .sort((left, right) => right.score - left.score || left.card.index.localeCompare(right.card.index))
    .slice(0, limit);
}

export function buildGenerationPrompt(point) {
  const description = typeof point === "string" ? point : point.description || point.prompt || "游戏交互反馈";
  return `生成一个可直接用于游戏的短音效：${description}。干声、无音乐、无对白、清晰瞬态、保留动态范围，导出 WAV。`;
}

export function matchGameAudioPoints(points, cards, { threshold = DEFAULT_SOUND_MATCH_THRESHOLD } = {}) {
  return points.map((point, index) => {
    const description = typeof point === "string" ? point : point.description || point.prompt || "";
    const [best] = rankSoundCards(description, cards, { limit: 1 });
    const score = best?.score || 0;
    const reusable = Boolean(best && score >= threshold);
    return {
      id: typeof point === "string" ? `audio-point-${index + 1}` : point.id || `audio-point-${index + 1}`,
      description,
      decision: reusable ? "reuse" : "generate",
      confidence: Number(score.toFixed(3)),
      threshold,
      sound: reusable ? best.card : null,
      prompt: reusable ? null : buildGenerationPrompt(point),
    };
  });
}
