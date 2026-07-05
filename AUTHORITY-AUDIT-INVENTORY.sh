#!/bin/bash
# UCOS Authority Audit - Document Inventory Script
# Phase 1: Document Discovery

OUTPUT_FILE="AUTHORITY-AUDIT-PHASE1-INVENTORY.md"

echo "# UCOS Authority Audit - Phase 1: Document Inventory" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Generated:** $(date)" >> "$OUTPUT_FILE"
echo "**Purpose:** Complete inventory of governance artifacts" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## 1. Document Count by Type" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "| Type | Count |" >> "$OUTPUT_FILE"
echo "|------|-------|" >> "$OUTPUT_FILE"
echo "| Markdown (*.md) | $(find . -name "*.md" ! -path "*/node_modules/*" ! -path "*/.git/*" | wc -l | tr -d ' ') |" >> "$OUTPUT_FILE"
echo "| TypeScript (*.ts, *.tsx) | $(find . \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.git/*" | wc -l | tr -d ' ') |" >> "$OUTPUT_FILE"
echo "| JSON (*.json) | $(find . -name "*.json" ! -path "*/node_modules/*" ! -path "*/.git/*" | wc -l | tr -d ' ') |" >> "$OUTPUT_FILE"
echo "| YAML (*.yaml, *.yml) | $(find . \( -name "*.yaml" -o -name "*.yml" \) ! -path "*/node_modules/*" ! -path "*/.git/*" | wc -l | tr -d ' ') |" >> "$OUTPUT_FILE"
echo "| SQL (*.sql) | $(find . -name "*.sql" ! -path "*/node_modules/*" ! -path "*/.git/*" | wc -l | tr -d ' ') |" >> "$OUTPUT_FILE"
echo "| **TOTAL** | $(find . -type f \( -name "*.md" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.sql" \) ! -path "*/node_modules/*" ! -path "*/.git/*" | wc -l | tr -d ' ') |" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## 2. Document Distribution by Directory" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "| Directory | MD Count | TS Count | JSON Count | Total |" >> "$OUTPUT_FILE"
echo "|-----------|----------|----------|------------|-------|" >> "$OUTPUT_FILE"

for dir in .claude .claude/authority .claude/context docs docs/constitution docs/domain-architecture docs/data-architecture docs/capability-architecture docs/enterprise-architecture requirements wave-1 tools/contract-generator tools/program-compiler; do
  if [ -d "$dir" ]; then
    md_count=$(find "$dir" -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    ts_count=$(find "$dir" -maxdepth 1 \( -name "*.ts" -o -name "*.tsx" \) 2>/dev/null | wc -l | tr -d ' ')
    json_count=$(find "$dir" -maxdepth 1 -name "*.json" 2>/dev/null | wc -l | tr -d ' ')
    total=$((md_count + ts_count + json_count))
    echo "| $dir | $md_count | $ts_count | $json_count | $total |" >> "$OUTPUT_FILE"
  fi
done
echo "" >> "$OUTPUT_FILE"

echo "## 3. Root Level Document Count" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
root_md=$(find . -maxdepth 1 -name "*.md" | wc -l | tr -d ' ')
echo "Root-level markdown files: **$root_md**" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## 4. Authority Layer Documents" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "| Document | Path | Lines |" >> "$OUTPUT_FILE"
echo "|----------|------|-------|" >> "$OUTPUT_FILE"
if [ -d ".claude/authority" ]; then
  find .claude/authority -name "*.md" | sort | while read -r file; do
    lines=$(wc -l < "$file" | tr -d ' ')
    echo "| $(basename "$file") | $file | $lines |" >> "$OUTPUT_FILE"
  done
fi
echo "" >> "$OUTPUT_FILE"

echo "## 5. Context Layer Documents" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "| Document | Path | Lines |" >> "$OUTPUT_FILE"
echo "|----------|------|-------|" >> "$OUTPUT_FILE"
if [ -d ".claude/context" ]; then
  find .claude/context -name "*.md" | sort | while read -r file; do
    lines=$(wc -l < "$file" | tr -d ' ')
    echo "| $(basename "$file") | $file | $lines |" >> "$OUTPUT_FILE"
  done
fi
echo "" >> "$OUTPUT_FILE"

echo "## 6. Constitution Documents" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "| Document | Path | Lines |" >> "$OUTPUT_FILE"
echo "|----------|------|-------|" >> "$OUTPUT_FILE"
if [ -d "docs/constitution" ]; then
  find docs/constitution -name "*.md" | sort | while read -r file; do
    lines=$(wc -l < "$file" | tr -d ' ')
    echo "| $(basename "$file") | $file | $lines |" >> "$OUTPUT_FILE"
  done
fi
echo "" >> "$OUTPUT_FILE"

echo "## 7. Documents with Artifact IDs (Sample)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "| Artifact ID | File | Status Pattern |" >> "$OUTPUT_FILE"
echo "|-------------|------|----------------|" >> "$OUTPUT_FILE"
grep -r "^\*\*Artifact ID:" --include="*.md" | head -50 | while IFS=: read -r file line; do
  artifact_id=$(echo "$line" | sed 's/\*\*Artifact ID:\*\* *//' | sed 's/`//g' | tr -d '\r' | head -c 50)
  status=$(grep -A 2 "^\*\*Artifact ID:" "$file" | grep -i "^\*\*Status:" | sed 's/\*\*Status:\*\* *//' | head -c 30)
  echo "| $artifact_id | $(basename "$file") | $status |" >> "$OUTPUT_FILE"
done
echo "" >> "$OUTPUT_FILE"

echo "## 8. Documents Claiming Authority" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
grep -l "AUTHORITATIVE\|Authority\|RATIFIED\|CANONICAL" --include="*.md" -r . ! -path "*/node_modules/*" ! -path "*/.git/*" | head -30 >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## 9. Documents Claiming Supersession" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
grep -l "Supersedes\|SUPERSEDED\|supersedes" --include="*.md" -r . ! -path "*/node_modules/*" ! -path "*/.git/*" | head -30 >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "Inventory complete. Output: $OUTPUT_FILE"
