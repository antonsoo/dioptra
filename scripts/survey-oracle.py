"""Check exported survey geometry with exact rational arithmetic, not app imports."""
import json
import sys
from fractions import Fraction as F

cases = json.load(sys.stdin)
maximum = 0.0
checks = 0

def near(actual, expected):
    global maximum, checks
    error = abs(actual - float(expected))
    maximum = max(maximum, error)
    checks += 1
    assert error < 1e-9, (actual, expected, error)

for row in cases:
    s = row['state']
    # Independent fixed portal exercises, then rationally reconstruct the walk.
    X, Y = {'five': (300, 60), 'two': (240, 120), 'seven': (420, 60)}[s['preset']]
    d, b = F(s['detour']), F(s['baseline'])
    points = [(F(0),F(0)), (F(3,5)*X-F(3,5)*d,F(0)),
              (F(3,5)*X-F(3,5)*d,Y*(F(1,6)-d/1200)),
              (X+100+d,Y*(F(1,6)-d/1200)),
              (X+100+d,Y*(F(2,3)+d/1200)),
              (X+20+d/5,Y*(F(2,3)+d/1200)), (X+20+d/5,F(Y)), (F(X),F(Y))]
    sx = sy = distance = F(0)
    for i, (p,q) in enumerate(zip(points,points[1:])):
        dx,dy=q[0]-p[0],q[1]-p[1]
        assert dx*dy==0
        sx+=dx;sy+=dy;distance+=abs(dx)+abs(dy)
        for key,value in [('dx',dx),('dy',dy),('length',abs(dx)+abs(dy))]:near(row['legs'][i][key],value)
    near(row['x'],sx);near(row['y'],sy);near(row['routeLength'],distance)
    assert (sx,sy)==(X,Y)
    e=F(s['error'],1000)
    eb=0 if s['affected']=='D' else e
    ed=0 if s['affected']=='B' else e
    # The similar triangles give a direction vector (X,Y). The peg perturbation
    # is added perpendicular to each exterior baseline before taking its slope.
    peg_b=(-b,-b*F(Y,X)-eb);peg_d=(X+b,Y+b*F(Y,X)+ed)
    yb=F(X,2)*(-peg_b[1]/b);yd=Y-F(X,2)*(peg_d[1]-Y)/b
    near(row['bPeg']['x'],peg_b[0]);near(row['bPeg']['y'],peg_b[1])
    near(row['dPeg']['x'],peg_d[0]);near(row['dPeg']['y'],peg_d[1])
    near(row['bMiddle']['y'],yb);near(row['dMiddle']['y'],yd);near(row['gap'],yb-yd)
    near(row['targetPegRise'],b*F(Y,X))
    near(row['tunnelLength']**2,X*X+Y*Y)
print(json.dumps({'method':'Exact rational reconstruction of all circuit legs and similar-triangle intersections at the middle station','cases':len(cases),'comparisons':checks,'maximumAbsoluteDiscrepancy':maximum,'tolerance':1e-9,'allPassed':True},indent=2))
