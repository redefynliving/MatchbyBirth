"""Per-aspect optimizer for synastry weights.

Algorithm (coordinate descent-ish):
- Start from DEFAULT_WEIGHTS.
- For each aspect in turn, try multipliers (0.5..3.0) in steps and pick the multiplier that
  maximizes objective = harmonic_score - tension_score * 0.5 (favor raising harmonious, penalize tension).
- Repeat a few passes until no improvement or max passes reached.
- Write tuned weights to apps/api/src/astro/config.py and save report.
"""
from _bootstrap_path import *
import json
from astro.synastry import compute_synastry
import astro.config as ac

ASPECTS = list(ac.ASPECT_ANGLES.keys())
DEFAULT_ORBS = ac.DEFAULT_ORBS


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
    return A, B_harm, B_tens, B_neut


def objective(weights):
    A, B_harm, B_tens, B_neut = synthesize_archetypes()
    h = compute_synastry(A, B_harm, aspects=ASPECTS, orbs=DEFAULT_ORBS, weights=weights)['normalized_score']
    t = compute_synastry(A, B_tens, aspects=ASPECTS, orbs=DEFAULT_ORBS, weights=weights)['normalized_score']
    # objective: maximize h - 0.5 * t, and prefer lower neutral
    n = compute_synastry(A, B_neut, aspects=ASPECTS, orbs=DEFAULT_ORBS, weights=weights)['normalized_score']
    return h - 0.5 * t - 0.1 * n, {'harm': h, 'tens': t, 'neut': n}


def optimize(max_passes=4):
    weights = dict(ac.DEFAULT_WEIGHTS)
    best_obj, metrics = objective(weights)
    print('starting obj', best_obj, metrics)
    improved = True
    pass_no = 0
    history = []
    while improved and pass_no < max_passes:
        improved = False
        pass_no += 1
        for asp in ASPECTS:
            current = weights[asp]
            best_local = current
            best_local_obj = best_obj
            # try multipliers from 0.5 to 3.0
            for mult in [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0]:
                candidate = dict(weights)
                candidate[asp] = round(current * mult, 6)
                obj_val, mets = objective(candidate)
                if obj_val > best_local_obj:
                    best_local_obj = obj_val
                    best_local = candidate[asp]
                    best_local_metrics = mets
            if best_local != current:
                print(f'pass {pass_no} improved {asp}: {current} -> {best_local} (obj {best_local_obj})')
                weights[asp] = best_local
                best_obj = best_local_obj
                metrics = best_local_metrics
                improved = True
                history.append({'pass':pass_no,'aspect':asp,'new':best_local,'obj':best_local_obj,'metrics':metrics})
    return weights, best_obj, metrics, history


def write_config(new_weights):
    cfg_path = 'apps/api/src/astro/config.py'
    tpl = f"""# Aspect configuration and defaults for MatchByBirth (AUTO-TUNED)\n\nASPECT_ANGLES = {ac.ASPECT_ANGLES}\n\n# Default orbs (degrees)\nDEFAULT_ORBS = {ac.DEFAULT_ORBS}\n\n# Tuned weights used for normalized strength scoring\nDEFAULT_WEIGHTS = {new_weights}\n\n# Mode presets\nMODES = {{\n    'strict': {{k: max(0.0, v - 2.0) for k, v in DEFAULT_ORBS.items()}},\n    'standard': DEFAULT_ORBS,\n    'loose': {{k: v + 2.0 for k, v in DEFAULT_ORBS.items()}},\n}}\n"""
    with open(cfg_path, 'w') as f:
        f.write(tpl)
    print('wrote', cfg_path)


def main():
    new_w, obj, metrics, hist = optimize()
    print('done obj', obj, 'metrics', metrics)
    write_config(new_w)
    report = {'obj': obj, 'metrics': metrics, 'weights': new_w, 'history': hist}
    with open('/tmp/synastry_opt_report.json','w') as f:
        json.dump(report, f, indent=2)
    print('report -> /tmp/synastry_opt_report.json')

if __name__ == '__main__':
    main()
