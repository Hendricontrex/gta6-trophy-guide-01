// Filters: kind, grade, search text, earned-only and the spoiler rule.
// The spoiler rule hides a story trophy's name and description until it
// is earned; everything else about it (grade, kind, guide availability)
// stays visible so the list keeps its shape.
export const KINDS = [
  { id: 'all', label: 'All kinds' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'activities', label: 'Activities' },
  { id: 'side', label: 'Side strands' },
  { id: 'crime', label: 'Robberies & crime' },
  { id: 'money', label: 'Money' },
  { id: 'exploration', label: 'Exploration' },
  { id: 'misc', label: 'Miscellaneous' },
  { id: 'online', label: 'Online' },
];

export function kindLabel(kind) {
  const found = KINDS.find((k) => k.id === kind);
  return found ? found.label : kind;
}

export function isSpoilerHidden(trophy, state, progress) {
  return state.spoiler && trophy.kind === 'story' && !progress.earned[trophy.id];
}

export function applyFilters(trophies, state, progress) {
  const q = state.query.trim().toLowerCase();
  return trophies.filter((t) => {
    if (state.kind === 'online') return false;
    if (state.kind === 'missable' && !t.missable) return false;
    if (state.kind !== 'all' && state.kind !== 'missable' && t.kind !== state.kind) return false;
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.earnedOnly && !progress.earned[t.id]) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide} ${t.kind}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
