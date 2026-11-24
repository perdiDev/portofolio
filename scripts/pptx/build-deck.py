#!/usr/bin/env python3
"""Build the portfolio deck (16:9 .pptx) from the site's own content.

Sources: src/content/projects/*.md, src/assets, and .tools/pptx-data.json (written by
scripts/pptx/dump-data.mjs from src/config). The diary/blog is excluded on purpose.

Run:  pnpm deck      (see package.json)  or
      node --experimental-strip-types scripts/pptx/dump-data.mjs
      .tools/pptx-venv/bin/python scripts/pptx/build-deck.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml
from lxml import etree
from PIL import Image, ImageDraw, ImageFont
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Inches, Pt

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'src'
BUILD = ROOT / '.tools' / 'pptx-build'
OUT = ROOT / 'portfolio-deck' / 'Perdi-Portfolio.pptx'
BUILD.mkdir(parents=True, exist_ok=True)
OUT.parent.mkdir(parents=True, exist_ok=True)

# ---- Tokens (src/styles/foundation/tokens.css) -------------------------------------------
LIGHT = dict(bg='f4f1ea', bg2='ece8df', ink='1d1b18', muted='6f6b63', line='d9d4c8', accent='8a4a30')
DARK = dict(bg='141311', bg2='1c1a17', ink='ece7dd', muted='9a958a', line='2d2a25', accent='dba685')
SERIF, SANS, MONO = 'Georgia', 'Arial', 'Consolas'  # safe everywhere; site uses Lora/Inter/JetBrains Mono

W, H = 13.333, 7.5
M = 0.7  # outer margin, equal left/right

HUES = {
    'hyskysfc': '2e7d8f', 'boat-safe-system': '2f6690', 'child-care': '2b8fb0',
    'tukar-senyum': '5b8a66', 'wisataki': '1f6b58', 'pokidulu': '7652b0', 'sapadesa': '4f7a3a',
}
CASE_STUDIES = ['hyskysfc', 'boat-safe-system', 'child-care']
# Which images to show. 'composite' = already a styled phone mockup, shown as is.
SHOTS = {
    'hyskysfc': ('composite', ['screenshot-1.png']),
    'child-care': ('composite', ['screenshot-1.png']),
    'wisataki': ('composite', ['screenshot-1.png']),
    'boat-safe-system': ('browser', ['screenshot-1.png', 'screenshot-4.png']),
    'pokidulu': ('browser', ['screenshot-2.png', 'screenshot-3.png']),
    'tukar-senyum': ('browser', ['screenshot-1.png', 'screenshot-2.png']),
    'sapadesa': ('browser', ['manajemen-penduduk.png', 'pembuatan-surat.png']),
}

# ---- Text measuring (no renderer available, so estimate with metric-compatible fonts) -----
_FONT_FILES = {
    SANS: ('/usr/share/fonts/liberation/LiberationSans-Regular.ttf', 1.02),
    SERIF: ('/usr/share/fonts/liberation/LiberationSerif-Regular.ttf', 1.14),  # Georgia is wider than Times
    MONO: ('/usr/share/fonts/liberation/LiberationMono-Regular.ttf', 1.0),
}
_font_cache: dict = {}


def text_width_in(text: str, font: str, size: float, spc: float = 0) -> float:
    path, k = _FONT_FILES[font]
    f = _font_cache.setdefault((font, size), ImageFont.truetype(path, int(size * 10)))
    return (f.getlength(text) / 10 * k + spc * len(text)) / 72


def wrap_lines(text: str, font: str, size: float, width: float, spc: float = 0) -> int:
    lines = 0
    for para in text.split('\n'):
        cur = ''
        n = 1
        for word in para.split(' '):
            trial = (cur + ' ' + word).strip()
            if cur and text_width_in(trial, font, size, spc) > width:
                n += 1
                cur = word
            else:
                cur = trial
        lines += n
    return lines


def text_height(text: str, font: str, size: float, width: float, ls: float = 1.0, spc: float = 0) -> float:
    return wrap_lines(text, font, size, width, spc) * size * 1.22 * ls / 72


# ---- Low level helpers -------------------------------------------------------------------
def rgb(h: str) -> RGBColor:
    return RGBColor.from_string(h.upper())


def mix(a: str, b: str, pct: float) -> str:
    """pct of a over b, like color-mix(in srgb, a pct%, b)."""
    ca = [int(a[i:i + 2], 16) for i in (0, 2, 4)]
    cb = [int(b[i:i + 2], 16) for i in (0, 2, 4)]
    return ''.join(f'{round(x * pct + y * (1 - pct)):02x}' for x, y in zip(ca, cb))


def shape(slide, kind, x, y, w, h, fill=None, line=None, lw=0.75):
    s = slide.shapes.add_shape(kind, Inches(x), Inches(y), Inches(w), Inches(h))
    if fill:
        s.fill.solid()
        s.fill.fore_color.rgb = rgb(fill)
    else:
        s.fill.background()
    if line:
        s.line.color.rgb = rgb(line)
        s.line.width = Pt(lw)
    else:
        s.line.fill.background()
    s.shadow.inherit = False
    return s


def rect(slide, x, y, w, h, fill=None, line=None, lw=0.75):
    return shape(slide, MSO_SHAPE.RECTANGLE, x, y, w, h, fill, line, lw)


def rule(slide, x, y, w, color, lw=0.75):
    c = slide.shapes.add_connector(1, Inches(x), Inches(y), Inches(x + w), Inches(y))
    c.line.color.rgb = rgb(color)
    c.line.width = Pt(lw)
    return c


def vrule(slide, x, y, h, color, lw=0.75):
    c = slide.shapes.add_connector(1, Inches(x), Inches(y), Inches(x), Inches(y + h))
    c.line.color.rgb = rgb(color)
    c.line.width = Pt(lw)
    return c


def set_radius(shp, frac: float):
    gd = shp._element.spPr.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}prstGeom')
    av = gd.find('{http://schemas.openxmlformats.org/drawingml/2006/main}avLst')
    if av is None:
        av = etree.SubElement(gd, '{http://schemas.openxmlformats.org/drawingml/2006/main}avLst')
    for c in list(av):
        av.remove(c)
    g = etree.SubElement(av, '{http://schemas.openxmlformats.org/drawingml/2006/main}gd')
    g.set('name', 'adj')
    g.set('fmla', f'val {int(frac * 100000)}')


def shadow(shp, alpha=26000, blur=0.28, dist=0.1):
    a = 'http://schemas.openxmlformats.org/drawingml/2006/main'
    sp = shp._element.spPr
    for e in sp.findall(f'{{{a}}}effectLst'):
        sp.remove(e)
    eff = etree.SubElement(sp, f'{{{a}}}effectLst')
    sh = etree.SubElement(eff, f'{{{a}}}outerShdw', blurRad=str(int(blur * 914400)),
                          dist=str(int(dist * 914400)), dir='5400000', algn='t', rotWithShape='0')
    clr = etree.SubElement(sh, f'{{{a}}}srgbClr', val='0E0D0B')
    etree.SubElement(clr, f'{{{a}}}alpha', val=str(alpha))


def text(slide, x, y, w, h, content, size=12, color='000000', font=SANS, bold=False, italic=False,
         align='l', anchor='t', ls=1.0, spc=0, upper=False):
    """content: str (\n = new paragraph) or list of paragraphs, each a str or list of (text, opts)."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = {'t': MSO_ANCHOR.TOP, 'm': MSO_ANCHOR.MIDDLE, 'b': MSO_ANCHOR.BOTTOM}[anchor]
    paras = content.split('\n') if isinstance(content, str) else content
    for i, p in enumerate(paras):
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        para.alignment = {'l': PP_ALIGN.LEFT, 'c': PP_ALIGN.CENTER, 'r': PP_ALIGN.RIGHT}[align]
        para.line_spacing = ls
        runs = [(p, {})] if isinstance(p, str) else p
        for t, o in runs:
            r = para.add_run()
            r.text = t.upper() if (o.get('upper', upper)) else t
            f = r.font
            f.name = o.get('font', font)
            f.size = Pt(o.get('size', size))
            f.bold = o.get('bold', bold)
            f.italic = o.get('italic', italic)
            f.color.rgb = rgb(o.get('color', color))
            sp = o.get('spc', spc)
            if sp:
                r._r.get_or_add_rPr().set('spc', str(int(sp * 100)))
    return tb


def cover_picture(slide, path: Path, x, y, w, h, radius=0.0, focus=(0.5, 0.5)):
    """Add an image filling the box, cropping the overflow (like object-fit: cover)."""
    iw, ih = Image.open(path).size
    box, img = w / h, iw / ih
    pic = slide.shapes.add_picture(str(path), Inches(x), Inches(y), Inches(w), Inches(h))
    if img > box:  # too wide: crop sides
        keep = box / img
        left = (1 - keep) * focus[0]
        pic.crop_left, pic.crop_right = left, 1 - keep - left
    else:
        keep = img / box
        top = (1 - keep) * focus[1]
        pic.crop_top, pic.crop_bottom = top, 1 - keep - top
    if radius:
        pic.auto_shape_type = MSO_SHAPE.ROUNDED_RECTANGLE
        set_radius(pic, radius)
    return pic


def month_label(ym: str | None) -> str:
    if not ym:
        return 'Present'
    y, m = ym.split('-')
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][int(m) - 1] + f' {y}'


def norm_ym(ym: str) -> str:
    y, m = ym.split('-')
    return f'{y}-{int(m):02d}'


# ---- Deck scaffolding --------------------------------------------------------------------
prs = Presentation()
prs.slide_width, prs.slide_height = Inches(W), Inches(H)
BLANK = prs.slide_layouts[6]
page_no = [0]


def new_slide(dark=False, section='', chrome=True):
    s = prs.slides.add_slide(BLANK)
    pal = DARK if dark else LIGHT
    s.background.fill.solid()
    s.background.fill.fore_color.rgb = rgb(pal['bg'])
    page_no[0] += 1
    if chrome:
        text(s, M, 0.38, 5, 0.2, 'Perdi · Portfolio', 8.5, pal['muted'], MONO, spc=1.2, upper=True)
        if section:
            text(s, W - M - 5, 0.38, 5, 0.2, section, 8.5, pal['muted'], MONO, align='r', spc=1.2, upper=True)
        rule(s, M, 0.7, W - 2 * M, pal['line'])
        text(s, M, 7.03, 3, 0.2, f'{page_no[0]:02d}', 8.5, pal['accent'], MONO, spc=1.2)
        text(s, W - M - 5, 7.03, 5, 0.2, 'perdidev@gmail.com', 8.5, pal['muted'], MONO, align='r', spc=1.2)
    return s, pal


def heading(s, pal, x, y, w, parts, size=40, ls=0.95):
    """parts: list of (text, is_accent). Italic serif accent, once per heading."""
    runs = [(t, {'italic': True, 'color': pal['accent']} if acc else {}) for t, acc in parts]
    plain = ''.join(t for t, _ in parts)
    h = text_height(plain, SERIF, size, w, ls)
    text(s, x, y, w, h + 0.1, [runs], size, pal['ink'], SERIF, ls=ls, spc=-0.6)
    return h


def number_label(s, pal, x, y, n, label):
    text(s, x, y, min(6, W - M - x), 0.2, [[(n, {'color': pal['accent']}), (f'   {label}', {'color': pal['muted']})]], 9.5,
         pal['muted'], MONO, spc=1.4, upper=True)


def chip(s, pal, x, y, label, size=9):
    w = text_width_in(label, MONO, size, 0.5) + 0.34
    b = shape(s, MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, 0.3, None, pal['line'] if pal is not LIGHT else 'c9c3b4', 0.75)
    set_radius(b, 0.5)
    text(s, x, y, w, 0.3, label, size, pal['ink'], MONO, align='c', anchor='m', spc=0.5)
    return w


def chip_flow(s, pal, x, y, w, labels, size=9, gap=0.1):
    cx, cy = x, y
    for lb in labels:
        cw = text_width_in(lb, MONO, size, 0.5) + 0.34
        if cx + cw > x + w:
            cx, cy = x, cy + 0.4
        chip(s, pal, cx, cy, lb, size)
        cx += cw + gap
    return cy + 0.3 - y


# ---- Load data ---------------------------------------------------------------------------
data = json.loads((ROOT / '.tools' / 'pptx-data.json').read_text())
AUTHOR, EDU, SOCIALS = data['AUTHOR'], data['EDUCATION'], data['SOCIALS']
EXPERIENCE, ACH = data['EXPERIENCE'], data['ACHIEVEMENTS']


def load_projects():
    items = []
    for f in sorted((SRC / 'content' / 'projects').glob('*.md')):
        raw = f.read_text()
        m = re.match(r'^---\n(.*?)\n---\n', raw, re.S)
        fm = yaml.safe_load(m.group(1))
        fm['slug'] = f.stem
        if f.stem not in HUES or not fm.get('show', True):
            continue  # same set as the home page Work grid (Pomodoro CLI is not on it)
        items.append(fm)
    items.sort(key=lambda p: (p['order'], -p['date'].toordinal()))
    return items


PROJECTS = load_projects()


def split_title(t: str):
    if ' - ' in t:
        a, b = t.split(' - ', 1)
        return a.strip(), b.strip()
    return t, ''


# ---- Cover art: arch portrait with outline arches ----------------------------------------
def make_arch(path: Path):
    S = 3  # supersample
    cw, ch = 760, 1010
    pw, ph = 520, 700
    img = Image.new('RGBA', (cw * S, ch * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx = cw * S // 2
    bottom = ch * S - 40 * S

    def arch_box(wid, hei):
        return (cx - wid * S // 2, bottom - hei * S, cx + wid * S // 2, bottom)

    def draw_arch(drawer, box, **kw):
        x0, y0, x1, y1 = box
        r = (x1 - x0) // 2
        drawer.pieslice((x0, y0, x1, y0 + 2 * r), 180, 360, **kw)
        drawer.rectangle((x0, y0 + r, x1, y1), **kw)

    acc = tuple(int(DARK['accent'][i:i + 2], 16) for i in (0, 2, 4))
    for grow, alpha in ((120, 70), (60, 130)):
        b = arch_box(pw + grow, ph + grow)
        layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        draw_arch(ld, b, fill=acc + (alpha,))
        inner = arch_box(pw + grow - 3, ph + grow - 3)
        inner = (inner[0] + 2 * S, inner[1] + 2 * S, inner[2] - 2 * S, inner[3])
        mask = Image.new('L', img.size, 0)
        draw_arch(ImageDraw.Draw(mask), inner, fill=255)
        layer.paste((0, 0, 0, 0), mask=mask)
        img = Image.alpha_composite(img, layer)
    photo = Image.open(SRC / 'assets' / 'photo.jpeg').convert('RGB')
    box = arch_box(pw, ph)
    ow, oh = box[2] - box[0], box[3] - box[1]
    scale = max(ow / photo.width, oh / photo.height)
    photo = photo.resize((int(photo.width * scale), int(photo.height * scale)), Image.LANCZOS)
    left = (photo.width - ow) // 2
    top = int((photo.height - oh) * 0.12)
    photo = photo.crop((left, top, left + ow, top + oh))
    mask = Image.new('L', img.size, 0)
    draw_arch(ImageDraw.Draw(mask), box, fill=255)
    layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
    layer.paste(photo, (box[0], box[1]))
    layer.putalpha(mask.crop((0, 0, *img.size)))
    out = Image.alpha_composite(img, Image.composite(layer, Image.new('RGBA', img.size, (0, 0, 0, 0)), mask))
    out = out.resize((cw, ch), Image.LANCZOS)
    out.save(path)
    return cw / ch


# ======================================================================================
# 1. Cover
# ======================================================================================
s, pal = new_slide(dark=True, section='Portfolio 2026')
ratio = make_arch(BUILD / 'arch.png')
ph = 6.0
pw = ph * ratio
s.shapes.add_picture(str(BUILD / 'arch.png'), Inches(W - M - pw), Inches(0.95), Inches(pw), Inches(ph))
text(s, M, 1.55, 6, 0.25, [[('Software engineer', {})]], 10, pal['accent'], MONO, spc=2, upper=True)
text(s, M, 1.95, 7, 1.7, [[('Perdi', {})]], 96, pal['ink'], SERIF, spc=-2.5, ls=0.9)
text(s, M, 3.65, 6.6, 1.2, [[('Backends in Go and Laravel,', {})], [('apps in ', {}), ('Flutter.', {'italic': True, 'color': pal['accent']})]],
     27, pal['ink'], SERIF, ls=1.05)
rule(s, M, 5.2, 1.0, pal['accent'], 1.5)
text(s, M, 5.4, 6, 0.9, f'{AUTHOR["location"]["city"]}, Indonesia\nInformatics Engineering, Universitas Hasanuddin', 11,
     pal['muted'], SANS, ls=1.35)
text(s, M, 6.4, 6, 0.25, '4+ years · web · mobile · IoT', 9.5, pal['muted'], MONO, spc=1.4, upper=True)

# ======================================================================================
# 2. Introduction + contents
# ======================================================================================
s, pal = new_slide(section='Hello')
NAV = [('01', 'Craft', 'Selected projects'), ('02', 'Journey', 'Work and teaching'),
       ('03', 'Foundations', 'Education'), ('04', 'Recognition', 'Competitions and awards'),
       ('05', 'Connect', 'Get in touch')]
heading(s, pal, M, 1.2, 6.2, [('Building things that ', False), ('work', True), (' in the field.', False)], 38)
text(s, M, 3.3, 5.6, 1.3,
     AUTHOR['bio'] + ' I have shipped Go and Laravel backends, Flutter apps and an IoT boat tracker, '
     'for clients, teams and competitions.', 13, pal['ink'], SANS, ls=1.3)
stats = [('4+', 'Years building'), (str(len(PROJECTS)), 'Projects shown'), (str(len(ACH)), 'Awards'),
         (str(len(EXPERIENCE)), 'Organisations')]
sx = M
for big, lab in stats:
    text(s, sx, 5.35, 1.5, 0.7, big, 38, pal['accent'], SERIF, spc=-1)
    text(s, sx, 6.15, 1.45, 0.4, lab, 8.5, pal['muted'], MONO, spc=1, upper=True)
    sx += 1.55
cx0, cw0 = 7.7, W - M - 7.7
ry = 1.25
for n, name, sub in NAV:
    rule(s, cx0, ry, cw0, pal['line'])
    text(s, cx0, ry + 0.2, 0.6, 0.3, n, 10, pal['accent'], MONO, spc=1.2)
    text(s, cx0 + 0.75, ry + 0.1, 3.2, 0.6, name, 26, pal['ink'], SERIF, spc=-0.5)
    text(s, cx0 + 3.4, ry + 0.26, cw0 - 3.4, 0.3, sub, 9, pal['muted'], MONO, align='r', spc=1, upper=True)
    ry += 1.1
rule(s, cx0, ry, cw0, pal['line'])

# ======================================================================================
# 3. Craft overview grid
# ======================================================================================
s, pal = new_slide(section='01 · Craft')
number_label(s, pal, M, 1.0, '01', 'Craft')
heading(s, pal, M, 1.3, 8, [('Selected ', False), ('work', True)], 36)
cols, gap = 4, 0.28
cwid = (W - 2 * M - gap * (cols - 1)) / cols
chh = cwid / 1.6
for i, p in enumerate(PROJECTS):
    r, c = divmod(i, cols)
    x = M + c * (cwid + gap)
    y = 2.1 + r * 2.35
    hue = HUES[p['slug']]
    kind, files = SHOTS[p['slug']]
    thumb = SRC / 'assets' / 'projects' / p['slug'] / files[0]
    pic = cover_picture(s, thumb, x, y, cwid, chh, radius=0.03)
    pic.line.color.rgb = rgb(pal['line'])
    pic.line.width = Pt(0.75)
    t1, _ = split_title(p['title'])
    text(s, x, y + chh + 0.1, 0.4, 0.2, f'{i + 1:02d}', 9, pal['accent'], MONO, spc=1)
    text(s, x + 0.4, y + chh + 0.07, cwid - 0.4, 0.3, t1, 13, pal['ink'], SERIF)
    text(s, x, y + chh + 0.38, cwid, 0.2, f'{p["status"]} · {p["date"].year}', 8, pal['muted'], MONO, spc=1, upper=True)
# 8th cell: link back to the idea of more to come
x = M + 3 * (cwid + gap)
y = 2.1 + 1 * 2.35
rect(s, x, y, cwid, chh, None, pal['line'])
text(s, x, y, cwid, chh, [[('More on ', {}), ('GitHub', {'italic': True, 'color': pal['accent']})]], 18, pal['ink'], SERIF,
     align='c', anchor='m')
text(s, x, y + chh + 0.1, cwid, 0.3, 'github.com/perdidev', 9, pal['muted'], MONO, spc=0.8, align='c')


# ======================================================================================
# 4. One slide per project (+ case study slides)
# ======================================================================================
def browser(s, pal, x, y, w, img: Path, hue):
    bar = 0.26
    ih = w / 1.6
    frame = rect(s, x, y, w, bar + ih, 'faf8f3', mix(hue, 'ffffff', 0.35), 0.75)
    shadow(frame, 30000, 0.35, 0.12)
    rect(s, x, y, w, bar, 'efebe2', None)
    for i, cc in enumerate(('d98e7a', 'e3c273', '9fc18a')):
        shape(s, MSO_SHAPE.OVAL, x + 0.12 + i * 0.14, y + bar / 2 - 0.04, 0.08, 0.08, cc)
    cover_picture(s, img, x, y + bar, w, ih)
    return bar + ih


def project_slide(p, idx):
    slug = p['slug']
    hue = HUES[slug]
    s, pal = new_slide(section='01 · Craft')
    kind, files = SHOTS[slug]
    sx, sy, sw, sh = M, 1.15, 7.3, 4.56
    imgdir = SRC / 'assets' / 'projects' / slug
    if kind == 'composite':
        pic = cover_picture(s, imgdir / files[0], sx, sy, sw, sh, radius=0.025)
        pic.line.color.rgb = rgb(mix(hue, LIGHT['bg'], 0.3))
        pic.line.width = Pt(0.75)
    else:
        rect(s, sx, sy, sw, sh, mix(hue, LIGHT['bg'], 0.13), None)
        bw1, bw2 = 4.7, 3.4
        h1 = browser(s, pal, sx + 0.4, sy + 0.4, bw1, imgdir / files[0], hue)
        browser(s, pal, sx + sw - bw2 - 0.35, sy + sh - (bw2 / 1.6 + 0.26) - 0.35, bw2, imgdir / files[1], hue)
    cap = p['screenshots'][0]['caption'] if p.get('screenshots') else ''
    if cap:
        text(s, sx, sy + sh + 0.18, sw, 0.5, cap, 9.5, pal['muted'], SANS, italic=True, ls=1.2)
    # right column
    rx = sx + sw + 0.55
    rw = W - M - rx
    y = 1.15
    number_label(s, pal, rx, y, f'{idx:02d}', f'{p["status"]} · {p["date"].year}')
    y += 0.4
    t1, t2 = split_title(p['title'])
    th = text_height(t1, SERIF, 30, rw, 1.0)
    text(s, rx, y, rw, th + 0.05, t1, 30, pal['ink'], SERIF, spc=-0.6)
    y += th + 0.06
    if t2:
        text(s, rx, y, rw, 0.3, t2, 12, pal['accent'], SERIF, italic=True)
        y += 0.36
    y += 0.1
    sh_ = text_height(p['summary'], SANS, 11.5, rw, 1.25)
    text(s, rx, y, rw, sh_ + 0.05, p['summary'], 11.5, pal['ink'], SANS, ls=1.25)
    y += sh_ + 0.22
    for lab, val in (('Role', p['role']), ('Duration', str(p['duration']))):
        rule(s, rx, y, rw, pal['line'])
        text(s, rx, y + 0.1, 1.1, 0.2, lab, 8.5, pal['muted'], MONO, spc=1.2, upper=True)
        vh = text_height(val, SANS, 10.5, rw - 1.2)
        text(s, rx + 1.2, y + 0.08, rw - 1.2, vh + 0.05, val, 10.5, pal['ink'], SANS)
        y += max(0.4, vh + 0.2)
    rule(s, rx, y, rw, pal['line'])
    y += 0.18
    stack = list(p['techStack'])[:7]
    y += chip_flow(s, pal, rx, y, rw, stack, 8.5) + 0.22
    # outcome, shortened to fit the remaining space
    out = p.get('outcome', '').strip()
    avail = 6.55 - y
    while out and text_height(out, SERIF, 10.5, rw, 1.2) > avail and ' ' in out:
        out = out[:out.rfind('. ', 0, len(out) - 1) + 1] if '. ' in out[:-1] else out[:out.rfind(' ')] + '…'
    if out:
        text(s, rx, y, rw, avail, out, 10.5, pal['muted'], SERIF, italic=True, ls=1.2)
    if p.get('liveUrl') or p.get('repoUrl'):
        link = (p.get('liveUrl') or p.get('repoUrl')).replace('https://', '').rstrip('/')
        text(s, sx, 6.55, sw, 0.25, link, 8.5, pal['accent'], MONO, spc=0.8)
    return s


def case_slide(p):
    s, pal = new_slide(dark=True, section='01 · Craft · Case study')
    t1, _ = split_title(p['title'])
    text(s, M, 1.0, 8, 0.25, f'{t1} · challenges and solutions', 9.5, pal['accent'], MONO, spc=1.4, upper=True)
    heading(s, pal, M, 1.35, 9, [('What was ', False), ('hard', True)], 34)
    items = p['challenges'][:3]
    n = len(items)
    gap = 0.4
    cw = (W - 2 * M - gap * (n - 1)) / n
    for i, it in enumerate(items):
        x = M + i * (cw + gap)
        y = 2.5
        rule(s, x, y, cw, pal['accent'], 1.25)
        text(s, x, y + 0.15, cw, 0.2, f'0{i + 1} · Challenge', 8.5, pal['muted'], MONO, spc=1.2, upper=True)
        ch = text_height(it['challenge'], SERIF, 14, cw, 1.15)
        text(s, x, y + 0.45, cw, ch + 0.05, it['challenge'], 14, pal['ink'], SERIF, ls=1.15)
        sy_ = y + 0.45 + ch + 0.3
        rule(s, x, sy_, cw, pal['line'])
        text(s, x, sy_ + 0.15, cw, 0.2, 'Solution', 8.5, pal['accent'], MONO, spc=1.2, upper=True)
        sol = it['solution']
        sh_ = text_height(sol, SANS, 10.5, cw, 1.3)
        assert sy_ + 0.45 + sh_ < 6.9, f'case text overflows: {p["slug"]} {i} ({sy_ + 0.45 + sh_:.2f})'
        text(s, x, sy_ + 0.45, cw, sh_ + 0.05, sol, 10.5, pal['ink'], SANS, ls=1.3)
    return s


for i, p in enumerate(PROJECTS, 1):
    project_slide(p, i)
    if p['slug'] in CASE_STUDIES and p.get('challenges'):
        case_slide(p)

# ======================================================================================
# Toolbox
# ======================================================================================
s, pal = new_slide(section='01 · Craft · Toolbox')
number_label(s, pal, M, 1.0, '01', 'Toolbox')
heading(s, pal, M, 1.3, 9, [('What I build ', False), ('with', True)], 36)
GROUPS = [
    ('Backend', ['Go', 'Laravel', 'PHP', 'PostgreSQL', 'Filament', 'Livewire', 'Laravel Reverb', 'Firebase', 'Supabase']),
    ('Mobile', ['Flutter', 'Android', 'Gemini API', 'Firestore', 'Google Authentication']),
    ('Web', ['Next.js', 'React', 'TypeScript', 'Mapbox', 'Midtrans Payment']),
    ('Cloud and IoT', ['Azure Cloud', 'AWS Cloud', 'Docker', 'VPS Cloud', 'Arduino', 'C++', 'IoT Sensors']),
    ('Tools', ['Linux', 'Bash', 'Figma']),
]
gx = M
gw = (W - 2 * M - 0.35 * 2) / 3
pos = [(0, 0), (1, 0), (2, 0), (0, 1), (1, 1)]
for (name, items), (c, r) in zip(GROUPS, pos):
    x = M + c * (gw + 0.35)
    y = 2.45 + r * 2.3
    rule(s, x, y, gw, pal['line'])
    text(s, x, y + 0.15, gw, 0.25, name, 9.5, pal['accent'], MONO, spc=1.4, upper=True)
    chip_flow(s, pal, x, y + 0.6, gw, items, 9)
x = M + 2 * (gw + 0.35)
y = 2.45 + 2.3
rule(s, x, y, gw, pal['line'])
text(s, x, y + 0.15, gw, 0.25, 'Also', 9.5, pal['accent'], MONO, spc=1.4, upper=True)
text(s, x, y + 0.6, gw, 1.2, 'Clean Architecture and BLoC in Flutter. Role-based access control with Spatie. '
     'Integration with the SatuSehat health API.', 10.5, pal['muted'], SANS, ls=1.3)

# ======================================================================================
# Journey: timeline
# ======================================================================================
s, pal = new_slide(section='02 · Journey')
number_label(s, pal, M, 1.0, '02', 'Journey')
heading(s, pal, M, 1.3, 8, [('Where I have ', False), ('worked', True)], 36)
ry = 2.45
spine_x = M + 2.55
rows = len(EXPERIENCE)
rh = 0.88
vrule(s, spine_x, ry + 0.2, rh * (rows - 1) + 0.04, pal['line'], 1)
for e in EXPERIENCE:
    starts = [norm_ym(r['startDate']) for r in e['roles']]
    ends = [norm_ym(r['endDate']) if r['endDate'] else '9999-99' for r in e['roles']]
    a, b = min(starts), max(ends)
    rng = f'{month_label(a)} – {month_label(None if b == "9999-99" else b)}'
    text(s, M, ry + 0.12, 2.3, 0.3, rng, 9, pal['muted'], MONO, align='r', spc=0.6, upper=True)
    shape(s, MSO_SHAPE.OVAL, spine_x - 0.07, ry + 0.17, 0.14, 0.14, pal['accent'])
    text(s, spine_x + 0.4, ry, 5.2, 0.4, e['company'], 17, pal['ink'], SERIF, spc=-0.3)
    titles = ' · '.join(r['title'] for r in e['roles'])
    text(s, spine_x + 0.4, ry + 0.36, 7.0, 0.3, titles, 10, pal['muted'], SANS)
    text(s, W - M - 3.0, ry + 0.12, 3.0, 0.3, e['location'].split(' · ')[-1] + ' · ' + e['location'].split(',')[0],
         8.5, pal['accent'], MONO, align='r', spc=1, upper=True)
    ry += rh


# ======================================================================================
# Journey: detail slides
# ======================================================================================
def bullets(desc: str):
    return [b.strip() for b in desc.split('•') if b.strip()]


HIGHLIGHT = {'Google Developer Student Club': ('75', 'members mentored')}


def experience_slide(names, title_parts):
    s, pal = new_slide(section='02 · Journey')
    number_label(s, pal, M, 1.0, '02', 'Journey')
    heading(s, pal, M, 1.3, 9, title_parts, 30)
    entries = [e for e in EXPERIENCE if e['company'] in names]
    blocks = []  # (company, [role]) columns
    if len(entries) == 1 and len(entries[0]['roles']) > 1:
        e = entries[0]
        for r in e['roles']:
            blocks.append((e, r))
    else:
        for e in entries:
            blocks.append((e, None))
    n = len(blocks)
    gap = 0.5
    cw = (W - 2 * M - gap * (n - 1)) / n
    if n == 1:
        cw = 6.6
        big, lab = HIGHLIGHT.get(names[0], ('', ''))
        if big:
            text(s, W - M - 4.0, 2.7, 4.0, 1.6, big, 110, pal['accent'], SERIF, align='r', spc=-3)
            text(s, W - M - 4.0, 4.5, 4.0, 0.3, lab, 10, pal['muted'], MONO, align='r', spc=1.4, upper=True)
    for i, (e, only_role) in enumerate(blocks):
        x = M + i * (cw + gap)
        y = 2.3
        rule(s, x, y, cw, pal['accent'], 1.25)
        text(s, x, y + 0.14, cw, 0.2, e['location'], 8.5, pal['muted'], MONO, spc=1, upper=True)
        y += 0.5
        if only_role is None:
            text(s, x, y, cw, 0.4, e['company'], 20, pal['ink'], SERIF, spc=-0.3)
            y += 0.55
        roles = [only_role] if only_role else e['roles']
        for r in roles:
            when = f'{month_label(norm_ym(r["startDate"]))} – {month_label(norm_ym(r["endDate"]) if r["endDate"] else None)}'
            if only_role is not None:
                text(s, x, y, cw, 0.4, r['title'], 20, pal['ink'], SERIF, spc=-0.3)
                y += 0.42
            else:
                text(s, x, y, cw, 0.3, r['title'], 12.5, pal['accent'], SERIF, italic=True)
                y += 0.3
            text(s, x, y, cw, 0.2, f'{r.get("employmentType", "")} · {when}', 8.5, pal['muted'], MONO, spc=0.8, upper=True)
            y += 0.34
            for b in bullets(r['description']):
                bh = text_height(b, SANS, 10.5, cw - 0.25, 1.22)
                rect(s, x, y + 0.06, 0.07, 0.07, pal['accent'])
                text(s, x + 0.25, y, cw - 0.25, bh + 0.05, b, 10.5, pal['ink'], SANS, ls=1.22)
                y += bh + 0.14
            y += 0.12
        assert y < 6.95, f'experience overflow {names} col {i}: {y:.2f}'


experience_slide(['PT Celebes Solusi Digital'], [('Shipping ', False), ('healthcare', True), (' and certification systems', False)])
experience_slide(['PLN IP UPPLTD Selayar'], [('Freelance ', False), ('energy', True), (' systems', False)])
experience_slide(['PT. Rise Lanskap Hortikultura', 'Coder Institute'], [('Internship and ', False), ('leadership', True), (' work', False)])
experience_slide(['Google Developer Student Club'], [('Mentoring ', False), ('backend', True), (' learners', False)])

# ======================================================================================
# Foundations
# ======================================================================================
s, pal = new_slide(dark=True, section='03 · Foundations')
number_label(s, pal, M, 1.0, '03', 'Foundations')
text(s, M, 2.0, 6, 0.3, EDU['level'], 10, pal['muted'], MONO, spc=1.6, upper=True)
text(s, M, 2.45, 7, 1.2, 'Informatics', 54, pal['ink'], SERIF, spc=-1.5)
text(s, M, 3.55, 7, 1.2, [[('Engineering', {'italic': True, 'color': pal['accent']})]], 54, pal['ink'], SERIF, spc=-1.5)
rule(s, M, 4.95, 1.0, pal['accent'], 1.5)
text(s, M, 5.15, 6.5, 0.4, EDU['school'], 20, pal['ink'], SERIF)
text(s, M, 5.65, 6.5, 0.3, f'{EDU["city"]}, {EDU["country"]}   {EDU["start"]} – {EDU["end"]}', 10, pal['muted'], MONO, spc=1.2)
# concentric arches
acx, abase = 10.0, 6.3
for i, r in enumerate((2.3, 1.85, 1.4, 0.95, 0.5)):
    arc = shape(s, MSO_SHAPE.ROUND_2_SAME_RECTANGLE, acx - r, abase - r * 1.9, 2 * r, r * 1.9, None,
                mix(pal['accent'], pal['bg'], [0.25, 0.4, 0.55, 0.75, 1.0][i]), 1)
    arc.adjustments[0] = 0.5
    arc.adjustments[1] = 0.0

# ======================================================================================
# Recognition
# ======================================================================================
s, pal = new_slide(section='04 · Recognition')
number_label(s, pal, M, 1.0, '04', 'Recognition')
heading(s, pal, M, 1.3, 9, [('Competitions and ', False), ('awards', True)], 34)
ry = 2.45
rh = 0.8
for a in ACH:
    rule(s, M, ry, W - 2 * M, pal['line'])
    text(s, M, ry + 0.26, 0.9, 0.3, a['date'], 10, pal['accent'], MONO, spc=1.2)
    text(s, M + 1.0, ry + 0.14, 8.0, 0.35, a['title'], 16, pal['ink'], SERIF, spc=-0.2)
    text(s, M + 1.0, ry + 0.48, 8.0, 0.25, a['description'], 9.5, pal['muted'], SANS)
    rk = a['rank']
    rw = text_width_in(rk, MONO, 9, 1) + 0.4
    b = shape(s, MSO_SHAPE.ROUNDED_RECTANGLE, W - M - rw, ry + 0.24, rw, 0.32, None, pal['accent'], 0.75)
    set_radius(b, 0.5)
    text(s, W - M - rw, ry + 0.24, rw, 0.32, rk, 9, pal['accent'], MONO, align='c', anchor='m', spc=1, upper=True)
    ry += rh
rule(s, M, ry, W - 2 * M, pal['line'])

# ======================================================================================
# Connect
# ======================================================================================
s, pal = new_slide(dark=True, section='05 · Connect')
number_label(s, pal, M, 1.0, '05', 'Connect')
text(s, M, 1.7, 9, 1.0, 'Have something', 60, pal['ink'], SERIF, spc=-1.8, ls=0.95)
text(s, M, 2.85, 9, 1.0, [[('worth ', {}), ('building?', {'italic': True, 'color': pal['accent']})]], 60, pal['ink'], SERIF, spc=-1.8, ls=0.95)
text(s, M, 4.45, 9, 0.5, AUTHOR['email'], 26, pal['accent'], SERIF)
rule(s, M, 5.25, W - 2 * M, pal['line'])
cx = M
colw = (W - 2 * M) / 3
for sc in SOCIALS:
    text(s, cx, 5.45, colw - 0.2, 0.2, sc['label'], 9, pal['muted'], MONO, spc=1.4, upper=True)
    text(s, cx, 5.75, colw - 0.2, 0.3, sc['url'].replace('https://www.', '').replace('https://', '').rstrip('/'), 11, pal['ink'], SANS)
    cx += colw

# ---- Fade transitions between slides -----------------------------------------------------
P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
for sl in prs.slides:
    tr = etree.SubElement(sl._element, f'{{{P}}}transition', spd='med')
    etree.SubElement(tr, f'{{{P}}}fade')

prs.core_properties.title = 'Perdi · Portfolio'
prs.core_properties.author = AUTHOR['name']
prs.save(OUT)
print(f'wrote {OUT} ({len(prs.slides)} slides)')
