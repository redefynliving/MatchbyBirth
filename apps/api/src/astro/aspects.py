from typing import Dict, List

from astro.config import ASPECT_ANGLES, DEFAULT_ORBS, DEFAULT_WEIGHTS


def _circular_diff(a_deg: float, b_deg: float) -> float:
    d = abs((a_deg - b_deg) % 360.0)
    return d if d <= 180.0 else 360.0 - d


def compute_aspects(
    positions: Dict[str, float],
    aspects: List[str] = None,
    orbs: Dict[str, float] = None,
    weights: Dict[str, float] = None,
) -> List[Dict]:
    """Compute aspects between named bodies.

    positions: {name: longitude_deg}
    aspects: list of aspect names to check (defaults to major Ptolemaic aspects)
    orbs: per-aspect orb degrees
    weights: per-aspect weight for normalized strength

    Returns a list of dicts:
      {a: nameA, b: nameB, aspect: name, angle: angle_deg, diff: actual_diff_deg, orb: orb_deg, strength: 0..1}
    """
    if aspects is None:
        aspects = list(ASPECT_ANGLES.keys())
    if orbs is None:
        orbs = DEFAULT_ORBS
    if weights is None:
        weights = DEFAULT_WEIGHTS

    names = list(positions.keys())
    longs = [float(positions[n]) % 360.0 for n in names]

    results = []
    n = len(names)
    for i in range(n):
        for j in range(i + 1, n):
            a = longs[i]
            b = longs[j]
            diff = _circular_diff(a, b)
            for asp in aspects:
                angle = ASPECT_ANGLES[asp]
                orb = orbs.get(asp, 0.0)
                # minimal distance from diff to angle considering symmetry across 360
                d = abs(diff - angle)
                if d > 180.0:
                    d = 360.0 - d
                within = d <= orb + 1e-12
                strength = 0.0
                if orb > 0:
                    rel = max(0.0, 1.0 - (d / orb))
                    # Return normalized strength in the documented 0..1 range.
                    strength = rel
                if within:
                    results.append({
                        'a': names[i],
                        'b': names[j],
                        'aspect': asp,
                        'angle': angle,
                        'diff': diff,
                        'orb_diff': d,
                        'orb': orb,
                        'strength': round(float(strength), 6)
                    })
    # sort by strength desc
    results.sort(key=lambda x: x['strength'], reverse=True)
    return results
