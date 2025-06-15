You have been instructed to execute a task by using sub-agents to execute each step in the plan.
Follow these steps:
1 Read the task file $ARGUMENTS.
2 For each step in the plan:
  2.1 Spawn a **Sub‑Agent** with a single, precise objective.
  2.2 Wait while the Sub‑Agent executes.
  2.3 Validate if the Sub‑Agent accomplished the step.
  2.4 If the Sub‑Agent failed, identify what exactly went wrong and how to fix it. Spawn a new Sub‑Agent to fix the issue. You may do this up to 3 times. If the Sub‑Agent still fails, stop and ask the user for help.
  2.5 If the Sub‑Agent succeeded, update the status of the step to "done" in the file $ARGUMENTS.

Then stop.
