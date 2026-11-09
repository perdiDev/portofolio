// Generates placeholder brand assets (monogram icons, avatar) and sample project
// screenshots from inline SVG. Run with: `pnpm assets`
// Replace the output with real artwork whenever you like; nothing else depends on this script.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (...parts) => join(root, ...parts);

const BG = '#0c0c0d';
const SURFACE = '#141416';
const BORDER = '#27272a';
const TEXT = '#e4e4e7';
const MUTED = '#a1a1aa';
const ACCENT = '#6ee7b7';

/* ------------------------------------------------------------------ */
/* Monogram icons                                                      */
/* ------------------------------------------------------------------ */
const monogram = (size, { radius = 0.22, glyph = 0.62 } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * radius}" fill="${BG}"/>
  <rect x="${size * 0.04}" y="${size * 0.04}" width="${size * 0.92}" height="${size * 0.92}" rx="${size * radius * 0.85}" fill="none" stroke="${BORDER}" stroke-width="${Math.max(1, size * 0.012)}"/>
  <text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="${size * glyph}" fill="${ACCENT}">P</text>
</svg>`;

async function icons() {
  await mkdir(out('public'), { recursive: true });
  await writeFile(
    out('public/favicon.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${BG}"/>
  <text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="40" fill="${ACCENT}">P</text>
</svg>
`,
  );

  const png = (size, opts) =>
    sharp(Buffer.from(monogram(size, opts)))
      .png()
      .toBuffer();
  await writeFile(out('public/apple-touch-icon.png'), await png(180, { radius: 0 }));
  await writeFile(out('public/icon-192.png'), await png(192));
  await writeFile(out('public/icon-512.png'), await png(512));
  await writeFile(out('public/icon-maskable-512.png'), await png(512, { radius: 0, glyph: 0.46 }));

  // favicon.ico: a single 32x32 PNG wrapped in an ICO container.
  const ico32 = await png(32);
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(32, 6);
  header.writeUInt8(32, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(ico32.length, 14);
  header.writeUInt32LE(22, 18);
  await writeFile(out('public/favicon.ico'), Buffer.concat([header, ico32]));

  await mkdir(out('src/assets'), { recursive: true });
  await sharp(Buffer.from(monogram(640, { radius: 0.5, glyph: 0.6 })))
    .png()
    .toFile(out('src/assets/avatar.png'));
}

/* ------------------------------------------------------------------ */
/* Project screenshots: simple browser-frame mockups                   */
/* ------------------------------------------------------------------ */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function browser({ url, body, width = 1600, height = 1000 }) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Helvetica, Arial, sans-serif">
  <rect width="${width}" height="${height}" fill="#09090b"/>
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="18" fill="${BG}" stroke="${BORDER}" stroke-width="2"/>
  <path d="M58 40h${width - 116}a18 18 0 0 1 18 18v46H40V58a18 18 0 0 1 18-18z" fill="${SURFACE}"/>
  <line x1="40" y1="104" x2="${width - 40}" y2="104" stroke="${BORDER}" stroke-width="2"/>
  <circle cx="76" cy="72" r="8" fill="#3f3f46"/><circle cx="104" cy="72" r="8" fill="#3f3f46"/><circle cx="132" cy="72" r="8" fill="#3f3f46"/>
  <rect x="200" y="54" width="${width - 400}" height="36" rx="18" fill="${BG}" stroke="${BORDER}" stroke-width="2"/>
  <text x="${width / 2}" y="78" text-anchor="middle" font-size="20" fill="${MUTED}">${esc(url)}</text>
  <g transform="translate(40 104)">${body}</g>
</svg>`;
}

const bar = (x, y, w, h = 14, fill = '#27272a', r = 7) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
const text = (x, y, s, size = 24, fill = TEXT, weight = 400, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;

const W = 1520; // inner width
const H = 856; // inner height

const sidebar = (items, active = 0) =>
  `<rect width="260" height="${H}" fill="${SURFACE}"/><line x1="260" y1="0" x2="260" y2="${H}" stroke="${BORDER}" stroke-width="2"/>` +
  text(36, 64, 'workspace', 26, TEXT, 700) +
  items
    .map(
      (label, i) =>
        (i === active
          ? `<rect x="20" y="${100 + i * 56}" width="220" height="44" rx="10" fill="#1f2a26"/>`
          : '') +
        text(44, 129 + i * 56, label, 20, i === active ? ACCENT : MUTED, i === active ? 600 : 400),
    )
    .join('');

const card = (x, y, w, h, title, value, sub) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${SURFACE}" stroke="${BORDER}" stroke-width="2"/>` +
  text(x + 28, y + 46, title, 18, MUTED) +
  text(x + 28, y + 100, value, 44, TEXT, 700) +
  text(x + 28, y + 136, sub, 16, ACCENT);

function sparkline(x, y, w, h, seed = 1) {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    const v = 0.5 + 0.28 * Math.sin(t * 6 + seed) + 0.18 * Math.sin(t * 13 + seed * 2) + t * 0.2;
    return [x + t * w, y + h - Math.min(0.95, Math.max(0.05, v)) * h];
  });
  const d = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');
  return `<path d="${d}" fill="none" stroke="${ACCENT}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
}

const projects = {
  'dev-notes-cli': {
    url: 'github.com/perdidev/devnotes',
    shots: [
      // 1: terminal overview
      () =>
        `<rect width="${W}" height="${H}" fill="#0a0a0b"/>` +
        text(60, 80, '$ devnotes new "Fix flaky test in CI"', 30, ACCENT, 600) +
        text(60, 130, '✔ created notes/2026-09-14-fix-flaky-test-in-ci.md', 26, MUTED) +
        text(60, 210, '$ devnotes search timeout', 30, ACCENT, 600) +
        [0, 1, 2]
          .map((i) =>
            text(
              60,
              260 + i * 44,
              [
                'notes/2026-08-02-api-timeouts.md',
                'notes/2026-06-17-retry-policy.md',
                'notes/2026-03-11-pg-statement-timeout.md',
              ][i],
              26,
              TEXT,
            ),
          )
          .join('') +
        text(60, 430, '$ devnotes list --tag linux --since 30d', 30, ACCENT, 600) +
        [0, 1, 2, 3]
          .map((i) =>
            text(
              60,
              480 + i * 44,
              [
                '2026-10-29  systemd timer for backups     #linux',
                '2026-10-21  strace cheat sheet            #linux',
                '2026-10-12  tuning swappiness             #linux',
                '2026-10-03  journalctl filters             #linux',
              ][i],
              24,
              MUTED,
            ),
          )
          .join('') +
        text(60, 720, '$ █', 30, ACCENT, 600),
      // 2: search results
      () =>
        `<rect width="${W}" height="${H}" fill="#0a0a0b"/>` +
        text(60, 80, 'devnotes search "commit" --context 1', 30, ACCENT, 600) +
        [0, 1, 2]
          .map(
            (i) =>
              text(
                60,
                150 + i * 190,
                [
                  'notes/git-commit-style.md',
                  'notes/code-review-checklist.md',
                  'notes/release-process.md',
                ][i],
                26,
                TEXT,
                700,
              ) +
              bar(60, 176 + i * 190, 900, 12, '#27272a') +
              bar(60, 206 + i * 190, 740, 12, '#1f1f22') +
              bar(60, 236 + i * 190, 560, 12, '#1f1f22'),
          )
          .join(''),
      // 3: config
      () =>
        `<rect width="${W}" height="${H}" fill="#0a0a0b"/>` +
        text(60, 80, '~/.config/devnotes/config.toml', 26, MUTED) +
        [
          'editor = "nvim"',
          'directory = "~/notes"',
          'date_format = "%Y-%m-%d"',
          '',
          '[sync]',
          'remote = "git@github.com:perdidev/notes.git"',
          'auto_commit = true',
          '',
          '[templates]',
          'default = "daily"',
        ]
          .map((l, i) =>
            text(
              60,
              150 + i * 46,
              l,
              28,
              l.startsWith('[') ? ACCENT : TEXT,
              l.startsWith('[') ? 700 : 400,
            ),
          )
          .join(''),
    ],
  },
  'budget-tracker': {
    url: 'budget.example.dev/dashboard',
    shots: [
      () =>
        sidebar(['Overview', 'Transactions', 'Budgets', 'Reports', 'Settings'], 0) +
        text(300, 70, 'Overview', 36, TEXT, 700) +
        text(300, 104, 'October 2026', 20, MUTED) +
        card(300, 140, 280, 170, 'Income', '$4,820', '+3.2% vs last month') +
        card(610, 140, 280, 170, 'Spending', '$3,146', '−5.8% vs last month') +
        card(920, 140, 280, 170, 'Saved', '$1,674', '34.7% of income') +
        card(1230, 140, 250, 170, 'Budgets', '7 / 9', 'on track') +
        `<rect x="300" y="340" width="900" height="440" rx="14" fill="${SURFACE}" stroke="${BORDER}" stroke-width="2"/>` +
        text(328, 390, 'Spending over time', 20, MUTED) +
        sparkline(330, 420, 840, 320, 1) +
        `<rect x="1230" y="340" width="250" height="440" rx="14" fill="${SURFACE}" stroke="${BORDER}" stroke-width="2"/>` +
        text(1256, 390, 'Top categories', 20, MUTED) +
        ['Rent', 'Groceries', 'Transport', 'Dining']
          .map(
            (c, i) =>
              text(1256, 450 + i * 70, c, 18, TEXT) +
              bar(1256, 462 + i * 70, 200 - i * 40, 10, i === 0 ? ACCENT : '#3f3f46'),
          )
          .join(''),
      () =>
        sidebar(['Overview', 'Transactions', 'Budgets', 'Reports', 'Settings'], 1) +
        text(300, 70, 'Transactions', 36, TEXT, 700) +
        bar(300, 110, 520, 44, '#1b1b1e', 10) +
        text(324, 140, 'Search transactions', 18, MUTED) +
        Array.from({ length: 9 }, (_, i) => {
          const y = 190 + i * 66;
          return (
            `<line x1="300" y1="${y}" x2="1480" y2="${y}" stroke="${BORDER}" stroke-width="2"/>` +
            text(
              300,
              y + 42,
              [
                'Oct 28',
                'Oct 27',
                'Oct 27',
                'Oct 25',
                'Oct 24',
                'Oct 22',
                'Oct 21',
                'Oct 19',
                'Oct 18',
              ][i],
              20,
              MUTED,
            ) +
            text(
              420,
              y + 42,
              [
                'Corner Market',
                'Metro pass',
                'Salary',
                'Coffee Lab',
                'Electric Co.',
                'Bookshop',
                'Streaming',
                'Pharmacy',
                'Gym',
              ][i],
              22,
              TEXT,
            ) +
            text(
              1480,
              y + 42,
              [
                '−$62.40',
                '−$54.00',
                '+$4,820.00',
                '−$4.80',
                '−$78.12',
                '−$23.90',
                '−$11.99',
                '−$18.30',
                '−$35.00',
              ][i],
              22,
              i === 2 ? ACCENT : TEXT,
              600,
              'end',
            )
          );
        }).join(''),
      () =>
        sidebar(['Overview', 'Transactions', 'Budgets', 'Reports', 'Settings'], 2) +
        text(300, 70, 'Budgets', 36, TEXT, 700) +
        ['Rent', 'Groceries', 'Transport', 'Dining out', 'Subscriptions', 'Health']
          .map((c, i) => {
            const x = 300 + (i % 2) * 600;
            const y = 120 + Math.floor(i / 2) * 210;
            const pct = [100, 82, 61, 94, 45, 30][i];
            return (
              `<rect x="${x}" y="${y}" width="570" height="180" rx="14" fill="${SURFACE}" stroke="${BORDER}" stroke-width="2"/>` +
              text(x + 28, y + 50, c, 24, TEXT, 600) +
              text(x + 542, y + 50, `${pct}%`, 22, pct > 90 ? '#fbbf24' : ACCENT, 600, 'end') +
              bar(x + 28, y + 90, 514, 14, '#27272a') +
              bar(x + 28, y + 90, (514 * pct) / 100, 14, pct > 90 ? '#fbbf24' : ACCENT) +
              text(x + 28, y + 150, 'Resets on the 1st', 16, MUTED)
            );
          })
          .join(''),
    ],
  },
  'portfolio-engine': {
    url: 'github.com/perdidev/site-starter',
    shots: [
      () =>
        `<rect width="${W}" height="${H}" fill="${BG}"/>` +
        text(80, 90, 'Site Starter', 28, TEXT, 700) +
        text(W - 80, 90, 'Blog   Projects   About', 20, MUTED, 400, 'end') +
        text(80, 250, 'Write. Ship. Rank.', 84, TEXT, 700) +
        text(80, 320, 'An opinionated Astro starter for developer blogs.', 30, MUTED) +
        `<rect x="80" y="370" width="220" height="60" rx="12" fill="${ACCENT}"/>` +
        text(190, 408, 'Use template', 22, '#04241a', 700, 'middle') +
        [0, 1, 2]
          .map(
            (i) =>
              `<rect x="${80 + i * 460}" y="520" width="420" height="220" rx="14" fill="${SURFACE}" stroke="${BORDER}" stroke-width="2"/>` +
              text(
                110 + i * 460,
                580,
                ['SEO built in', 'Zero JS by default', 'Typed content'][i],
                24,
                TEXT,
                700,
              ) +
              bar(110 + i * 460, 620, 330, 12) +
              bar(110 + i * 460, 650, 260, 12, '#1f1f22'),
          )
          .join(''),
      () =>
        `<rect width="${W}" height="${H}" fill="${BG}"/>` +
        text(80, 90, 'Lighthouse report', 28, TEXT, 700) +
        ['Performance', 'Accessibility', 'Best Practices', 'SEO']
          .map((l, i) => {
            const cx = 250 + i * 340;
            return (
              `<circle cx="${cx}" cy="330" r="110" fill="none" stroke="#27272a" stroke-width="18"/><circle cx="${cx}" cy="330" r="110" fill="none" stroke="${ACCENT}" stroke-width="18" stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 110}" stroke-dashoffset="0" transform="rotate(-90 ${cx} 330)"/>` +
              text(cx, 352, '100', 64, TEXT, 700, 'middle') +
              text(cx, 500, l, 24, MUTED, 500, 'middle')
            );
          })
          .join('') +
        text(80, 680, 'LCP 0.9 s  ·  CLS 0  ·  TBT 0 ms', 26, MUTED),
      () =>
        `<rect width="${W}" height="${H}" fill="#0a0a0b"/>` +
        text(60, 80, 'src/content/blog/hello-world.md', 24, MUTED) +
        [
          '---',
          'title: "Hello, world"',
          'description: "My first post, written in Markdown."',
          'pubDate: 2026-01-12',
          'category: Programming',
          'tags: [astro, markdown]',
          '---',
          '',
          '## It works',
          '',
          'Drop a file in the folder and ship it.',
        ]
          .map((l, i) =>
            text(60, 150 + i * 46, l, 28, l === '---' ? MUTED : l.startsWith('##') ? ACCENT : TEXT),
          )
          .join(''),
    ],
  },
};

async function screenshots() {
  for (const [slug, { url, shots }] of Object.entries(projects)) {
    const dir = out('src/assets/projects', slug);
    await mkdir(dir, { recursive: true });
    for (const [i, body] of shots.entries()) {
      const svg = browser({ url, body: body() });
      await sharp(Buffer.from(svg))
        .png({ compressionLevel: 9 })
        .toFile(join(dir, `screenshot-${i + 1}.png`));
    }
  }
}

/* ------------------------------------------------------------------ */
/* Blog images (sample content)                                        */
/* ------------------------------------------------------------------ */
const mono = "'DejaVu Sans Mono', 'Courier New', monospace";
const frame = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="Helvetica, Arial, sans-serif"><rect width="${w}" height="${h}" fill="${BG}"/><rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="24" fill="none" stroke="${BORDER}" stroke-width="4"/>${body}</svg>`;
const t = (x, y, s, size, fill = TEXT, weight = 400, anchor = 'start', family = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${family ? ` font-family="${family}"` : ''}>${esc(s)}</text>`;

function permissionBits() {
  const groups = [
    { name: 'Owner (u)', bits: [1, 1, 1], sum: 7 },
    { name: 'Group (g)', bits: [1, 0, 1], sum: 5 },
    { name: 'Others (o)', bits: [1, 0, 0], sum: 4 },
  ];
  const labels = ['r', 'w', 'x'];
  const values = [4, 2, 1];
  let body =
    t(70, 90, 'chmod 754 report.sh', 44, ACCENT, 700, 'start', mono) +
    t(70, 140, '-rwxr-xr--  1 perdi perdi  report.sh', 30, MUTED, 400, 'start', mono);
  groups.forEach((g, gi) => {
    const x0 = 70 + gi * 440;
    body += t(x0, 230, g.name, 28, TEXT, 700);
    g.bits.forEach((on, i) => {
      const x = x0 + i * 124;
      body +=
        `<rect x="${x}" y="260" width="108" height="108" rx="16" fill="${on ? '#12332a' : SURFACE}" stroke="${on ? ACCENT : BORDER}" stroke-width="3"/>` +
        t(x + 54, 330, on ? labels[i] : '-', 54, on ? ACCENT : MUTED, 700, 'middle', mono) +
        t(x + 54, 410, `${values[i]}`, 26, MUTED, 400, 'middle') +
        t(x + 54, 400 + 0, '', 1);
    });
    body +=
      `<line x1="${x0}" y1="450" x2="${x0 + 356}" y2="450" stroke="${BORDER}" stroke-width="3"/>` +
      t(x0 + 178, 540, `${g.sum}`, 84, TEXT, 700, 'middle', mono) +
      t(
        x0 + 178,
        590,
        g.bits
          .map((b, i) => (b ? values[i] : 0))
          .filter(Boolean)
          .join(' + '),
        24,
        MUTED,
        400,
        'middle',
      );
  });
  body += t(
    70,
    670,
    'Each triplet is the sum of the bits that are set: read = 4, write = 2, execute = 1.',
    26,
    MUTED,
  );
  return frame(1400, 720, body);
}

function bigO() {
  const w = 1400,
    h = 800,
    x0 = 130,
    y0 = 700,
    cw = 1180,
    ch = 560;
  const curves = [
    { label: 'O(1)', color: '#93c5fd', f: () => 0.04 },
    { label: 'O(log n)', color: ACCENT, f: (n) => (Math.log2(1 + n * 31) / 5.0) * 0.28 },
    { label: 'O(n)', color: '#fbbf24', f: (n) => n * 0.5 },
    { label: 'O(n log n)', color: '#f9a8d4', f: (n) => ((n * Math.log2(1 + n * 31)) / 5.0) * 0.62 },
    { label: 'O(n²)', color: '#fca5a5', f: (n) => n * n * 0.98 },
  ];
  let body = t(70, 80, 'How work grows as the input grows', 38, TEXT, 700);
  body += `<line x1="${x0}" y1="${y0}" x2="${x0 + cw}" y2="${y0}" stroke="${MUTED}" stroke-width="3"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - ch}" stroke="${MUTED}" stroke-width="3"/>`;
  body += t(x0 + cw / 2, y0 + 56, 'input size (n)', 26, MUTED, 400, 'middle');
  body += `<text transform="translate(60 ${y0 - ch / 2}) rotate(-90)" font-size="26" fill="${MUTED}" text-anchor="middle">operations</text>`;
  curves.forEach((c, ci) => {
    const pts = Array.from({ length: 60 }, (_, i) => {
      const n = i / 59;
      const y = Math.min(1, c.f(n));
      return `${i ? 'L' : 'M'}${(x0 + n * cw).toFixed(1)} ${(y0 - y * ch).toFixed(1)}`;
    }).join(' ');
    body += `<path d="${pts}" fill="none" stroke="${c.color}" stroke-width="6" stroke-linecap="round"/>`;
    body +=
      `<rect x="${x0 + 40}" y="${y0 - ch + 20 + ci * 46}" width="26" height="8" rx="4" fill="${c.color}"/>` +
      t(x0 + 82, y0 - ch + 32 + ci * 46, c.label, 26, TEXT, 600, 'start', mono);
  });
  return frame(w, h, body);
}

function genericsCover() {
  let body =
    `<rect x="140" y="150" width="1320" height="600" rx="24" fill="${SURFACE}" stroke="${BORDER}" stroke-width="3"/>` +
    `<circle cx="190" cy="196" r="9" fill="#3f3f46"/><circle cx="222" cy="196" r="9" fill="#3f3f46"/><circle cx="254" cy="196" r="9" fill="#3f3f46"/>` +
    t(800, 202, 'identity.ts', 24, MUTED, 400, 'middle', mono);
  body += `<text x="190" y="330" font-size="34" font-weight="700" font-family="${mono}" fill="${TEXT}">function first<tspan fill="${ACCENT}">&lt;T&gt;</tspan>(items: T[]): T | undefined {</text>`;
  body += t(250, 410, 'return items[0];', 34, MUTED, 400, 'start', mono);
  body += t(190, 490, '}', 34, TEXT, 700, 'start', mono);
  body += `<text x="190" y="610" font-size="36" font-family="${mono}" fill="${MUTED}">first([1, 2, 3])   <tspan fill="${ACCENT}">// number | undefined</tspan></text>`;
  body += `<text x="190" y="680" font-size="36" font-family="${mono}" fill="${MUTED}">first(['a', 'b'])  <tspan fill="${ACCENT}">// string | undefined</tspan></text>`;
  return frame(1600, 900, body);
}

async function blogImages() {
  const dir = out('src/assets/blog');
  await mkdir(dir, { recursive: true });
  const files = {
    'permission-bits.png': permissionBits(),
    'big-o-growth.png': bigO(),
    'typescript-generics-cover.png': genericsCover(),
  };
  for (const [name, svg] of Object.entries(files)) {
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(join(dir, name));
  }
}

await icons();
await screenshots();
await blogImages();
console.log('Generated icons, avatar, project screenshots, and blog images.');
