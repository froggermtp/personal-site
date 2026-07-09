#!/usr/bin/env bash
set -euo pipefail

# Resolve repo root
cd "$(dirname "$0")/.."
repo_root="$PWD"

# Parse options
image_path=""
alt_text=""

usage() {
  echo "Usage: $0 [-i <image-path> -a <alt-text>]"
  echo "  -i <image-path>  Path to an image file (requires -a)"
  echo "  -a <alt-text>    Alt text for the image (required if -i is given)"
}

while getopts "i:a:" opt; do
  case "$opt" in
    i) image_path="$OPTARG" ;;
    a) alt_text="$OPTARG" ;;
    *) usage; exit 1 ;;
  esac
done

# Validate: if -i is given, -a must also be given
if [[ -n "$image_path" && -z "$alt_text" ]]; then
  echo "Error: alt text required for image notes, use -a" >&2
  exit 1
fi

# Generate slug from current time (BSD date)
slug=$(date +%Y%m%d-%H%M)

# Check if note already exists
note_file="$repo_root/src/views/notes/$slug.md"
if [[ -f "$note_file" ]]; then
  echo "Error: A note already exists for this minute ($slug). Only one note per minute is possible." >&2
  exit 1
fi

# Build ISO 8601 date with colon in UTC offset
# BSD date +%z gives -0500 format; we need -05:00
iso_date=$(date +%Y-%m-%dT%H:%M:00%z)
# Insert colon before last 2 digits of offset
iso_date="${iso_date%??}:${iso_date: -2}"

# Handle image if provided
if [[ -n "$image_path" ]]; then
  if [[ ! -f "$image_path" ]]; then
    echo "Error: Image file does not exist: $image_path" >&2
    exit 1
  fi

  # Get lowercased extension
  ext="${image_path##*.}"
  ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

  # Copy image to assets directory
  src_image="$repo_root/src/assets/images/notes/$slug.$ext"
  cp "$image_path" "$src_image"
fi

# Write the note file
mkdir -p "$repo_root/src/views/notes"

{
  echo "---"
  echo "date: $iso_date"
  if [[ -n "$image_path" ]]; then
    echo "image: notes/$slug.$ext"
    echo "imageAlt: \"${alt_text//\"/\\\"}\""
  fi
  echo "---"
  echo ""
} > "$note_file"

# Print what was created
echo "Created note: $note_file"
if [[ -n "$image_path" ]]; then
  echo "Created image: $src_image"
fi

echo ""
echo "To publish: git add -A && git commit -m \"Add note $slug\" && git push"

# Open in editor if EDITOR is set
if [[ -n "${EDITOR:-}" ]]; then
  "$EDITOR" "$note_file"
fi
