"""Reproduce six full source renders from the pinned original PDF."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import urllib.request

p=argparse.ArgumentParser()
p.add_argument('--pdf',type=Path)
p.add_argument('--online',action='store_true')
a=p.parse_args()
root=Path('public/sources/frontinus')
m=json.loads((root/'manifest.json').read_text())
for row in m['files']:
    data=(Path('public')/row['path']).read_bytes()
    assert len(data)==row['bytes']
    assert hashlib.sha256(data).hexdigest()==row['sha256'],row['path']
rendered=0
with tempfile.TemporaryDirectory(prefix='frontinus-source-') as tmp:
    tmp=Path(tmp)
    pdf=a.pdf
    if a.online:
        pdf=tmp/'source.pdf'
        with urllib.request.urlopen(m['original_pdf'],timeout=90) as response:
            pdf.write_bytes(response.read())
    if pdf:
        assert hashlib.sha256(pdf.read_bytes()).hexdigest()==m['original_pdf_sha256']
        for name,page in m['pdf_pages'].items():
            out=tmp/name.removesuffix('.jpg')
            subprocess.run(['pdftoppm','-f',str(page),'-l',str(page),'-singlefile','-scale-to','1900','-jpeg','-jpegopt','quality=88',str(pdf),str(out)],check=True)
            assert out.with_suffix('.jpg').read_bytes()==(root/name).read_bytes(),name
            rendered+=1
print(json.dumps({'source':m['source'],'files':len(m['files']),'pdfRendersReproduced':rendered,'onlinePdfIdentityChecked':a.online,'scope':'Exact full-page render identities. Latin excerpts require review against the retained printed witness; no OCR identity is claimed.'},indent=2))
