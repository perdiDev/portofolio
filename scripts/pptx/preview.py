#!/usr/bin/env python3
"""Rough raster preview of the deck (no Office needed): shapes, pictures and text only.
Usage: preview.py deck.pptx outdir [slide numbers...]. Fonts are Liberation stand-ins, so widths are approximate."""
import io, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from pptx import Presentation
from pptx.util import Emu

F = '/usr/share/fonts/liberation/'
FONTS = {('Georgia', 0): 'LiberationSerif-Regular', ('Georgia', 1): 'LiberationSerif-Italic',
         ('Arial', 0): 'LiberationSans-Regular', ('Arial', 1): 'LiberationSans-Italic',
         ('Consolas', 0): 'LiberationMono-Regular', ('Consolas', 1): 'LiberationMono-Italic'}
PX = 110  # px per inch


def font(name, size, italic):
    return ImageFont.truetype(F + FONTS[(name, int(bool(italic)))] + '.ttf', max(6, int(size / 72 * PX * (1.1 if name == 'Georgia' else 1.0))))


def run(deck, out, only):
    prs = Presentation(deck)
    out = Path(out); out.mkdir(parents=True, exist_ok=True)
    for n, sl in enumerate(prs.slides, 1):
        if only and n not in only: continue
        W, H = int(prs.slide_width / 914400 * PX), int(prs.slide_height / 914400 * PX)
        bg = sl.background.fill.fore_color.rgb
        im = Image.new('RGB', (W, H), '#' + str(bg)); d = ImageDraw.Draw(im, 'RGBA')
        for sh in sl.shapes:
            x, y, w, h = [int(v / 914400 * PX) for v in (sh.left, sh.top, sh.width, sh.height)]
            if sh.shape_type == 13:
                pic = Image.open(io.BytesIO(sh.image.blob)).convert('RGBA')
                iw, ih = pic.size
                pic = pic.crop((int(iw * sh.crop_left), int(ih * sh.crop_top), int(iw * (1 - sh.crop_right)), int(ih * (1 - sh.crop_bottom)))).resize((max(1, w), max(1, h)))
                im.paste(pic, (x, y), pic)
            elif sh.shape_type == 9 or sh.__class__.__name__ == 'Connector':
                d.line((x, y, x + w, y + h), fill='#' + str(sh.line.color.rgb), width=max(1, int(sh.line.width / 12700 * PX / 72)))
            elif sh.has_text_frame and sh.shape_type == 17:
                para_y = y
                for p in sh.text_frame.paragraphs:
                    runs = [r for r in p.runs if r.text]
                    if not runs: continue
                    size = max(r.font.size.pt for r in runs)
                    fs = [font(r.font.name, r.font.size.pt, r.font.italic) for r in runs]
                    # greedy wrap by words across runs
                    words = [(wd, r, f) for r, f in zip(runs, fs) for wd in r.text.replace('\n', ' ').split(' ')]
                    lines, cur, cw = [], [], 0
                    for wd, r, f in words:
                        ww = f.getlength(wd + ' ')
                        if cur and cw + ww > w: lines.append(cur); cur, cw = [], 0
                        cur.append((wd, r, f)); cw += ww
                    lines.append(cur)
                    lh = size * 1.22 * (p.line_spacing or 1) / 72 * PX
                    for ln in lines:
                        tw = sum(f.getlength(wd + ' ') for wd, r, f in ln)
                        cx = x + (w - tw) / 2 if p.alignment == 2 else x + w - tw if p.alignment == 3 else x
                        for wd, r, f in ln:
                            t = wd.upper() if False else wd
                            d.text((cx, para_y), t, font=f, fill='#' + str(r.font.color.rgb)); cx += f.getlength(wd + ' ')
                        para_y += lh
            else:
                fill = None
                try:
                    if sh.fill.type == 1: fill = '#' + str(sh.fill.fore_color.rgb)
                except Exception: pass
                line = None
                try:
                    if sh.line.fill.type == 1: line = '#' + str(sh.line.color.rgb)
                except Exception: pass
                nm = sh.auto_shape_type.name if sh.shape_type == 1 else ''
                if 'OVAL' in nm: d.ellipse((x, y, x + w, y + h), fill=fill, outline=line)
                elif 'ROUND_2' in nm:
                    r = w // 2; d.pieslice((x, y, x + w, y + 2 * r), 180, 360, outline=line, fill=fill); d.line((x, y + r, x, y + h), fill=line); d.line((x + w, y + r, x + w, y + h), fill=line)
                elif 'ROUNDED' in nm: d.rounded_rectangle((x, y, x + w, y + h), radius=min(h, w) // 2 if h < 40 else 6, fill=fill, outline=line)
                else: d.rectangle((x, y, x + w, y + h), fill=fill, outline=line)
        im.save(out / f'slide-{n:02d}.png')


if __name__ == '__main__':
    run(sys.argv[1], sys.argv[2], {int(a) for a in sys.argv[3:]})
