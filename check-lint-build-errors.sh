#!/bin/bash

set -o pipefail

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

if [ $# -eq 0 ]; then
  echo "Usage: $0 <path/to/file_or_folder_1> [path/to/file_or_folder_2 ...]"
  exit 1
fi

# --- Function to process TSC output for a specific target ---
# $1: Target path (file or directory)
# $2: Type ("file" or "folder")
# Reads from stdin (expects piped output from tsc)
process_tsc_output_for_target() {
  local target_path="$1"
  local target_type="$2"
  local line
  local in_target_error_block=0
  local output_produced=0

  # Regex to identify the start of *any* tsc error line (for --pretty false)
  # Format: path/to/file.ts(line,col): error TSxxxx: Message
  # We need to escape for Bash's `=~` operator.
  # Parens for grouping, . for literal dot.
  local any_error_start_regex="^([^[:space:]]+\\.tsx?|[[:graph:]]*[/][^[:space:]]+\\.tsx?)\\([0-9]+,[0-9]+\\):[[:space:]]*error TS[0-9]+:"

  # Regex/pattern to identify start of error FOR THE CURRENT TARGET
  local target_error_start_pattern # This will be a regex
  if [ "$target_type" = "file" ]; then
    # For a file, the error line must start with this exact path.
    # Escape $target_path for regex (e.g. dots in filename)
    local escaped_target_path
    escaped_target_path=$(printf '%s\n' "$target_path" | sed 's/[.^$*+?()\[\]{}\\|\-]/\\&/g')
    target_error_start_pattern="^${escaped_target_path}\\([0-9]+,[0-9]+\\):"
  elif [ "$target_type" = "folder" ]; then
    # For a folder, error line must start with this folder path prefix.
    local escaped_target_path
    escaped_target_path=$(printf '%s\n' "$target_path" | sed 's/[.^$*+?()\[\]{}\\|\-]/\\&/g')
    # Ensure it ends with a slash if it doesn't have one, then match anything after.
    # The tsc output uses / for paths.
    if [[ "$escaped_target_path" != */ ]]; then
      escaped_target_path="${escaped_target_path}/"
    fi
    target_error_start_pattern="^${escaped_target_path}"
  fi

  # echo -e "${BLUE}DEBUG (process_tsc_output_for_target): Target: $target_path, Type: $target_type${NC}" >&2
  # echo -e "${BLUE}DEBUG (process_tsc_output_for_target): Target Start Pattern: $target_error_start_pattern${NC}" >&2
  # echo -e "${BLUE}DEBUG (process_tsc_output_for_target): Any Error Start Regex: $any_error_start_regex${NC}" >&2


  while IFS= read -r line; do
    # echo "DEBUG_LINE: [$line]" >&2 # Extreme verbosity for line-by-line
    if [[ "$line" =~ $target_error_start_pattern ]]; then
      # echo "DEBUG_MATCH: Target start: [$line]" >&2
      echo "$line"
      output_produced=1
      in_target_error_block=1
    elif [ "$in_target_error_block" -eq 1 ]; then
      if [[ "$line" =~ $any_error_start_regex ]]; then
        # echo "DEBUG_MATCH: New error started, ending target block: [$line]" >&2
        # New error started (could be for another file, or even same file but a new error)
        # This means the previous block for our target file has ended.
        in_target_error_block=0
        # We don't print this line unless it also matches the target_error_start_pattern (handled above)
      else
        # echo "DEBUG_MATCH: Continuation of target block: [$line]" >&2
        # This is a continuation line of the error for our target.
        echo "$line"
        output_produced=1
      fi
    fi
  done

  # Return status based on whether output was produced
  if [ "$output_produced" -eq 1 ]; then
    return 0 # Output was produced, implies issues found for this target
  else
    return 1 # No output for this target
  fi
}


# --- Function to run and check a command ---
# $1: description
# $2: command_to_run (can be simple or a pipeline)
# $3: path_context
# $4: (optional) "tsc_check" - if this is a tsc check, implies $TARGET_PATH and $TARGET_TYPE will be available globally
run_and_check() {
  local description="$1"
  local command_to_run="$2"
  local path_context="$3"
  local tsc_check_mode="$4"


  echo -e "\n--- $description (for $path_context) ---"
  # echo -e "${BLUE}DEBUG: Executing: $command_to_run${NC}" >&2

  if [ "$tsc_check_mode" = "tsc_check" ]; then
    # For TSC, we run the base command and pipe its *entire* output
    # to our dedicated Bash processing function.
    # The `process_tsc_output_for_target` function will determine if relevant errors exist.
    
    # The command_to_run is just the 'npx tsc ...' part
    # We need to capture tsc's exit status, separate from the processing function's status
    local tsc_output
    local tsc_exit_status
    
    # Execute tsc and capture its output and exit status
    # Using a temporary file for tsc output to reliably get exit status before processing
    # This avoids complexities with pipefail and subshells altering $? too early.
    local tmp_tsc_output
    tmp_tsc_output=$(mktemp)
    
    eval "$command_to_run" > "$tmp_tsc_output" 2>&1
    tsc_exit_status=$?
    # cat "$tmp_tsc_output" >&2 # Debug: show full tsc output

    # Now process the captured output
    if process_tsc_output_for_target "$CURRENT_PROCESSING_TARGET_PATH" "$CURRENT_PROCESSING_TARGET_TYPE" < "$tmp_tsc_output"; then
      # process_tsc_output_for_target returned 0 (output was produced)
      rm "$tmp_tsc_output"
      if [ "$tsc_exit_status" -ne 0 ]; then
        echo -e "${RED}(tsc command also failed with exit code $tsc_exit_status)${NC}"
      fi
      return 1 # Issues found
    else
      # process_tsc_output_for_target returned 1 (no relevant output)
      rm "$tmp_tsc_output"
      if [ "$tsc_exit_status" -eq 0 ]; then
         echo -e "${GREEN}✅ No issues found.${NC}"
         return 0
      else
         # tsc failed, but our filter didn't find errors for THIS specific file/folder
         echo -e "${GREEN}✅ No issues found for '$path_context' (but tsc reported errors for other files or project-wide, exit code $tsc_exit_status).${NC}"
         # We might still want to count this as a "pass" for this specific path,
         # but a global failure might be tracked elsewhere if needed. For this function, it's a pass.
         return 0 # Or return 1 if any tsc error should fail the path
      fi
    fi

  else
    # Standard command execution (like eslint)
    OUTPUT_AND_STDERR=$(eval "$command_to_run 2>&1")
    local cmd_exit_status=$?

    if [ "$cmd_exit_status" -eq 0 ] && [ -z "$OUTPUT_AND_STDERR" ]; then
      echo -e "${GREEN}✅ No issues found.${NC}"
      return 0
    else
      if [ -n "$OUTPUT_AND_STDERR" ]; then
        printf "%s\n" "$OUTPUT_AND_STDERR"
      fi
      if [ "$cmd_exit_status" -ne 0 ]; then
        if [ -z "$OUTPUT_AND_STDERR" ]; then
          echo -e "${RED}Command failed with exit code $cmd_exit_status and produced no output.${NC}"
        else
          echo -e "${RED}(Command also failed with exit code $cmd_exit_status)${NC}"
        fi
      fi
      return 1
    fi
  fi
}

# Global vars to pass to process_tsc_output_for_target via run_and_check
CURRENT_PROCESSING_TARGET_PATH=""
CURRENT_PROCESSING_TARGET_TYPE=""

declare -a paths_with_issues

for TARGET_PATH_ARG in "$@"; do
  echo -e "\n${BLUE}Processing: $TARGET_PATH_ARG${NC}"
  current_path_had_issue=0
  
  # Normalize TARGET_PATH_ARG to remove trailing slash for consistency
  NORMALIZED_TARGET_PATH="${TARGET_PATH_ARG%/}"
  CURRENT_PROCESSING_TARGET_PATH="$NORMALIZED_TARGET_PATH"


  if [ -f "$NORMALIZED_TARGET_PATH" ]; then
    CURRENT_PROCESSING_TARGET_TYPE="file"
    echo -e "${BLUE}🔍 Type: File${NC}"

    LINT_COMMAND="npx eslint \"$NORMALIZED_TARGET_PATH\" --fix --max-warnings 0"
    run_and_check "Linting File" "$LINT_COMMAND" "$NORMALIZED_TARGET_PATH"
    if [ $? -ne 0 ]; then current_path_had_issue=1; fi
    
    # For TSC, the command is just tsc, the processing is handled inside run_and_check
    TSC_BASE_COMMAND="npx tsc --project tsconfig.json --noEmit --pretty false"
    run_and_check "Checking TypeScript Build Errors" "$TSC_BASE_COMMAND" "$NORMALIZED_TARGET_PATH" "tsc_check"
    if [ $? -ne 0 ]; then current_path_had_issue=1; fi

  elif [ -d "$NORMALIZED_TARGET_PATH" ]; then
    CURRENT_PROCESSING_TARGET_TYPE="folder"
    echo -e "${BLUE}📁 Type: Folder${NC}"

    LINT_COMMAND="npx eslint \"$NORMALIZED_TARGET_PATH/**/*.{ts,tsx}\" --fix --max-warnings 0"
    run_and_check "Linting Folder" "$LINT_COMMAND" "$NORMALIZED_TARGET_PATH"
    if [ $? -ne 0 ]; then current_path_had_issue=1; fi

    TSC_BASE_COMMAND="npx tsc --project tsconfig.json --noEmit --pretty false"
    run_and_check "Checking TypeScript Build Errors" "$TSC_BASE_COMMAND" "$NORMALIZED_TARGET_PATH" "tsc_check"
    if [ $? -ne 0 ]; then current_path_had_issue=1; fi

  else
    echo -e "${RED}Error: Path '$TARGET_PATH_ARG' is not a valid file or directory.${NC}"
    current_path_had_issue=1
  fi

  if [ "$current_path_had_issue" -ne 0 ]; then
    paths_with_issues+=("$TARGET_PATH_ARG") # Store original path
  fi
done

# Clean up globals
unset CURRENT_PROCESSING_TARGET_PATH
unset CURRENT_PROCESSING_TARGET_TYPE

echo -e "\n--- Summary ---"
if [ ${#paths_with_issues[@]} -eq 0 ]; then
  echo -e "${GREEN}🎉 All checks passed for all provided paths.${NC}"
  exit 0
else
  echo -e "${RED}❌ Issues found in the following paths:${NC}"
  for path_item in "${paths_with_issues[@]}"; do
    echo -e "${RED}  - $path_item${NC}"
  done
  exit 1
fi