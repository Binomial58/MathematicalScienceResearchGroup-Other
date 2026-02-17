#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DEFAULT_PDF="${PROJECT_DIR}/../slide.pdf"
PDF_PATH="${1:-${DEFAULT_PDF}}"
OUT_DIR="${PROJECT_DIR}/public/slides"

if ! command -v pdftoppm >/dev/null 2>&1; then
  echo "pdftoppm not found. Install poppler-utils first."
  exit 1
fi

if [ ! -f "${PDF_PATH}" ]; then
  echo "PDF not found: ${PDF_PATH}"
  exit 1
fi

mkdir -p "${OUT_DIR}"
rm -f "${OUT_DIR}/slide-"*.png
pdftoppm -png "${PDF_PATH}" "${OUT_DIR}/slide"

echo "Generated: ${OUT_DIR}/slide-*.png from ${PDF_PATH}"
