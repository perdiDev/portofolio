/**
 * Project plates for the home page Work section (src/components/Work.astro).
 *
 * Each plate pairs the project's real screens with a line drawing taken from
 * the project's own subject: a day's load curve for a solar/diesel planner,
 * sea depth contours for a boat tracker, and so on. Drawings are generated
 * here as plain SVG (one stroke weight, one hue per project) so they stay
 * crisp, themeable and cheap.
 */
import type { ImageMetadata } from 'astro';

import hyHome from '../assets/projects/hyskysfc/home.jpeg';
import hyPlts from '../assets/projects/hyskysfc/plts.jpeg';
import hyPltd from '../assets/projects/hyskysfc/pltd.jpeg';
import boatMap from '../assets/projects/boat-safe-system/screenshot-1.png';
import boatDevice from '../assets/projects/boat-safe-system/screenshot-4.png';
import ccHome from '../assets/projects/child-care/beranda.jpg';
import ccCommunity from '../assets/projects/child-care/komunitas.jpg';
import ccTips from '../assets/projects/child-care/tips.jpg';
import tsHome from '../assets/projects/tukar-senyum/screenshot-1.png';
import tsCatalog from '../assets/projects/tukar-senyum/screenshot-2.png';
import wkHome from '../assets/projects/wisataki/phone-1.jpg';
import wkScan from '../assets/projects/wisataki/phone-2.jpg';
import wkConfirm from '../assets/projects/wisataki/phone-3.jpg';
import pdDashboard from '../assets/projects/pokidulu/screenshot-2.png';
import pdOrders from '../assets/projects/pokidulu/screenshot-4.png';
import sdLogin from '../assets/projects/sapadesa/login.png';
import sdLetter from '../assets/projects/sapadesa/pembuatan-surat.png';

export type Plate = {
  hue: string;
  kind: 'phones' | 'browser';
  shots: { src: ImageMetadata; alt: string }[];
  art: string;
};

/** Hue for a project without a plate of its own (the light-theme accent). */
export const FALLBACK_HUE = '#8a4a30';

/* ---------- drawing helpers (viewBox 0 0 1600 900) ---------- */

let k = 0;
const ln = (d: string, extra = '') =>
  `<path class="ln" style="--k:${k++}" pathLength="1" d="${d}" ${extra}/>`;
const circ = (cx: number, cy: number, r: number) =>
  `<circle class="ln" style="--k:${k++}" pathLength="1" cx="${cx}" cy="${cy}" r="${r}"/>`;
const txt = (x: number, y: number, s: string, anchor = 'middle') =>
  `<text class="tx" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Closed wobbly ring, used for contour lines. */
function ring(cx: number, cy: number, r: number, seed: number, sx = 1.5, sy = 1) {
  const pts: string[] = [];
  for (let i = 0; i <= 96; i++) {
    const t = (i / 96) * Math.PI * 2;
    const w =
      1 +
      0.09 * Math.sin(3 * t + seed) +
      0.05 * Math.sin(5 * t + seed * 2.1) +
      0.03 * Math.cos(7 * t + seed);
    pts.push(`${r1(cx + Math.cos(t) * r * w * sx)} ${r1(cy + Math.sin(t) * r * w * sy)}`);
  }
  return `M${pts.join('L')}Z`;
}

/** Leaf from the origin along +x, rotated and moved into place. */
const leaf = (x: number, y: number, a: number, l: number) =>
  ln(
    `M0 0Q${l * 0.45} ${-l * 0.32} ${l} 0Q${l * 0.45} ${l * 0.32} 0 0M0 0L${l * 0.8} 0`,
    `transform="translate(${x} ${y}) rotate(${a})"`,
  );

/** Rose seen from above: a loose spiral. */
function rose(cx: number, cy: number, size: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 160; i++) {
    const t = (i / 160) * Math.PI * 7;
    const r = size * (0.06 + t / (Math.PI * 7)) * (1 + 0.08 * Math.sin(5 * t));
    pts.push(`${r1(cx + Math.cos(t) * r)} ${r1(cy + Math.sin(t) * r)}`);
  }
  return ln(`M${pts.join('L')}`);
}

function receipt(x: number, y: number, w: number, h: number, a: number) {
  const teeth = 9;
  let zig = '';
  for (let i = 1; i <= teeth; i++) {
    const tx = x + w - (w / teeth) * i;
    zig += `L${r1(tx + w / teeth / 2)} ${y + h + 14}L${r1(tx)} ${y + h}`;
  }
  const rows = [0.22, 0.32, 0.42, 0.52, 0.66]
    .map((f, i) => `M${x + 28} ${r1(y + h * f)}H${r1(x + w - 28 - (i % 2) * w * 0.3)}`)
    .join('');
  return `<g transform="rotate(${a} ${x + w / 2} ${y + h / 2})">${ln(`M${x} ${y}H${x + w}V${y + h}${zig}Z`)}${ln(rows)}${ln(`M${x + 28} ${r1(y + h * 0.8)}H${x + w - 28}`, 'class="ln ds"')}</g>`;
}

const finder = (x: number, y: number, s: number) =>
  ln(`M${x} ${y}h${s}v${s}h${-s}Z`) +
  ln(`M${x + s * 0.17} ${y + s * 0.17}h${s * 0.66}v${s * 0.66}h${-s * 0.66}Z`) +
  ln(`M${x + s * 0.34} ${y + s * 0.34}h${s * 0.32}v${s * 0.32}h${-s * 0.32}Z`);

const pin = (x: number, y: number) =>
  ln(`M${x} ${y}c-14-22-30-36-30-56a30 30 0 0 1 60 0c0 20-16 34-30 56Z`) + circ(x, y - 58, 10);

/* ---------- drawings ---------- */

function artHySky() {
  k = 0;
  const x0 = 100,
    x1 = 1500,
    base = 780,
    hx = (h: number) => x0 + ((x1 - x0) / 24) * h;
  const grid = [200, 345, 490, 635].map((y) => `M${x0} ${y}H${x1}`).join('');
  const ticks = Array.from(
    { length: 25 },
    (_, h) => `M${r1(hx(h))} ${base}v${h % 6 ? 8 : 16}`,
  ).join('');
  const labels = [0, 6, 12, 18, 24]
    .map((h) => txt(hx(h), base + 44, String(h).padStart(2, '0') + '.00'))
    .join('');
  const rays = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return `M${r1(1420 + Math.cos(a) * 58)} ${r1(150 + Math.sin(a) * 58)}L${r1(1420 + Math.cos(a) * 80)} ${r1(150 + Math.sin(a) * 80)}`;
  }).join('');
  const solar = `M${hx(6)} ${base}C${hx(9)} ${base} ${hx(10)} 300 ${hx(12)} 300S${hx(15)} ${base} ${hx(18)} ${base}`;
  return `
    <defs><pattern id="hatch-hy" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V16"/></pattern>
    <clipPath id="clip-hy"><path d="${solar}Z"/></clipPath></defs>
    <path class="gr" d="${grid}"/>
    <rect class="fl" x="0" y="0" width="1600" height="900" fill="url(#hatch-hy)" clip-path="url(#clip-hy)"/>
    ${ln(`M${x0} ${base}H${x1}`)}${ln(ticks)}
    ${ln(solar)}
    ${ln(`M${x0} 470C${hx(3)} 500 ${hx(5)} 520 ${hx(7)} 430S${hx(10)} 400 ${hx(12)} 420S${hx(16)} 380 ${hx(19)} 250S${hx(22)} 330 ${x1} 420`, 'class="ln bold"')}
    ${circ(1420, 150, 40)}${ln(rays)}
    ${labels}
    ${txt(x0, 180, 'BEBAN · kW', 'start')}${txt(hx(12), 280, 'PLTS')}`;
}

function artBoat() {
  k = 0;
  const a = [70, 125, 180, 240, 305, 375]
    .map((r, i) => ln(ring(260, 210, r, 1.3 + i * 0.35)))
    .join('');
  const b = [60, 115, 175, 240, 310].map((r, i) => ln(ring(1380, 760, r, 4.1 + i * 0.3))).join('');
  const track = 'M-20 640C180 600 300 700 470 620S760 420 930 440S1130 380 1190 300';
  return `
    ${a}${b}
    ${ln(track, 'class="ln ds"')}
    ${circ(1190, 300, 16)}${circ(1190, 300, 46)}${circ(1190, 300, 84)}
    ${ln('M1190 270V330M1160 300H1220')}
    ${txt(260, 216, '−12 m')}${txt(1380, 766, '−8 m')}${txt(1190, 412, 'LIVE · LoRa')}`;
}

function artChildCare() {
  k = 0;
  const bubble = (x: number, y: number, w: number, right: boolean) => {
    const h = 64,
      r = 28;
    const tail = right ? `M${x + w - 18} ${y + h}l18 18l-2-22` : `M${x + 18} ${y + h}l-18 18l2-22`;
    return ln(
      `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z${tail}`,
    );
  };
  const lines = Array.from(
    { length: 9 },
    (_, i) => `M1400 ${300 + i * 46}H${i % 3 === 2 ? 1470 : 1530}`,
  ).join('');
  return `
    ${bubble(60, 110, 260, false)}${bubble(150, 230, 210, true)}${bubble(60, 350, 300, false)}${bubble(170, 470, 190, true)}${bubble(60, 590, 240, false)}
    ${ln('M1370 160H1510L1560 210V800H1370Z')}${ln('M1510 160V210H1560')}
    ${ln(lines)}
    ${ln('M1404 750V710M1432 750V670M1460 750V700M1488 750V650M1516 750V685', 'class="ln bold"')}
    ${txt(1400, 250, 'LAPORAN', 'start')}`;
}

function artTukarSenyum() {
  k = 0;
  const stem = (d: string) => ln(d);
  return `
    ${stem('M130 940C150 780 110 640 190 470S240 250 210 150')}
    ${leaf(170, 620, -40, 120)}${leaf(196, 500, 210, 110)}${leaf(220, 330, -60, 100)}
    ${rose(208, 132, 70)}
    ${stem('M60 940C90 820 40 720 70 600')}${leaf(78, 760, 200, 90)}${leaf(70, 640, -70, 80)}
    ${stem('M1500 940C1470 760 1530 620 1440 480S1380 300 1420 210')}
    ${leaf(1468, 680, 220, 120)}${leaf(1440, 520, -30, 110)}${leaf(1406, 380, 200, 100)}
    ${rose(1420, 190, 60)}
    ${stem('M1570 940C1550 840 1580 760 1560 680')}${leaf(1556, 760, -40, 80)}`;
}

function artWisataki() {
  k = 0;
  const ridge = (y: number, amp: number, seed: number) => {
    const pts: string[] = [];
    for (let x = -20; x <= 1620; x += 40)
      pts.push(
        `${x} ${r1(y - amp * (0.6 + 0.4 * Math.sin(x / 210 + seed)) * Math.abs(Math.sin(x / 330 + seed)))}`,
      );
    return ln(`M${pts.join('L')}`);
  };
  return `
    ${ridge(860, 220, 0.4)}${ridge(880, 150, 2.2)}
    ${ln('M80 820C190 700 110 560 200 470S250 330 170 250', 'class="ln ds"')}
    ${pin(80, 820)}${pin(170, 250)}
    ${ln('M1530 840C1440 720 1530 600 1420 520S1390 420 1460 330', 'class="ln ds"')}
    ${pin(1460, 330)}
    ${finder(1420, 60, 110)}${finder(60, 50, 80)}
    ${txt(170, 160, 'SUMPA BITTA')}${txt(1460, 240, 'TITIK SCAN')}`;
}

function artPokidulu() {
  k = 0;
  return `
    ${receipt(40, 80, 250, 420, -8)}
    ${receipt(110, 470, 220, 330, 6)}
    ${receipt(1320, 120, 240, 400, 7)}
    ${ln('M1250 620H1560V700A26 26 0 0 0 1560 752V820H1250V752A26 26 0 0 0 1250 700Z')}
    ${ln('M1330 620V820', 'class="ln ds"')}
    ${txt(1450, 730, 'PRE-ORDER')}${txt(1450, 770, 'No. 0042')}`;
}

function artSapaDesa() {
  k = 0;
  const terrace = (y: number, amp: number, seed: number) => {
    const pts: string[] = [];
    for (let x = -20; x <= 1620; x += 40)
      pts.push(`${x} ${r1(y + amp * Math.sin(x / 170 + seed))}`);
    return ln(`M${pts.join('L')}`);
  };
  const rows = [640, 700, 760, 820].map((y, i) => terrace(y, 22 - i * 3, i * 0.9)).join('');
  const lines = Array.from(
    { length: 7 },
    (_, i) => `M1330 ${240 + i * 44}H${i % 3 === 2 ? 1420 : 1500}`,
  ).join('');
  return `
    ${ln('M-20 560L180 400L300 490L470 330L640 560')}
    ${rows}
    ${ln('M1290 120H1560V520H1290Z')}
    ${ln('M1330 170H1440', 'class="ln bold"')}
    ${ln(lines)}
    ${circ(1470, 450, 26)}${circ(1470, 450, 12)}
    ${finder(70, 90, 90)}
    ${txt(1425, 100, 'SURAT KETERANGAN')}${txt(70, 230, 'BONTO KARAENG', 'start')}`;
}

export const PLATES: Record<string, Plate> = {
  hyskysfc: {
    hue: '#2e7d8f',
    kind: 'phones',
    shots: [
      { src: hyPlts, alt: 'Data PLTS page with an Input File Excel button and a time range' },
      { src: hyHome, alt: 'HySkySFC dashboard with Input Data PLTS and Input Data PLTD buttons' },
      { src: hyPltd, alt: 'Data PLTD page with a Tambah Mesin PLTD button' },
    ],
    art: artHySky(),
  },
  'boat-safe-system': {
    hue: '#2f6690',
    kind: 'browser',
    shots: [
      {
        src: boatMap,
        alt: 'Boat Safe System live map with a boat marker and a Live Tracking badge',
      },
      {
        src: boatDevice,
        alt: 'Detail Komponen page with the ESP32, LoRa Ra-02 and MPU 9250 modules',
      },
    ],
    art: artBoat(),
  },
  'child-care': {
    hue: '#2b8fb0',
    kind: 'phones',
    shots: [
      { src: ccCommunity, alt: 'ChildCare community feed' },
      { src: ccHome, alt: 'ChildCare home page with a Bincang dengan anak dipandu AI card' },
      { src: ccTips, alt: 'ChildCare tips page with puzzle, card, game and journaling activities' },
    ],
    art: artChildCare(),
  },
  'tukar-senyum': {
    hue: '#5b8a66',
    kind: 'browser',
    shots: [
      { src: tsHome, alt: 'Tukar Senyum home page with the headline Rangkai Cerita Lewat Bunga' },
      { src: tsCatalog, alt: 'Curated collection of three bouquets with prices' },
    ],
    art: artTukarSenyum(),
  },
  wisataki: {
    hue: '#1f6b58',
    kind: 'phones',
    shots: [
      { src: wkScan, alt: 'Wisataki camera scanning a QR code at a destination' },
      { src: wkHome, alt: 'Wisataki home page with a Scan Now card and visit history' },
      { src: wkConfirm, alt: 'Group size confirmation dialog for Sumpa Bitta' },
    ],
    art: artWisataki(),
  },
  pokidulu: {
    hue: '#7652b0',
    kind: 'browser',
    shots: [
      {
        src: pdDashboard,
        alt: 'Pokidulu organization dashboard with revenue, order, product and member cards',
      },
      { src: pdOrders, alt: 'Order list with order code, customer, status and total columns' },
    ],
    art: artPokidulu(),
  },
  sapadesa: {
    hue: '#4f7a3a',
    kind: 'browser',
    shots: [
      {
        src: sdLogin,
        alt: 'SapaDesa login page with a rice field and mountain background and the Portal Masuk sign-in card',
      },
      {
        src: sdLetter,
        alt: 'Buat Surat page with a live preview of a Surat Keterangan Usaha with the village letterhead',
      },
    ],
    art: artSapaDesa(),
  },
};
