#!/bin/bash

directory="$1"    # Take the directory path as the first argument
file_limit=500    # Set the limit to 100 files
output_file="codebase.txt"  # Set the output file name
allowlist=("ts" "tsx" "scss")  # Default allowed extensions

# Check if a directory was provided
if [[ -z "$directory" ]]; then
    echo "Usage: $0 <directory> [extension1 extension2 ...]"
    exit 1
fi

# Check if the directory exists
if [[ ! -d "$directory" ]]; then
    echo "Error: Directory '$directory' not found."
    exit 1
fi

# Process additional command-line arguments as extensions
shift  # Remove the directory argument
if [[ $# -gt 0 ]]; then
    allowlist=("$@")  # Update the allowlist if provided
fi

# Function for logging with timestamps
log() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

# Initialize the file counter
file_count=0

# Function to check if a file extension is allowed
is_allowed() {
    local file="$1"
    local extension="${file##*.}"  # Extract the extension

    for allowed in "${allowlist[@]}"; do
        if [[ "$extension" == "$allowed" ]]; then
            return 0  # Allowed
        fi
    done

    return 1  # Not allowed
}

# Function to process files recursively
process_files() {
    local dir="$1"

    for file in "$dir"/*; do
        if [[ -f "$file" && $(is_allowed "$file") -eq 0 ]]; then 
            # Append file name and contents to the output file
            echo -e "\nFile: $file\n\n$(cat "$file")\n" >> "$output_file" 
            log "Processed file: $file"
            file_count=$((file_count + 1)) 

            # Check if the file limit has been reached
            if [[ $file_count -ge $file_limit ]]; then
                log "File limit reached ($file_limit). Stopping processing."
                return
            fi
        elif [[ -d "$file" ]]; then
            # Recursively process subdirectories
            log "Entering directory: $file"
            process_files "$file"
            log "Exiting directory: $file"
        fi
    done
}

# Start processing from the provided directory, overwriting existing output file
log "Starting processing from: $directory"
echo "" > "$output_file" # Clear the output file before starting
process_files "$directory"
log "Processing complete. Output saved to $output_file"
