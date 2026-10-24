"""Check dial states by exact rational wheel/shaft counts, without app imports."""
from fractions import Fraction as Q
import json
import math
import sys

cases = checks = 0
for line in sys.stdin:
    row = json.loads(line)
    s, r = row['state'], row['result']
    w, a = s['turns'], s['trial']
    input_turns = Q(w, 8)
    output = input_turns / a
    coarse_turns = output / 30
    first = (output % 1) * 30
    second = (coarse_turns % 1) * 30
    circuits = coarse_turns.numerator // coarse_turns.denominator
    reconstructed = int(second) * 30 + first
    scale = Q(8*a, 3) if s['calibrated'] else Q(80)
    expected = {
        'peg': w % 8, 'firstTick': first, 'firstAngle': first*12,
        'secondTick': second, 'secondAngle': second*12,
        'coarse': int(second), 'wraps': circuits,
        'graduation': scale, 'indicated': reconstructed*scale,
        'ledger': w*10, 'actualRemainder': (coarse_turns % 1)*8*a*30*10,
        'period': 8*a*30, 'firstPeriod':8*a,
        'errorPercent': 0 if s['calibrated'] else (Q(30,a)-1)*100,
    }
    for key, value in expected.items():
        assert math.isclose(r[key], float(value), rel_tol=2e-12, abs_tol=2e-9), (s,key,r[key],str(value))
        checks += 1
    if s['calibrated']:
        assert reconstructed*scale + circuits*8*a*30*10 == w*10
        checks += 1
    cases += 1
assert cases > 6000, cases
print(json.dumps({'cases':cases,'checks':checks,'method':'Python Fraction; independent shaft revolutions, modulo phases and reconstruction from completed coarse divisions','passed':True},indent=2))
