"""Audit SHRM quiz option distributions and length parity.

Usage (from repository root):
    python .agents/skills/shrm-data-pipeline/scripts/audit-distractors.py
"""
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[4]
QUIZ_JSON = ROOT / "data" / "quiz.json"

with QUIZ_JSON.open("r", encoding="utf-8") as f:
    data = json.load(f)

total = len(data)
positions = [0, 0, 0, 0]
longest_is_correct = 0
flagged_ids = []

for q in data:
    positions[q["answer"]] += 1
    lengths = [len(o) for o in q["options"]]
    if lengths.index(max(lengths)) == q["answer"]:
        longest_is_correct += 1
    if max(lengths) > 0 and (min(lengths) / max(lengths)) < 0.4:
        flagged_ids.append(q["id"])

print("=== Answer Position Distribution ===")
for i, count in enumerate(positions):
    print(f"  Option {chr(65 + i)}: {count}/{total} ({100 * count / total:.1f}%)")

print(
    f"\n=== Correct Answer is Longest Option: {longest_is_correct}/{total} ({100 * longest_is_correct / total:.1f}%) ==="
)
print(f"\n=== Option Length Imbalance (< 0.40 min/max): {len(flagged_ids)} ===")
if flagged_ids:
    print("  Flagged IDs:", flagged_ids)
