"""Iterative weight optimizer for synastry scoring (binary-scaling on all aspects).

This script scales DEFAULT_WEIGHTS by a single multiplier to reach a target harmonious
normalized score for the synthesized "harmonious" archetype.

It writes the tuned weights to apps/api/src/astro/config.py but also verifies results by
calling compute_synastry with the new weights directly (no import race).
"""
import json
from _bootstrap_path import *
from astro.synastry import compute_synastry
from astro.config import DEFAULT_ORBS, ASPECT_ANGLES, DEFAULT_WEIGHTS


def synthesize_archetypes():
    A = {
        'Sun': 0.0,
        'Moon': 30.0,
        'Mercury': 60.0,
        'Venus': 120.0,
        'Mars': 150.0,
        'Jupiter': 210.0,
        'Saturn': 270.0,
    }
    B_harm = {k: (v + 0.0) % 360.0 for k, v in A.items()}
    B_tens = {k: (v + 90.0) % 360.0 for k, v in A.items()}
    B_neut = {k: (v + 17.0 + i*5.0) % 360.0 for i, (k, v) in enumerate(A.items())}
    return (A, B_harm, B_tens, B_neut)


def score_with_weights(A, B_harm, weights):
    out = compute_synastry(A, B_harm, aspects=list(ASPECT_ANGLES.keys()), orbs=DEFAULT_ORBS, weights=weights)
    return out['normalized_score']


def scale_weights(weights, multiplier):
    return {k: round(float(v) * multiplier, 6) for k, v in weights.items()}


def find_multiplier(target=80.0, tol=0.5, max_iter=40):
    A, B_harm, _, _ = synthesize_archetypes()
    lo = 0.01
    hi = 100.0
    best = None
    for i in range(max_iter):
        mid = (lo + hi) / 2.0
        candidate = scale_weights(DEFAULT_WEIGHTS, mid)
        score = score_with_weights(A, B_harm, candidate)
        # print progress
        print(f"iter {i}: mult={mid:.6f} score={score:.4f}")
        if abs(score - target) <= tol:
            best = (mid, score)
            break
        if score < target:
            lo = mid
        else:
            hi = mid
        best = (mid, score)
    return best


def write_config(new_weights):
    cfg_path = 'apps/api/src/astro/config.py'
    tpl = f"""# Aspect configuration and defaults for MatchByBirth (AUTO-TUNED)\n\nASPECT_ANGLES = {ASPECT_ANGLES}\n\n# Default orbs (degrees)\nDEFAULT_ORBS = {DEFAULT_ORBS}\n\n# Tuned weights used for normalized strength scoring\nDEFAULT_WEIGHTS = {new_weights}\n\n# Mode presets\nMODES = {{\n    'strict': {{k: max(0.0, v - 2.0) for k, v in DEFAULT_ORBS.items()}},\n    'standard': DEFAULT_ORBS,\n    'loose': {{k: v + 2.0 for k, v in DEFAULT_ORBS.items()}},\n}}\n"""
    with open(cfg_path, 'w') as f:
        f.write(tpl)
    print(f"Wrote tuned config to {cfg_path}")


def main():
    target = 80.0
    tol = 0.5
    print('Starting multiplier search to hit target harmonious score', target)
    res = find_multiplier(target=target, tol=tol)
    if not res:
        print('No suitable multiplier found')
        return
    mult, score = res
    print('Best multiplier', mult, 'score', score)
    new_weights = scale_weights(DEFAULT_WEIGHTS, mult)
    write_config(new_weights)
    # verify by directly calling compute_synastry with the new weights
    A, B_harm, _, _ = synthesize_archetypes()
    verified = compute_synastry(A, B_harm, aspects=list(ASPECT_ANGLES.keys()), orbs=DEFAULT_ORBS, weights=new_weights)
    report = {
        'multiplier': mult,
        'verified_score': verified['normalized_score'],
        'new_weights': new_weights
    }
    with open('/tmp/synastry_tune_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    print('Tuning complete. Report written to /tmp/synastry_tune_report.json')

if __name__ == '__main__':
    main()
