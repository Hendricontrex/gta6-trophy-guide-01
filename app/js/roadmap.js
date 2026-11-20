// Roadmap to the platinum and the missables page, both built from the
// official descriptions and the counts PlayStation tracks — no invented
// locations, and anything unconfirmed says so.
import { isEarned } from './store.js';

const STAGES = [
  {
    title: 'Step 1 — Story and optional missions',
    time: 'about 60 to 80 hours',
    lines: [
      'Play the story at your own pace through all five chapters. The 12 story trophies (opening mission, four chapter completions, six named main missions, the final mission) unlock automatically and none can be missed.',
      'Do the Chapter 1 meditation at Jason’s house: one morning Lucia says she is going to meditate and walks to the balcony. Follow her and accept it — it may be the list’s only missable trophy.',
      'Take optional missions as they appear. The 100% checklist needs any 100 of them, out of several hundred.',
      'Scan every new vehicle with the WAiNK app (100% needs 200 of 277) and study new animals through the binoculars (100% needs 100 of 255).',
      'Keep a manual save at the start and end of each chapter. Missions cannot be replayed, and there are 15 manual slots plus one autosave.',
      'Keep cheats off the file you use for the platinum: cheats disable trophies and stop the game saving.',
    ],
    trophyKinds: ['story'],
  },
  {
    title: 'Step 2 — The 100% checklist and challenges',
    time: 'about 100 hours',
    lines: [
      'After the story, open Progress, then Stats, then 100% Completion. Everything you did during the story already counts, and nothing on it is missable.',
      'The checklist is lenient — closer to 60% true completion. You need 70 of 80 challenges, 15 of 18 meditations, 300 stunts, 15 of 18 card sets, 200 of 277 vehicles and 100 of 255 animals.',
      'The parts that need everything: all robberies (39 gang operations, 22 bank jobs, 7 Payday Loan jobs, 8 bank vaults), all 33 underwater discoveries, all shooting ranges, all drone races and all of Bret’s quests.',
      'This step earns A Long Road (gold) and, on the way, most of the activity, collectible and robbery trophies.',
    ],
    trophyKinds: ['completion', 'activities', 'collectibles', 'crime'],
  },
  {
    title: 'Step 3 — Strangers & Freaks and cleanup',
    time: 'about 10 hours',
    lines: [
      'Finish the 8 stranger mission strands for Strangers & Freaks — it is not part of the 100% checklist, so it may still be open.',
      'Clean up whatever is left: side strands for Andy, Kenton, Billy, Randy, Tyrone and Bret, the money trophies, and the miscellaneous ones.',
      'When A Long Road pops, Vice Got a Price! follows immediately.',
    ],
    trophyKinds: ['side', 'money', 'misc', 'exploration'],
  },
];

const LOOKS_MISSABLE = [
  ['Kenton goes quiet', 'Kenton disappears after Chapter 1 and returns later. His treasure-diving strand can be finished after the story.'],
  ['Optional missions vanish', 'Many optional missions disappear after a while. There are far more than the 100 the checklist needs.'],
  ['Fences leave for good', 'Some fences leave permanently. None of them has a trophy quest.'],
  ['Magazines in story buildings', 'A few magazine collectibles sit in story buildings that close off. They also spawn elsewhere.'],
  ['Hourglass quests', 'Quests with an hourglass icon can fail on a timer. None is tied to a trophy.'],
  ['Jason and Lucia’s relationship', 'The relationship between the two characters does not matter for trophies.'],
];

export function renderRoadmap(trophies, progress) {
  const box = document.getElementById('roadmapBox');
  box.innerHTML = '';
  for (const stage of STAGES) {
    const div = document.createElement('div');
    div.className = 'stage';
    const h = document.createElement('h2');
    h.textContent = stage.title;
    const time = document.createElement('span');
    time.textContent = stage.time;
    h.appendChild(time);
    div.appendChild(h);
    const ul = document.createElement('ul');
    for (const line of stage.lines) {
      const li = document.createElement('li');
      li.textContent = line;
      ul.appendChild(li);
    }
    div.appendChild(ul);
    const stageTrophies = trophies.filter((t) => stage.trophyKinds.includes(t.kind));
    const earned = stageTrophies.filter((t) => isEarned(progress, t.id)).length;
    const p = document.createElement('p');
    p.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = `${earned} of ${stageTrophies.length} trophies in this step earned`;
    if (earned === stageTrophies.length) strong.classList.add('done');
    p.appendChild(strong);
    p.appendChild(document.createTextNode(` — ${stageTrophies.map((t) => t.name).join(', ')}`));
    div.appendChild(p);
    box.appendChild(div);
  }
  const note = document.createElement('div');
  note.className = 'stage';
  const nh = document.createElement('h2');
  nh.textContent = 'Save advice and warnings';
  note.appendChild(nh);
  const ul = document.createElement('ul');
  for (const line of [
    'The game has 15 manual save slots and 1 autosave. Because missions cannot be replayed, PowerPyx suggests keeping a save at the start and end of each chapter, then rotating the rest during free roam.',
    'PowerPyx warns the Irredeemable criminal profile is permanent and makes police more aggressive. You can still earn everything, but the cleanup gets harder.',
    'There are no mission medals this time, so you never need to replay a mission for a rating. Free roam continues after the story.',
  ]) {
    const li = document.createElement('li');
    li.textContent = line;
    ul.appendChild(li);
  }
  note.appendChild(ul);
  box.appendChild(note);
}

export function renderMissables(trophies) {
  const box = document.getElementById('missablesBox');
  box.innerHTML = '';
  const missable = trophies.filter((t) => t.missable);
  for (const t of missable) {
    const div = document.createElement('div');
    div.className = 'mcard';
    const h = document.createElement('h2');
    h.textContent = `${t.name} — possibly missable`;
    const p = document.createElement('p');
    p.textContent = t.guide;
    const src = document.createElement('p');
    src.textContent = 'Flagged by PowerPyx as the list’s only possible missable. Push Square lists no known missables. Do the Chapter 1 meditation when it appears and the risk is gone.';
    div.append(h, p, src);
    box.appendChild(div);
  }
  const safe = document.createElement('div');
  safe.className = 'mcard safe';
  const h = document.createElement('h2');
  h.textContent = 'Looks missable, but it is not';
  safe.appendChild(h);
  const ul = document.createElement('ul');
  for (const [title, text] of LOOKS_MISSABLE) {
    const li = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = `${title}: `;
    li.append(strong, document.createTextNode(text));
    ul.appendChild(li);
  }
  safe.appendChild(ul);
  box.appendChild(safe);
  const foot = document.createElement('div');
  foot.className = 'mcard safe';
  const fh = document.createElement('h2');
  fh.textContent = 'Everything else';
  foot.appendChild(fh);
  const fp = document.createElement('p');
  fp.textContent = 'Every other trophy stays available after the story in free roam. All 12 story trophies unlock automatically, all side strands come back after the story, and nothing on the 100% checklist is missable.';
  foot.appendChild(fp);
  box.appendChild(foot);
}
