"""Inspect native browser downloads, embedded byte identities and printed bounds."""
import argparse
import base64
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import tempfile
import unicodedata
import xml.etree.ElementTree as ET

parser=argparse.ArgumentParser()
parser.add_argument('directory',type=Path)
a=parser.parse_args()
root=a.directory
sha=lambda b:hashlib.sha256(b).hexdigest()
manifest=json.loads(Path('public/sources/frontinus/manifest.json').read_text())
expected_images={r['sha256']:r['path'] for r in manifest['files']}
expected_fonts={sha(p.read_bytes()):p.name for p in Path('public/fonts').iterdir() if p.suffix in ['.ttf','.woff2']}

class Reading(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images=[]
        self.scripts=0
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='img':self.images.append(attrs.get('src',''))
        if tag=='script':self.scripts+=1

rows=[]
for folder in sorted(root.glob('*-*')):
    if not folder.is_dir():continue
    file=folder/'reading-online.html'
    text=file.read_text()
    parsed=Reading();parsed.feed(text)
    assert parsed.scripts==0
    assert len(parsed.images)==6
    images={sha(base64.b64decode(s.split(',',1)[1])) for s in parsed.images}
    assert images==set(expected_images)
    font_blobs=re.findall(r'data:font/(?:ttf|woff2);base64,([A-Za-z0-9+/=]+)',text)
    assert len(font_blobs)==3
    assert {sha(base64.b64decode(s)) for s in font_blobs}==set(expected_fonts)
    assert text.count('<article class="reading">')==9
    assert 'SIL OPEN FONT LICENSE' in text
    assert 'Permission is hereby granted' in text
    assert (folder/'reading-offline.html').read_bytes()==file.read_bytes()
    svg=ET.parse(folder/'openings.svg').getroot()
    assert svg.tag=='{http://www.w3.org/2000/svg}svg'
    assert 'Permission is hereby granted' in ''.join(svg.itertext())
    circles=svg.findall('{*}circle')
    assert len(circles)==2
    assert float(circles[1].attrib['r'])==2*float(circles[0].attrib['r'])
    rows.append({'configuration':folder.name,'htmlSha256':sha(file.read_bytes()),'images':len(images),'originalFonts':len(font_blobs),'scriptFree':True,'onlineOfflineIdentical':True,'svgNamespaceAndLicense':True})
assert len(rows)==4
assert len({r['htmlSha256']for r in rows})==1

pdf=root/'chromium-1440/reading.pdf'
passages=json.loads(subprocess.check_output(['node','--import','tsx','--input-type=module','-e','import {calixPassages} from "./src/calix-content.ts";console.log(JSON.stringify(calixPassages))'],text=True))
norm=lambda s:re.sub(r'\s+','',unicodedata.normalize('NFKC',s))
pdf_text=norm(subprocess.check_output(['pdftotext','-layout',str(pdf),'-'],text=True))
for p in passages:
    for field in ['latin','english','note']:
        assert norm(p[field]) in pdf_text,(p['title'],field)
    for word in p['words']:
        for field in ['word','gloss','note']:assert norm(word[field]) in pdf_text,(p['title'],word['word'],field)
bbox=ET.fromstring(subprocess.check_output(['pdftotext','-bbox',str(pdf),'-']))
pages=bbox.findall('.//{*}page')
words=0
for page in pages:
    for word in page.findall('{*}word'):
        assert 0<=float(word.attrib['xMin'])<=float(word.attrib['xMax'])<=float(page.attrib['width'])
        assert 0<=float(word.attrib['yMin'])<=float(word.attrib['yMax'])<=float(page.attrib['height'])
        words+=1
with tempfile.TemporaryDirectory(prefix='calix-pdf-images-')as tmp:
    subprocess.run(['pdfimages','-j',str(pdf),str(Path(tmp)/'image')],check=True)
    recovered={sha(p.read_bytes())for p in Path(tmp).glob('*.jpg')}
    assert recovered==set(expected_images)
print(json.dumps({'configurations':rows,'pdf':{'sha256':sha(pdf.read_bytes()),'pages':len(pages),'textWordsWithinPageBounds':words,'completeReadingsAndWordNotes':9,'originalJpegsRecoveredExactly':len(recovered)},'scope':'Checks native files created by the browser workflow. Source text correctness additionally requires comparison with the printed witness.'},indent=2))
