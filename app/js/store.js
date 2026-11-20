// Progress store: earned trophies and per-trophy counters, saved in
// localStorage and exportable / importable as a JSON file. Nothing leaves
// the browser except through the file the reader downloads.
const KEY = 'leonida-platinum-progress-v1';

export function emptyProgress() {
  return { earned: {}, counts: {} };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyProgress();
    return {
      earned: parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {},
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable: the tracker still works in memory.
  }
}

export function isEarned(progress, id) {
  return Boolean(progress.earned[id]);
}

export function setEarned(progress, id, earned) {
  if (earned) progress.earned[id] = true;
  else delete progress.earned[id];
  saveProgress(progress);
}

export function getCount(progress, id) {
  const n = Number(progress.counts[id]);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function setCount(progress, id, n) {
  const v = Math.max(0, Math.floor(Number(n) || 0));
  if (v === 0) delete progress.counts[id];
  else progress.counts[id] = v;
  saveProgress(progress);
}

export function earnedCount(progress, trophies) {
  return trophies.filter((t) => isEarned(progress, t.id)).length;
}

// Serialises progress for export; importProgress validates the shape
// before it touches the live state, so a bad file changes nothing.
export function exportText(progress) {
  return JSON.stringify(
    { app: 'leonida-platinum', version: 1, earned: Object.keys(progress.earned).map(Number), counts: progress.counts },
    null,
    2,
  );
}

export function importProgress(text, trophies) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Not a progress file.');
  const ids = new Set(trophies.map((t) => t.id));
  const earned = {};
  for (const id of parsed.earned || []) {
    if (ids.has(Number(id))) earned[Number(id)] = true;
  }
  const counts = {};
  for (const [k, v] of Object.entries(parsed.counts || {})) {
    const id = Number(k);
    if (ids.has(id) && Number(v) > 0) counts[id] = Math.floor(Number(v));
  }
  return { earned, counts };
}

export function downloadFile(filename, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
