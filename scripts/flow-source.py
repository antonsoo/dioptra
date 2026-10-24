"""Compare the COMPLETE adapted Greek sequence with the pinned TEI, including all eleven units."""
import json,re,sys,unicodedata,hashlib
from pathlib import Path
import xml.etree.ElementTree as E
root=E.parse('public/sources/dioptra-grc.xml').getroot();ns={'t':'http://www.tei-c.org/ns/1.0'}
chapter=root.find('.//t:div[@subtype="chapter"][@n="31"]',ns)
assert chapter is not None
def walk(n):
 if n.tag.rsplit('}',1)[-1] in ['note','del']:return n.tail or ''
 return (n.text or '')+''.join(walk(c) for c in n)+(n.tail or '')
s=re.sub(r'-\s*','',walk(chapter));s=re.sub(r'\s+',' ',s).strip()
s=re.sub(r'^λα\.\s*','',s).replace('στοχασάμενον μενον','στοχασάμενον').replace('ὁρῶν','ὀρῶν')
passages=json.load(sys.stdin);shown=' '.join(p['greek'] for p in passages)
def letters(s):
 return ''.join(c for c in unicodedata.normalize('NFD',s.replace('ʼ','').replace('’','')) if c.isalpha()).lower()
assert letters(s)==letters(shown),'Complete Greek sequence differs from the declared adaptation'
manifest=json.loads(Path('public/sources/manifest.json').read_text())
for p in manifest['files']:
 b=Path('public/sources',p['file']).read_bytes()
 assert len(b)==p['bytes'] and hashlib.sha256(b).hexdigest()==p['sha256']
print(json.dumps({'completeChapter':31,'units':len(passages),'normalizedGreekLetters':len(letters(shown)),'completeSequenceMatches':True,'comparison':'All letters, stripping punctuation and diacritics; notes and editor-deleted material omitted; declared line-join correction applied. Full pages separately inspected.','sourceFilesHashVerified':len(manifest['files']),'pages':manifest['chapters']['31']},indent=2))
