"""Weight tuning script for synastry scoring.

Synthesizes 3 archetypes (Harmonious, Tension, Neutral), computes current normalized scores,
calculates a multiplier to scale DEFAULT_WEIGHTS so Harmonious hits target (80), and writes
updated weights back to apps/api/src/astro/config.py.

This is a simple heuristic calibrator — fine-tune manually after reviewing results.
"""
import json
from _bootstrap_path import *
from astro.aspects import compute_aspects
from astro.synastry import compute_synastry
from astro.config import DEFAULT_ORBS, ASPECT_ANGLES, DEFAULT_WEIGHTS


def synthesize_archetypes():
    # Chart A baseline
    A = {
        'Sun': 0.0,
        'Moon': 30.0,
        'Mercury': 60.0,
        'Venus': 120.0,
        'Mars': 150.0,
        'Jupiter': 210.0,
        'Saturn': 270.0,
    }
    # Harmonious: B placed to create many conjunctions/trines/sextiles with A
    B_harm = {k: (v + 0.0) % 360.0 for k, v in A.items()}  # lots of conjunctions

    # Tension: B placed at square/opposition offsets
    B_tens = {k: (v + 90.0) % 360.0 for k, v in A.items()}  # many squares

    # Neutral: B placed to avoid major aspects (offset by 17 deg)
    B_neut = {k: (v + 17.0 + i*5.0) % 360.0 for i, (k, v) in enumerate(A.items())}

    return (A, B_harm, B_tens, B_neut)


def compute_scores(A, B_harm, B_tens, B_neut, weights=None):
    out_h = compute_synastry(A, B_harm, aspects=list(ASPECT_ANGLES.keys()), orbs=DEFAULT_ORBS, weights=weights)
    out_t = compute_synastry(A, B_tens, aspects=list(ASPECT_ANGLES.keys()), orbs=DEFAULT_ORBS, weights=weights)
    out_n = compute_synastry(A, B_neut, aspects=list(ASPECT_ANGLES.keys()), orbs=DEFAULT_ORBS, weights=weights)
    return out_h, out_t, out_n


def scale_weights(weights, multiplier):
    return {k: round(float(v) * multiplier, 4) for k, v in weights.items()}


def main():
    A, B_harm, B_tens, B_neut = synthesize_archetypes()
    print("Baseline DEFAULT_WEIGHTS:", DEFAULT_WEIGHTS)
    h, t, n = compute_scores(A, B_harm, B_tens, B_neut, weights=DEFAULT_WEIGHTS)
    print("Before tuning: Harmonious", h['normalized_score'], "Tension", t['normalized_score'], "Neutral", n['normalized_score'])

    target_harmonious = 80.0
    current_h = h['normalized_score']
    if current_h <= 0:
        print("Current harmonious score <= 0, aborting tuning")
        return
    multiplier = target_harmonious / current_h
    print("Computed multiplier:", multiplier)

    new_weights = scale_weights(DEFAULT_WEIGHTS, multiplier)
    print("New weights:", new_weights)

    # Update config.py by writing a new file
    cfg_path = 'apps/api/src/astro/config.py'
    tpl = f"""# Aspect configuration and defaults for MatchByBirth (AUTO-TUNED)\n\nASPECT_ANGLES = {ASPECT_ANGLES}\n\n# Default orbs (degrees)\nDEFAULT_ORBS = {DEFAULT_ORBS}\n\n# Tuned weights used for normalized strength scoring\nDEFAULT_WEIGHTS = {new_weights}\n\n# Mode presets\nMODES = {{\n    'strict': {{k: max(0.0, v - 2.0) for k, v in DEFAULT_ORBS.items()}},\n    'standard': DEFAULT_ORBS,\n    'loose': {{k: v + 2.0 for k, v in DEFAULT_ORBS.items()}},\n}}\n"""
    with open(cfg_path, 'w') as f:
        f.write(tpl)
    print(f"Wrote tuned config to {cfg_path}")

    # Recompute scores with new weights
    from importlib import reload
    import astro.config as ac
    reload(ac)
    from astro.synastry import compute_synastry as cs
    h2, t2, n2 = compute_scores(A, B_harm, B_tens, B_neut, weights=ac.DEFAULT_WEIGHTS)
    print("After tuning: Harmonious", h2['normalized_score'], "Tension", t2['normalized_score'], "Neutral", n2['normalized_score'])

    # Save a small report
    report = {
        'before': {'harm': h['normalized_score'], 'tens': t['normalized_score'], 'neut': n['normalized_score']},
        'after': {'harm': h2['normalized_score'], 'tens': t2['normalized_score'], 'neut': n2['normalized_score']},
        'new_weights': ac.DEFAULT_WEIGHTS,
    }
    with open('/tmp/synastry_tune_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    print('Report saved to /tmp/synastry_tune_report.json')

if __name__ == '__main__':
    main()
