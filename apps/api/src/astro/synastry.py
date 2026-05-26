"""Synastry scoring module for MatchByBirth.

Public API:
- compute_synastry(chartA: Dict[name->lon], chartB: Dict[name->lon], aspects=None, orbs=None, weights=None)
    -> dict with keys: aspects (list), raw_score (float), normalized_score (0..100)

Implementation notes:
- Reuses compute_aspects by prefixing names (A_:B_) and filtering cross-chart pairs.
- Strengths from compute_aspects already incorporate aspect weights; we sum them and normalize by sum of per-pair max strengths.
"""
from typing import Dict, List
from astro.aspects import compute_aspects
from astro.config import DEFAULT_WEIGHTS, DEFAULT_ORBS, ASPECT_ANGLES


def compute_synastry(chartA: Dict[str, float], chartB: Dict[str, float], aspects: List[str] = None, orbs: Dict[str, float] = None, weights: Dict[str, float] = None) -> Dict:
    # prepare prefixed positions
    prefA = {f"A_{k}": float(v) % 360.0 for k, v in chartA.items()}
    prefB = {f"B_{k}": float(v) % 360.0 for k, v in chartB.items()}
    combined = {**prefA, **prefB}

    # default aspects / orbs / weights
    if aspects is None:
        aspects = list(ASPECT_ANGLES.keys())
    if orbs is None:
        orbs = DEFAULT_ORBS
    if weights is None:
        weights = DEFAULT_WEIGHTS

    asp_list = compute_aspects(combined, aspects=aspects, orbs=orbs, weights=weights)

    # filter to cross-chart only
    cross = [a for a in asp_list if (a['a'].startswith('A_') and a['b'].startswith('B_')) or (a['a'].startswith('B_') and a['b'].startswith('A_'))]

    raw_score = sum(item.get('strength', 0.0) for item in cross)

    pairs = max(1, len(chartA) * len(chartB))

    # compute per-pair max possible strength: sum of weights for aspects that have a non-zero orb
    per_pair_max = 0.0
    for asp in aspects:
        orb_val = orbs.get(asp, 0.0)
        if orb_val and orb_val > 0.0:
            per_pair_max += float(weights.get(asp, 1.0))

    total_max_possible = pairs * per_pair_max if per_pair_max > 0 else 0.0

    normalized = (raw_score / total_max_possible) * 100.0 if total_max_possible > 0.0 else 0.0

    return {
        'aspects': cross,
        'raw_score': round(float(raw_score), 6),
        'normalized_score': round(float(normalized), 4)
    }


if __name__ == '__main__':
    # tiny smoke
    a = {'Sun': 0.0, 'Moon': 90.0}
    b = {'Sun': 0.0, 'Moon': 270.0}
    print(compute_synastry(a, b))
