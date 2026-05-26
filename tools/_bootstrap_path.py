import sys, os
# shim repo-root astro package to apps/api/src/astro for standalone tools
BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHIM = os.path.join(BASE, 'apps', 'api', 'src')
if SHIM not in sys.path:
    sys.path.insert(0, SHIM)
