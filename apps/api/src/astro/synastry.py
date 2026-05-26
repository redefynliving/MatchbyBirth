"""Synastry scoring module for MatchByBirth.

Public API:
- compute_synastry(chartA: Dict[name->lon], chartB: Dict[name->lon], aspects=None, orbs=None, weights=None)
    -> dict with keys: aspects (list), raw_score (float), normalized_score (0..100)

Implementation notes:
- Reuses compute_aspects by prefixing names (A_:B_) and filtering cross-chart pairs.
- Strengths from compute_aspects already incorporate aspect weights; we sum them and normalize by max possible.
"""
from typing import Dict, List
from astro.aspects import compute_aspects
from astro.config import DEFAULT_WEIGHTS


def compute_synastry(chartA: Dict[str, float], chartB: Dict[str, float], aspects=None, orbs=None, weights=None) -> Dict:
    # prepare prefixed positions
    prefA = {f"A_{k}": float(v) % 360.0 for k, v in chartA.items()}
    prefB = {f"B_{k}": float(v) % 360.0 for k, v in chartB.items()}
    combined = {**prefA, **prefB}

    asp_list = compute_aspects(combined, aspects=aspects, orbs=orbs, weights=weights)

    # filter to cross-chart only
    cross = [a for a in asp_list if (a['a'].startswith('A_') and a['b'].startswith('B_')) or (a['a'].startswith('B_') and a['b'].startswith('A_'))]

    raw_score = sum(item.get('strength', 0.0) for item in cross)

    pairs = max(1, len(chartA) * len(chartB))
    max_weight = max(DEFAULT_WEIGHTS.values()) if DEFAULT_WEIGHTS else 1.0
    max_possible = pairs * max_weight
    normalized = (raw_score / max_possible) * 100.0

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
