#!/usr/bin/env python3
"""CLI wrapper to run the synastry scorer from Node or other runtimes.

Reads JSON from stdin with shape:
{ "chartA": {name: lon, ...}, "chartB": {name: lon, ...}, "options": {...} }

Writes JSON to stdout with compute_synastry output.
"""
import sys, os, json
# ensure repo src is on path
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)
# also add repo root apps/api/src
SRC_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if SRC_ROOT not in sys.path:
    sys.path.insert(0, SRC_ROOT)

from astro.synastry import compute_synastry


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        print(json.dumps({'error': 'invalid json input'}))
        sys.exit(1)
    chartA = data.get('chartA') or {}
    chartB = data.get('chartB') or {}
    opts = data.get('options', {})
    aspects = opts.get('aspects')
    orbs = opts.get('orbs')
    weights = opts.get('weights')

    out = compute_synastry(chartA, chartB, aspects=aspects, orbs=orbs, weights=weights)
    sys.stdout.write(json.dumps(out))

if __name__ == '__main__':
    main()
