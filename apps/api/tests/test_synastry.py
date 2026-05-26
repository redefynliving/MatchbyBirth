import pytest
from astro.synastry import compute_synastry


def test_synastry_simple_conjunction():
    A = {'Sun': 10.0}
    B = {'Sun': 10.0}
    out = compute_synastry(A, B, aspects=['conjunction'], orbs={'conjunction': 8.0}, weights={'conjunction':1.0})
    assert out['raw_score'] > 0
    assert out['normalized_score'] > 0
    assert len(out['aspects']) == 1


def test_synastry_no_aspect():
    A = {'Sun': 0.0}
    B = {'Sun': 20.0}
    out = compute_synastry(A, B, aspects=['conjunction'], orbs={'conjunction': 5.0}, weights={'conjunction':1.0})
    assert out['raw_score'] == 0
    assert out['normalized_score'] == 0
    assert len(out['aspects']) == 0
