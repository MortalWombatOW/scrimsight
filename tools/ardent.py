import os
import time
import argparse
import shutil

import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def upload_to_gemini(path, mime_type=None):
  """Uploads the given file to Gemini.

  See https://ai.google.dev/gemini-api/docs/prompting_with_media
  """
  file = genai.upload_file(path, mime_type=mime_type)
  print(f"Uploaded file '{file.display_name}' as: {file.uri}")
  return file

def wait_for_files_active(files):
  """Waits for the given files to be active.

  Some files uploaded to the Gemini API need to be processed before they can be
  used as prompt inputs. The status can be seen by querying the file's "state"
  field.

  This implementation uses a simple blocking polling loop. Production code
  should probably employ a more sophisticated approach.
  """
  print("Waiting for file processing...")
  for name in (file.name for file in files):
    file = genai.get_file(name)
    while file.state.name == "PROCESSING":
      print(".", end="", flush=True)
      time.sleep(10)
      file = genai.get_file(name)
    if file.state.name != "ACTIVE":
      raise Exception(f"File {file.name} failed to process")
  print("...all files ready")
  print()

def concatenate_text_files(directory):
  """Concatenates all text files in a directory recursively.

  Args:
    directory: The path to the directory.

  Returns:
    The path to the concatenated file.
  """
  concatenated_file_path = os.path.join(directory, "concatenated_files.txt")
  with open(concatenated_file_path, "w") as outfile:
    for root, _, files in os.walk(directory):
      for file in files:
        if file.endswith(".ts") or file.endswith(".tsx") or file.endswith(".html") or file.endswith(".scss"):
          filepath = os.path.join(root, file)
          with open(filepath, "r") as infile:
            outfile.write(f"## {file}\n")
            outfile.write(infile.read())
            outfile.write("\n")
  return concatenated_file_path

def main():
  parser = argparse.ArgumentParser(description="Upload a file or directory to Gemini and interact with it.")
  parser.add_argument("path", help="Path to a file or directory.")
  args = parser.parse_args()

  path = args.path

  # Create the model
  # See https://ai.google.dev/api/python/google/generativeai/GenerativeModel
  generation_config = {
    "temperature": 0,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
  }

  model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    # safety_settings = Adjust safety settings
    # See https://ai.google.dev/gemini-api/docs/safety-settings
    system_instruction="""Please follow these steps to understand a codebase:

1. Get the Lay of the Land:

  File Structure: Analyze the directory structure. Look for patterns in naming conventions and folder organization. This hints at the overall application architecture (e.g., separation of concerns, MVC).
  Entry Point: Identify the main file or script that starts the application execution. This could be an index.html

2. Follow the Data Flow:

  Start at the Entry Point: Begin at the main file and trace the execution flow. Look for function calls and how data is passed between them.
  Identify Data Sources: See how data is initially obtained (e.g., user input, file reading, database connection).
  Track Data Transformation: Follow how data is manipulated throughout the code. Look for functions that process or modify data.
  Identify Sinks: See where the data ultimately goes (e.g., displayed on screen, written to a file, sent to a database).

3. Decipher Key Components:

  Focus on Frequently Called Functions: Prioritize understanding functions that appear often in the codebase. These are likely core functionalities.
  Look for Configuration Files: Identify files containing settings or configurations that might influence application behavior.
  Identify Error Handling: See how errors are caught and handled throughout the code. This reveals potential weak points.

4. Piece Together the Big Picture:

  Map Out High-Level Architecture: Based on your findings, create a mental map of how the different parts of the codebase interact. Think of it as a system with interconnected components.
  Identify Modules/Subsystems: Break down the codebase into smaller, logical modules that handle specific functionalities. This simplifies understanding.
  Look for Naming Conventions: Pay attention to variable and function names. Descriptive names can reveal the purpose of code sections.

To propose improvements:
  Identify Bottlenecks: Look for repetitive code sections or inefficient algorithms. These areas could benefit from optimization.
  Find Missing Functionality: Based on the data flow and architecture, identify areas where additional features could be implemented.
  Consider Maintainability: Look for opportunities to improve code readability and maintainability. This might involve adding comments or refactoring code.

To implement a feature:
Start Small: Break down feature implementation into smaller, achievable tasks. This makes the plan more manageable.
Identify Dependencies: Determine the existing code that needs to be modified or interacted with to implement the feature.
Think About Testing: Consider how you might test the implemented feature without actually running the code. Maybe by manually tracing data flow through the modified sections."""
  )

  if os.path.isdir(path):
    concatenated_file_path = concatenate_text_files(path)
    file = upload_to_gemini(concatenated_file_path, mime_type="text/plain")
    # os.remove(os.path.join(path, "concatenated_files.txt"))
  else:
    file = upload_to_gemini(path)

  wait_for_files_active([file])

  chat_session = model.start_chat(
    history=[
      {
        "role": "user",
        "parts": [
          file,
        ],
      },
    ]
  )

  while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
      break
    response = chat_session.send_message(user_input)
    print(f"Gemini: {response.text}")

if __name__ == "__main__":
  main()