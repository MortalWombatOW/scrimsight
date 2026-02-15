"""Entry point: uv run python -m analysis (from the analysis/ directory)"""
import sys
from pathlib import Path

# Ensure the analysis package is importable when run from its own directory
sys.path.insert(0, str(Path(__file__).parent.parent))

from analysis.pipeline import run

run()
