#!/bin/bash

# ANSI color codes for better output formatting
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# The path provided as the first argument to the script
TARGET_PATH=$1

# Check if a path was provided. If not, print usage instructions and exit.
if [ -z "$TARGET_PATH" ]; then
  echo "Usage: $0 <path/to/file_or_folder>"
  exit 1
fi

# --- Function to run and check a command ---
# Takes a description and a command as arguments.
# Executes the command, captures its output.
# If output exists, it's printed. Otherwise, a success message is shown.
run_and_check() {
  local description="$1"
  local command_to_run="$2"

  echo -e "\n--- $description ---"

  # Execute the command and capture both stdout and stderr
  # The `eval` is used to correctly handle complex commands with quotes and globs
  OUTPUT=$(eval "$command_to_run 2>&1")

  # Check if the captured output is empty
  if [ -z "$OUTPUT" ]; then
    echo -e "${GREEN}✅ No issues found.${NC}"
  else
    # If there is output, print it
    echo "$OUTPUT"
  fi
}


# --- Main script logic ---

# Check if the provided path is a file
if [ -f "$TARGET_PATH" ]; then
  echo -e "${BLUE}🔍 Running commands for file: $TARGET_PATH${NC}"

  # Define commands for a single file
  LINT_COMMAND="npx eslint \"$TARGET_PATH\" --fix --max-warnings 0"
  BUILD_COMMAND="npx tsc --project tsconfig.json --noEmit | grep \"$TARGET_PATH\" --after-context 2"

  run_and_check "Linting File" "$LINT_COMMAND"
  run_and_check "Checking TypeScript Build Errors" "$BUILD_COMMAND"

# Check if the provided path is a directory
elif [ -d "$TARGET_PATH" ]; then
  echo -e "${BLUE}📁 Running commands for folder: $TARGET_PATH${NC}"

  # Define commands for a folder
  # The glob pattern needs to be handled carefully, so it's part of the command string
  LINT_COMMAND="npx eslint \"$TARGET_PATH/**/*.{ts,tsx}\" --fix --max-warnings 0"
  BUILD_COMMAND="npx tsc --project tsconfig.json --noEmit | grep \"$TARGET_PATH\" --after-context 2"

  run_and_check "Linting Folder" "$LINT_COMMAND"
  run_and_check "Checking TypeScript Build Errors" "$BUILD_COMMAND"

# If the path is neither a file nor a directory, print an error and exit
else
  echo "Error: Path '$TARGET_PATH' is not a valid file or directory."
  exit 1
fi