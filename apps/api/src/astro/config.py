# Aspect configuration and defaults for MatchByBirth

ASPECT_ANGLES = {
    'conjunction': 0.0,
    'sextile': 60.0,
    'square': 90.0,
    'trine': 120.0,
    'opposition': 180.0,
}

# Default orbs (degrees)
DEFAULT_ORBS = {
    'conjunction': 8.0,
    'opposition': 8.0,
    'trine': 6.0,
    'square': 6.0,
    'sextile': 4.0,
}

# Weights used for normalized strength scoring
DEFAULT_WEIGHTS = {
    'conjunction': 1.0,
    'opposition': 0.95,
    'trine': 0.90,
    'square': 0.85,
    'sextile': 0.60,
}

# Mode presets
MODES = {
    'strict': {k: max(0.0, v - 2.0) for k, v in DEFAULT_ORBS.items()},
    'standard': DEFAULT_ORBS,
    'loose': {k: v + 2.0 for k, v in DEFAULT_ORBS.items()},
}
