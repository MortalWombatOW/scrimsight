READ and UNDERSTAND the README.md file in the project root.
THEN read the project documentation by listing the files in the `docs` directory and reading them, beginning with `docs/README.md`.
THEN run `git ls-files` to see all files in the project.
THEN run `npx task-master list --with-subtasks` to see the current status of the project tasks.
THEN get the user's request and compare it to the project documentation and existing tasks. Reason about how the request fits into the project - should it be a new task? Should it be a subtask of an existing task? 
THEN Update the task-master CLI to reflect the new status.
THEN run `date` to get the current date.
THEN create a new file in the `notes` directory with the name `YYYY-MM-DD-TASK-<task-id>-<request-summary>.md`. You will fill in the following sections, asking the user for clarification as needed:
```
## BACKGROUND
* A summary of the current status of the project, and the current date and time.

## TASK
* Note the task ID and name that you're working on, e.g. "Task #1: Add a new feature". or "Task #2.3: Fix a bug".

## SUMMARY
* A summary of the user's request.

## OBJECTIVES
* The key objectives of the user's request. Make sure to think carefully about how to measure success, preferring measuring with quantitative data over qualitative feedback, e.g. using build scripts to verify all errors are fixed.
```
THEN do detailed research on the user's request, reading project files and documentation, and asking the user for clarification as needed.
THEN Ask any clarifying questions that came up.
THEN update the `notes` file by appending the following sections:
```
## HIGH-LEVEL PLAN
* A high-level plan of how to achieve the objectives.

## IMPLEMENTATION
* A detailed checklist of how to implement the user's request. These will be executed by subagents in order. 
```
THEN get approval from the user. You CANNOT start working on the code until they approve. Document their approval in the `notes` file:
```
--- APPROVAL GRANTED ---
* the exact message from the user that you think means they approved, in quotes. E.g. "looks good, proceed."
```
IF YOU START WORKING ON THE CODE BEFORE THEY APPROVE, YOU WILL BE BANNED FROM THE PROJECT.

THEN execute the implementation plan by dispatching a subagent for each step. This agent is responsible for executing the step and updating the `notes` file with any learnings or challenges encountered. If they aren't able to complete the step quickly, they report back failure and update the `notes` file accordingly with the challenges they encountered.

 You must keep an implmenentation log in the `notes` file:
```
## IMPLEMENTATION LOG
* Actions taken to implement the user's request, with any learnings or challenges encountered.
```
YOU MUST UPDATE THE IMPLEMENTATION LOG WITH EVERY ACTION YOU TAKE TO IMPLEMENT THE REQUEST.
IF YOU LEARN SOMETHING THAT REQUIRES AN UPDATE TO THE PLAN, YOU MUST STOP AND ASK THE USER FOR CLARIFICATION BEFORE CONTINUING.

IMPORTANT: a good software engineer will always keep documentation up-to-date. Make sure to keep the `notes` and `docs` files and the taskmaster tasks up-to-date with the latest status of the project, not just for the user but for future reference as well.

STRICT ADHERENCE TO THIS PROCESS IS ABSOLUTELY CRITICAL. IF YOU DON'T FOLLOW THIS PROCESS, YOU WILL BE BANNED FROM THE PROJECT.