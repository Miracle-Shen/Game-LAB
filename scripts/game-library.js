export const GAME_FILTER_TAGS = ["科技", "战斗", "休闲", "奖励", "策略", "探索", "节奏"];

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

function editSimilarity(left, right) {
  const source = [...normalize(left).replace(/\s+/g, "")];
  const target = [...normalize(right).replace(/\s+/g, "")];
  if (!source.length || !target.length) return 0;
  if (Math.abs(source.length - target.length) > Math.max(2, Math.floor(source.length * 0.5))) return 0;
  let previous = Array.from({ length: target.length + 1 }, (_, index) => index);
  source.forEach((character, sourceIndex) => {
    const current = [sourceIndex + 1];
    target.forEach((targetCharacter, targetIndex) => {
      current.push(Math.min(
        current[targetIndex] + 1,
        previous[targetIndex + 1] + 1,
        previous[targetIndex] + (character === targetCharacter ? 0 : 1),
      ));
    });
    previous = current;
  });
  return 1 - previous[target.length] / Math.max(source.length, target.length);
}

export function scoreGameCard(query, card) {
  const needle = normalize(query);
  if (!needle) return 1;
  const fields = [
    card.id,
    card.title,
    card.subtitle,
    card.track,
    card.status,
    card.summary,
    card.sourceName,
    ...(card.tags || []),
  ].filter(Boolean).flatMap((value) => {
    const normalized = normalize(value);
    return [normalized, ...normalized.split(/\s+/).filter((token) => token.length > 1)];
  });
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
      best = Math.max(best, diceCoefficient(needle, field) * 0.88, editSimilarity(needle, field) * 0.92);
    }
  });
  const queryTokens = needle.split(/\s+/).filter(Boolean);
  const haystack = fields.join(" ");
  const tokenCoverage = queryTokens.filter((token) => haystack.includes(token)).length / Math.max(1, queryTokens.length);
  const conceptCoverage = containedTerms >= 2 ? Math.min(0.94, 0.64 + containedTerms * 0.08) : 0;
  return Math.min(1, Math.max(best, tokenCoverage * 0.86, conceptCoverage));
}

export function rankGameCards(query, cards, { limit = cards.length, threshold = 0 } = {}) {
  return cards
    .map((card) => ({ card, score: scoreGameCard(query, card) }))
    .filter(({ score }) => score >= threshold)
    .sort((left, right) => right.score - left.score || left.card.index.localeCompare(right.card.index))
    .slice(0, limit);
}
