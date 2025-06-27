The user has asked you to perform research to help plan a task.

Follow these steps:
1 Read the task file: $ARGUMENTS.
2 Think cafefully about the task and what information would be useful to gather to aid planning how to accomplish the task.
3 Create a TODO list of the steps you need to take to gather the information.
4 For EACH step in the TODO list:
  4.1 Spawn a **Sub‑Agent** with a single, precise objective.
  4.2 Wait while the Sub‑Agent executes.
  4.3 Think about the Sub‑Agent's response.
5 Append the results to the file $ARGUMENTS in the format:

```markdown
## RESEARCH PLAN
### Question 1?
  * Answer 1

### Question 2?
  * Answer 2
...
```

Then stop.

