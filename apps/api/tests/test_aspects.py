import pytest

from astro.aspects import compute_aspects


def test_conjunction_detected_exact():
    positions = {'A': 10.0, 'B': 10.0}
    res = compute_aspects(positions, aspects=['conjunction'])
    assert len(res) == 1
    r = res[0]
    assert r['aspect'] == 'conjunction'
    assert r['orb_diff'] == 0.0
    assert r['strength'] == 1.0


def test_sextile_within_orb_boundary():
    positions = {'A': 0.0, 'B': 64.0}  # 4 deg from 60
    res = compute_aspects(positions, aspects=['sextile'])
    assert len(res) == 1
    assert res[0]['aspect'] == 'sextile'
    assert abs(res[0]['orb_diff'] - 4.0) < 1e-6


def test_no_aspect_outside_orb():
    positions = {'A': 0.0, 'B': 70.0}
    res = compute_aspects(positions, aspects=['sextile'])
    assert len(res) == 0


def test_strength_monotonic():
    positions1 = {'A': 0.0, 'B': 60.0}
    positions2 = {'A': 0.0, 'B': 63.0}
    r1 = compute_aspects(positions1, aspects=['sextile'])[0]
    r2 = compute_aspects(positions2, aspects=['sextile'])[0]
    assert r1['strength'] > r2['strength']
