# Audits the built site (run `pnpm build` first): titles/descriptions, headings, canonicals, JSON-LD, images, internal links.
# Usage: python3 scripts/audit-build.py
import os, re, json, sys
from html.parser import HTMLParser
from urllib.parse import urlparse

ROOT = 'dist/client'
pages = {}
for d, _, fs in os.walk(ROOT):
    for f in fs:
        if f.endswith('.html'):
            p = os.path.join(d, f)
            url = '/' + os.path.relpath(p, ROOT).replace('index.html', '').replace('404.html', '404/')
            pages[url] = p

class P(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ''; self.in_title = False
        self.metas = {}; self.links = []; self.heads = []; self.cur = None
        self.imgs = []; self.ld = []; self.in_ld = False; self.ld_buf = ''
        self.hrefs = []; self.ids = set(); self.landmarks = set(); self.lang = None
        self.main_count = 0
    def handle_starttag(self, tag, a):
        a = dict(a)
        if 'id' in a: self.ids.add(a['id'])
        if tag == 'html': self.lang = a.get('lang')
        if tag == 'title': self.in_title = True
        if tag == 'meta':
            k = a.get('name') or a.get('property')
            if k: self.metas.setdefault(k, []).append(a.get('content', ''))
        if tag == 'link': self.links.append(a)
        if re.fullmatch(r'h[1-6]', tag): self.cur = [int(tag[1]), '']
        if tag == 'img': self.imgs.append(a)
        if tag == 'a' and 'href' in a: self.hrefs.append(a['href'])
        if tag == 'script' and a.get('type') == 'application/ld+json': self.in_ld = True; self.ld_buf = ''
        if tag in ('header', 'main', 'footer', 'nav', 'article', 'aside'): self.landmarks.add(tag)
        if tag == 'main': self.main_count += 1
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if self.cur and tag == f'h{self.cur[0]}': self.heads.append(tuple(self.cur)); self.cur = None
        if tag == 'script' and self.in_ld: self.ld.append(self.ld_buf); self.in_ld = False
    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.cur is not None: self.cur[1] += data
        if self.in_ld: self.ld_buf += data

problems = []
titles = {}; descs = {}
parsed = {}
for url, path in sorted(pages.items()):
    html = open(path, encoding='utf8').read()
    p = P(); p.feed(html); parsed[url] = p
    def bad(msg): problems.append(f'{url}: {msg}')
    if p.lang != 'en': bad('html lang')
    t = p.title.strip()
    if len(t) > 60: bad(f'title {len(t)} chars: {t}')
    titles.setdefault(t, []).append(url)
    d = (p.metas.get('description') or [''])[0]
    if not d or len(d) > 160: bad(f'description length {len(d)}')
    descs.setdefault(d, []).append(url)
    h1s = [h for h in p.heads if h[0] == 1]
    if len(h1s) != 1: bad(f'h1 count {len(h1s)}')
    last = 0
    for lvl, txt in p.heads:
        if last and lvl > last + 1: bad(f'heading skip h{last}->h{lvl} ({txt.strip()[:30]})')
        last = lvl
    if p.main_count != 1: bad('main count')
    canon = [l for l in p.links if l.get('rel') == 'canonical']
    if len(canon) != 1 or not canon[0]['href'].endswith('/'): bad(f'canonical {canon}')
    robots = (p.metas.get('robots') or [''])[0]
    if not any(l.get('type') == 'application/rss+xml' for l in p.links): bad('rss link')
    for im in p.imgs:
        if 'alt' not in im: bad(f'img without alt {im.get("src")}')
        if im.get('src', '').startswith('http') and 'ytimg' not in im['src']: bad(f'remote img {im["src"]}')
        if not (im.get('width') and im.get('height')) and 'data:' not in im.get('src', ''): bad(f'img without dimensions {im.get("src")}')
    for raw in p.ld:
        try:
            j = json.loads(raw)
            assert j['@context'] == 'https://schema.org'
            assert '<' not in raw
            if 'view' in raw.lower() and 'interaction' in raw.lower(): bad('view count in JSON-LD')
        except Exception as e:
            bad(f'bad JSON-LD: {e}')
    if 'og:image' not in p.metas: bad('no og:image')
    if '/404/' != url and robots.startswith('noindex'): print('noindex:', url)

for t, us in titles.items():
    if len(us) > 1: problems.append(f'duplicate title "{t}": {us}')
for dsc, us in descs.items():
    if len(us) > 1: problems.append(f'duplicate description: {us}')

# internal link check
for url, p in parsed.items():
    for h in p.hrefs:
        u = urlparse(h)
        if u.scheme or h.startswith('mailto:') or h.startswith('#') or h.startswith('data:'): continue
        target = u.path
        if target.startswith('/'):
            exists = target in pages or os.path.exists(os.path.join(ROOT, target.lstrip('/')))
            if not exists: problems.append(f'{url}: broken link {h}')
            elif u.fragment and target in parsed and u.fragment not in parsed[target].ids:
                problems.append(f'{url}: missing anchor {h}')

print(f'{len(pages)} pages audited')
print('\n'.join(problems) if problems else 'NO PROBLEMS')
