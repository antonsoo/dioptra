"""Verify retained primary-source identities and Greek excerpt continuity."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import unicodedata
import urllib.request
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser()
parser.add_argument('--online', action='store_true')
parser.add_argument('--pdf', type=Path)
args = parser.parse_args()
source = Path('public/sources')
manifest = json.loads((source/'manifest.json').read_text())
digest = lambda b: hashlib.sha256(b).hexdigest()
for row in manifest['files']:
    data = (source/row['file']).read_bytes()
    assert digest(data) == row['sha256'], row['file']
    assert len(data) == row['bytes'], row['file']
chapter = ET.parse(source/'dioptra-grc.xml').find('.//{*}div[@n="15"]')
assert chapter is not None

def text_of(element):
    if element.tag.endswith('}note'):
        return ''
    text = element.text or ''
    for child in element:
        text += text_of(child) + (child.tail or '')
    return text

def normalized(text):
    # Check letters/accents and sequence, separately from punctuation, editorial
    # brackets, line wrapping and the digital edition's delta-shaped angle sign.
    return ''.join(c for c in unicodedata.normalize('NFC', text).replace('∠', 'Δ').replace('ʼ', '').replace('’', '') if c.isalnum())

greek = normalized(text_of(chapter))
passages = json.loads(subprocess.check_output(['node','--import','tsx','--input-type=module','-e',
    'import {passages} from "./src/content.ts"; console.log(JSON.stringify(passages))'],text=True))
for p in passages:
    assert normalized(p['greek']) in greek, p['title']
report = {'bundledFilesVerified':len(manifest['files']), 'greekPassages':len(passages),
          'transcriptionCheck':'Complete excerpt letter/diacritic sequence within chapter 15; NFC; whitespace/punctuation/brackets ignored; delta glyph normalized',
          'teiCommit':manifest['teiCommit'], 'onlineChecked':False,'pdfRendersChecked':False}
with tempfile.TemporaryDirectory(prefix='dioptra-source-') as temp:
    temp = Path(temp)
    pdf = args.pdf
    if args.online:
        with urllib.request.urlopen(manifest['teiUrl'],timeout=60) as r:
            assert r.read() == (source/'dioptra-grc.xml').read_bytes()
        pdf = temp/'schone.pdf'
        with urllib.request.urlopen(manifest['pdfUrl'],timeout=90) as r:
            pdf.write_bytes(r.read())
        report['onlineChecked'] = True
    if pdf:
        assert digest(pdf.read_bytes()) == manifest['pdfSha256']
        for page, printed in zip(manifest['pdfPages'],manifest['printPages']):
            out=temp/f'page-{printed}'
            subprocess.run(['pdftoppm','-f',str(page),'-l',str(page),'-scale-to',
                '1700' if printed==238 else '1550','-jpeg','-jpegopt','quality=90',
                '-singlefile',str(pdf),str(out)],check=True)
            assert out.with_suffix('.jpg').read_bytes() == (source/f'schone-{printed}.jpg').read_bytes(),printed
        report['pdfRendersChecked'] = True
print(json.dumps(report,indent=2))
