"""Identify all source bytes, continuous Greek excerpts and reproducible scan leaves."""
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
parser.add_argument('--pdf',type=Path)
parser.add_argument('--online',action='store_true')
args = parser.parse_args()
root = Path('public/sources')
m = json.loads((root/'manifest.json').read_text())
for row in m['files']:
    b=(root/row['file']).read_bytes()
    assert len(b)==row['bytes'] and hashlib.sha256(b).hexdigest()==row['sha256'],row['file']
chapter=ET.parse(root/'dioptra-grc.xml').find('.//{*}div[@n="34"]')
assert chapter is not None
def tx(e):
    if e.tag.endswith('}note'):
        return ''
    return (e.text or '')+''.join(tx(c)+(c.tail or '') for c in e)
def normal(s):
    return ''.join(c for c in unicodedata.normalize('NFC',s) if c.isalnum())
greek=normal(tx(chapter))
passages=json.loads(subprocess.check_output(['node','--import','tsx','--input-type=module','-e',
    'import {counterPassages} from "./src/counter-content.ts";console.log(JSON.stringify(counterPassages))'],text=True))
for p in passages:
    assert normal(p['greek']) in greek,p['title']
rendered = 0
leaves = []
with tempfile.TemporaryDirectory(prefix='dioptra-counter-source-') as temp:
    temp=Path(temp)
    pdf=args.pdf
    if args.online:
        with urllib.request.urlopen(m['scandataUrl'],timeout=45) as response:
            scan = ET.fromstring(response.read())
        mapping = {int(p.findtext('pageNumber')):int(p.attrib['leafNum'])
            for p in scan.findall('.//pageData/page') if (p.findtext('pageNumber') or '').isdigit()}
        for row in m['counterPages']:
            assert mapping[row['printPage']] == row['archiveLeaf']
            leaves.append({'printPage':row['printPage'],'archiveLeaf':mapping[row['printPage']]})
        with urllib.request.urlopen(m['teiUrl'],timeout=60) as response:
            assert response.read()==(root/'dioptra-grc.xml').read_bytes()
        pdf=temp/'source.pdf'
        with urllib.request.urlopen(m['pdfUrl'],timeout=90) as response:
            pdf.write_bytes(response.read())
    if pdf:
        assert hashlib.sha256(pdf.read_bytes()).hexdigest()==m['pdfSha256']
        for row in m['counterPages']:
            out=temp/f"page-{row['printPage']}"
            subprocess.run(['pdftoppm','-f',str(row['pdfPage']),'-l',str(row['pdfPage']),
                '-scale-to',str(row['scaleTo']),'-jpeg','-jpegopt',f"quality={row['jpegQuality']}",
                '-singlefile',str(pdf),str(out)],check=True)
            assert out.with_suffix('.jpg').read_bytes()==(root/f"schone-{row['printPage']}.jpg").read_bytes()
            rendered+=1
print(json.dumps({'bundledFiles':len(m['files']),'continuousGreekSelections':len(passages),
    'comparison':'NFC letters and digits, punctuation/whitespace omitted; notes excluded',
    'chapter':34,'printedPages':[p['printPage'] for p in m['counterPages']],
    'archiveLeavesChecked':leaves,'pdfRendersReproduced':rendered,'onlineSourceIdentityChecked':args.online,
    'teiCommit':m['teiCommit']},indent=2))
