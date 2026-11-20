// Checklist and detail panel rendering. The detail panel shows one
// trophy at a time: its official description, the guide in this site's
// own words, its sources as links, a missable warning where one applies,
// and a counter for trophies with a tracked target.
import { KINDS, applyFilters, isSpoilerHidden, kindLabel } from './filters.js';
import { earnedCount, getCount, isEarned } from './store.js';

const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };

export function renderKindChips(container, state, onChange) {
  container.innerHTML = '';
  for (const kind of KINDS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = kind.label;
    if (state.kind === kind.id) button.classList.add('active');
    button.addEventListener('click', () => onChange(kind.id));
    container.appendChild(button);
  }
}

export function renderProgress(trophies, progress) {
  const earned = earnedCount(progress, trophies);
  const pct = Math.round((earned / trophies.length) * 100);
  document.getElementById('progressCount').textContent = `${earned}/${trophies.length}`;
  document.getElementById('progressPct').textContent = `${pct}%`;
  const byGrade = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const n = trophies.filter((t) => t.grade === g && isEarned(progress, t.id)).length;
    const total = trophies.filter((t) => t.grade === g).length;
    return `${n}/${total} ${g}`;
  });
  document.getElementById('progressByGrade').textContent = byGrade.join(' · ');
}

export function renderList(trophies, state, progress, selectedId, onSelect, onToggle) {
  const list = document.getElementById('trophyList');
  const meta = document.getElementById('listMeta');
  const empty = document.getElementById('emptyState');
  const shown = applyFilters(trophies, state, progress);
  list.innerHTML = '';
  empty.hidden = shown.length > 0;
  if (state.kind === 'online') {
    meta.textContent = 'No online trophies — every one of the 55 is single-player and offline.';
  } else {
    meta.textContent = `Showing ${shown.length} of ${trophies.length} trophies.`;
  }
  for (const t of shown) {
    const li = document.createElement('li');
    if (t.id === selectedId) li.classList.add('selected');
    if (isEarned(progress, t.id)) li.classList.add('earned');
    const hidden = isSpoilerHidden(t, state, progress);

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = isEarned(progress, t.id);
    check.setAttribute('aria-label', `Mark ${hidden ? 'story trophy' : t.name} as earned`);
    check.addEventListener('click', (event) => {
      event.stopPropagation();
      onToggle(t.id, check.checked);
    });

    const body = document.createElement('div');
    body.className = 'tbody';
    const name = document.createElement('div');
    name.className = 'tname';
    name.textContent = hidden ? 'Hidden story trophy — earn it to reveal' : t.name;
    const desc = document.createElement('div');
    desc.className = 'tdesc';
    desc.textContent = hidden ? 'Complete this part of the story to reveal its name and description.' : t.description;
    const tags = document.createElement('div');
    tags.className = 'tags';
    for (const [label, cls] of [
      [kindLabel(t.kind), ''],
      [t.missable ? 'Possibly missable' : null, 'missable'],
      [t.hidden ? 'Hidden on PSN' : null, 'hidden'],
      [t.target ? `Target: ${t.target.toLocaleString()}` : null, ''],
    ]) {
      if (!label) continue;
      const tag = document.createElement('span');
      tag.className = `tag ${cls}`.trim();
      tag.textContent = label;
      tags.appendChild(tag);
    }
    body.append(name, desc, tags);

    const medal = document.createElement('span');
    medal.className = `medal ${t.grade}`;
    medal.textContent = GRADE_LABEL[t.grade];

    li.append(check, body, medal);
    li.addEventListener('click', () => onSelect(t.id));
    list.appendChild(li);
  }
}

export function renderDetail(trophy, sources, state, progress, onCountChange) {
  const panel = document.getElementById('detailPanel');
  panel.innerHTML = '';
  if (!trophy) {
    const p = document.createElement('p');
    p.textContent = 'Pick a trophy on the left to read its guide.';
    panel.appendChild(p);
    return;
  }
  const hidden = isSpoilerHidden(trophy, state, progress);
  const medal = document.createElement('span');
  medal.className = `medal ${trophy.grade}`;
  medal.textContent = GRADE_LABEL[trophy.grade];
  const title = document.createElement('h2');
  title.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = hidden
    ? 'Spoiler-free mode is on. Earn this trophy to reveal its official name and description.'
    : `“${trophy.description}” — as PlayStation publishes it.`;
  panel.append(medal, title, official);

  if (trophy.missable) {
    const warn = document.createElement('div');
    warn.className = 'warnbox';
    warn.textContent = 'Possibly missable — read the guide below before you pass Chapter 1.';
    panel.appendChild(warn);
  }

  const guideTitle = document.createElement('h3');
  guideTitle.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.textContent = hidden ? 'Hidden until earned.' : trophy.guide;
  panel.append(guideTitle, guide);

  if (trophy.target && !hidden) {
    const counter = document.createElement('div');
    counter.className = 'counter';
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.textContent = '−';
    minus.setAttribute('aria-label', 'Decrease progress');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.value = String(getCount(progress, trophy.id));
    input.setAttribute('aria-label', 'Your progress toward the target');
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.textContent = '+';
    plus.setAttribute('aria-label', 'Increase progress');
    const of = document.createElement('span');
    of.textContent = `of ${trophy.target.toLocaleString()}`;
    const apply = (value) => {
      const v = Math.max(0, Math.floor(Number(value) || 0));
      input.value = String(v);
      onCountChange(trophy.id, v);
    };
    minus.addEventListener('click', () => apply(getCount(progress, trophy.id) - 1));
    plus.addEventListener('click', () => apply(getCount(progress, trophy.id) + 1));
    input.addEventListener('change', () => apply(input.value));
    counter.append(minus, input, plus, of);
    panel.appendChild(counter);
  }

  if (!hidden) {
    const srcTitle = document.createElement('h3');
    srcTitle.textContent = 'Sources';
    const list = document.createElement('ul');
    list.className = 'sources';
    for (const key of trophy.sources || []) {
      const entry = sources[key];
      const item = document.createElement('li');
      if (entry) {
        const a = document.createElement('a');
        a.href = entry.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = entry.name;
        item.appendChild(a);
      } else {
        item.textContent = key;
      }
      list.appendChild(item);
    }
    const note = document.createElement('li');
    note.textContent = 'Official names, descriptions and grades: Exophase / PSNProfiles.';
    list.appendChild(note);
    panel.append(srcTitle, list);
  }
}
