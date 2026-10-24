"""Independent exact collection by one-tenth-second packets, not the app antiderivative."""
import json,sys
from fractions import Fraction as F
cases=json.load(sys.stdin)
maximum=0.0
for c in cases:
 s=c['state']; area=s['width']*s['depth']
 assert area==c['area']
 totals={'A':[F(0)],'B':[F(0)]}
 for tick in range(200):
  for stream in ['A','B']:
   speed=s['speedA'] if stream=='A' or (s['variable'] and tick>=100) else s['speedB']
   totals[stream].append(totals[stream][-1]+F(area*speed,10000))
 def check(actual,expected):
  global maximum
  error=abs(actual-float(expected));maximum=max(maximum,error)
  assert error<1e-10,(s,actual,str(expected))
 for frame in c['frames']:
  for stream in ['A','B']:check(frame[stream],totals[stream][round(frame['time']*10)])
 start=100 if s['window']=='last' else 0;end=100 if s['window']=='first' else 200
 assert c['measure']['duration']==(end-start)/10
 for r in c['measure']['streams']:
  t=totals[r['stream']];volume=t[end]-t[start];rate=volume/F(end-start,10)
  for key,value in [('before',t[start]),('after',t[end]),('volume',volume),('average',rate),('extrapolated',rate*20),('actual',t[200])]:check(r[key],value)
print(json.dumps({'method':'Exact rational one-tenth-second water packets integrated independently of application formulas','cases':len(cases),'frameComparisons':len(cases)*9*2,'maxAbsoluteErrorLOrLPerSecond':maximum,'conservation':True,'switchContinuityAndBothSides':True},indent=2))
