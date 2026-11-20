// Leonida Platinum — boot. Loads the trophy list and the sources legend,
// wires the toolbar, the three views and the checklist, and exposes a
// small handle (window.__guide) so the app can be driven and tested.
import { loadProgress, saveProgress, setEarned, setCount, exportText, importProgress, downloadFile } from './store.js';
import { renderKindChips, renderList, renderDetail, renderProgress } from './render.js';
import { renderRoadmap, renderMissables } from './roadmap.js';

const state = {
  kind: 'all',
  grade: 'all',
  query: '',
  earnedOnly: false,
  spoiler: false,
  view: 'checklist',
  selectedId: null,
};

let trophies = [];
let sources = {};
let progress = loadProgress();

function rerender() {
  renderProgress(trophies, progress);
  renderList(trophies, state, progress, state.selectedId, selectTrophy, toggleEarned);
  const selected = trophies.find((t) => t.id === state.selectedId) || null;
  renderDetail(selected, sources, state, progress, (id, value) => {
    setCount(progress, id, value);
    renderProgress(trophies, progress);
  });
  renderRoadmap(trophies, progress);
}

function selectTrophy(id) {
  state.selectedId = id;
  rerender();
  const panel = document.getElementById('detailPanel');
  if (panel && window.innerWidth < 900) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleEarned(id, earned) {
  setEarned(progress, id, earned);
  rerender();
}

function setView(view) {
  state.view = view;
  document.querySelectorAll('.views button').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === view);
  });
  document.getElementById('view-checklist').hidden = view !== 'checklist';
  document.getElementById('view-roadmap').hidden = view !== 'roadmap';
  document.getElementById('view-missables').hidden = view !== 'missables';
  if (view === 'roadmap') renderRoadmap(trophies, progress);
  if (view === 'missables') renderMissables(trophies);
}

function seedFromQuery(params) {
  const seed = Number(params.get('seed'));
  if (Number.isFinite(seed) && seed > 0 && seed <= 55) {
    // Demo progress for screenshots: mostly non-story trophies, so the
    // spoiler setting still has unearned story trophies to hide.
    const demoEarned = [1, 14, 15, 16, 17, 18, 19, 30, 31, 35, 40, 52, 53];
    progress = { earned: {}, counts: {} };
    for (const id of demoEarned.slice(0, seed)) progress.earned[id] = true;
    progress.counts[15] = 120;
    progress.counts[31] = 45;
    saveProgress(progress);
  }
}

async function main() {
  const params = new URLSearchParams(window.location.search);
  const [trophyData, sourceData] = await Promise.all([
    fetch('data/trophies.json').then((r) => r.json()),
    fetch('data/sources.json').then((r) => r.json()),
  ]);
  trophies = trophyData.trophies;
  sources = sourceData.sources;
  seedFromQuery(params);

  const preselect = Number(params.get('trophy'));
  state.selectedId = trophies.some((t) => t.id === preselect) ? preselect : 28;
  const spoilerParam = params.get('spoiler');
  if (spoilerParam === '1') {
    state.spoiler = true;
    document.getElementById('spoilerToggle').checked = true;
  }
  const viewParam = params.get('view');
  if (['checklist', 'roadmap', 'missables'].includes(viewParam)) state.view = viewParam;

  const onKindChange = (kind) => {
    state.kind = kind;
    renderKindChips(document.getElementById('kindChips'), state, onKindChange);
    rerender();
  };
  renderKindChips(document.getElementById('kindChips'), state, onKindChange);
  document.getElementById('search').addEventListener('input', (event) => {
    state.query = event.target.value;
    rerender();
  });
  document.getElementById('gradeFilter').addEventListener('change', (event) => {
    state.grade = event.target.value;
    rerender();
  });
  document.getElementById('earnedOnly').addEventListener('change', (event) => {
    state.earnedOnly = event.target.checked;
    rerender();
  });
  document.getElementById('spoilerToggle').addEventListener('change', (event) => {
    state.spoiler = event.target.checked;
    rerender();
  });
  document.getElementById('exportBtn').addEventListener('click', () => {
    downloadFile('leonida-platinum-progress.json', exportText(progress));
  });
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      progress = importProgress(await file.text(), trophies);
      saveProgress(progress);
      rerender();
    } catch (err) {
      alert(`Could not import that file: ${err.message}`);
    }
    event.target.value = '';
  });
  document.querySelectorAll('.views button').forEach((button) => {
    button.addEventListener('click', () => setView(button.dataset.view));
  });

  renderRoadmap(trophies, progress);
  renderMissables(trophies);
  setView(state.view);
  rerender();

  // Test and automation handle: the app's state, for driving it in a browser.
  window.__guide = {
    state,
    get trophies() { return trophies; },
    get progress() { return progress; },
    select: selectTrophy,
    setView,
  };
}

main().catch((err) => {
  document.getElementById('trophyList').innerHTML =
    `<li>Could not load the trophy list: ${err.message}</li>`;
  console.error(err);
});
