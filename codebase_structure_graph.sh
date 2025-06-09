#!/bin/bash

TSG_OUTPUT_FILE="codebase-structure-graph.md"
MERMAID_FILE="docs/codebase-structure-graph.mmd"
RENDER_FILE="docs/codebase-structure-graph.svg"

# Generate the codebase structure graph using typescript-graph (tsg)
npx tsg --tsconfig=tsconfig.json --exclude node_modules --exclude stories.tsx --exclude test.ts --md="$TSG_OUTPUT_FILE"

# Clean output file by removing the first 7 and last 2 lines to make it a valid Mermaid diagram
sed -i -e '1,7d' "$TSG_OUTPUT_FILE"
head -n -2 "$TSG_OUTPUT_FILE" > "$MERMAID_FILE"
rm "$TSG_OUTPUT_FILE"

# Render the Mermaid diagram
mmdc -i "$MERMAID_FILE" -o "$RENDER_FILE" -t neutral