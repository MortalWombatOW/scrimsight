The user has asked you to handle a new task: $ARGUMENTS

Follow these steps:
1 Think deeply about the task and the best way to handle it.
2 Ask the user at least 3 clarification questions to confirm scope, then stop and await their response.
3 Create a new file at `/notes/<slug>.md` containing:

```markdown
## TASK
<A nicely formatted paraphrase of user request>

## OBJECTIVES
<bullet list describing the end state after accomplishing the task>

## OUTPUT FORMAT
<bullet list describing the format of the output or changes to the project>

## SUCCESS CRITERIA
<bullet list describing the conditions under which the task is considered complete. these must be measurable and verifiable, e.g. "the command `npm run build` completes successfully">
```