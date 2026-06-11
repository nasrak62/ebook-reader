#!/bin/bash
set -euo pipefail

# Build the full extension (reader + popup + background) then package the
# build/ folder into a Chrome Web Store-ready zip with manifest.json at root.

ZIP_NAME="e-reader.zip"

yarn build:full

rm -f "./$ZIP_NAME"

cd ./build
zip -r "../$ZIP_NAME" ./*
cd ..

echo "Created $ZIP_NAME"
