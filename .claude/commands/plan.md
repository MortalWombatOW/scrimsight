The user has asked you to plan a task by creating actionable, atomic steps to accomplish it.

Follow these steps:
1 Read the task file $ARGUMENTS.
2 Think carefully about the task and what actions would be needed to accomplish it.
3 Append a section to the file $ARGUMENTS with a  list of the steps you need to take to accomplish the task. Each step should be approximately the same complexity, be very clear, and be as independent as possible. Use this format:

```markdown
## HIGH‑LEVEL PLAN
<description of the plan at a high level, a few sentences>

## IMPLEMENTATION

### Step 1:
<description of the first step>
Files affected:
- <file 1 path> – <description of file 1 changes>
- <file 2 path> – <description of file 2 changes>
- etc.
Success criteria: <how to validate if the step is complete>
Status: todo

### Step 2:
<description of the second step>
Files affected:
- <file 1 path> – <description of file 1 changes>
- <file 2 path> – <description of file 2 changes>
- etc.
Success criteria: <how to validate if the step is complete>
Status: todo

etc.
```

Then stop.

