# PRIME COMMAND

> **Audience:** The **Agent** (planner/orchestrator) and their disposable **Sub‑Agents** (executors).  
> **Scope:** Defines the exact, repeatable workflow for handling every new user request **without ever committing code or changing Git history**.  
> **Penalty for deviation:** Immediate removal from the project.

---

## 0 GROUND RULES

0.1 **Read‑Only Git** – The Agent and Sub‑Agents may run *only* read‑only commands such as `git ls-files`, `git show`, `git diff --no-index`, etc. **Never** run `git add`, `git commit`, `git push`, or alter branches/tags in any way.  
0.2 **No Direct Code Changes** – All implementation is captured in `/notes/*` and executed by Sub‑Agents; the human maintainer will handle actual commits/PRs.  
0.3 **Single Source of Truth** – Keep `notes/`, `docs/`, and **Task‑Master** tasks perfectly in sync.  
0.4 **STOP‑QUESTIONS** – Whenever a step is marked **🛑 STOP & ASK**, immediately pause, ask the user, and await an explicit go‑ahead (`"Looks good, proceed"` or similar).

---

## 1 PREPARATION PHASE

1.1 Read `README.md` in the project root.  
1.2 Read documentation: 
  1.2.1 Read `docs/README.md`
  1.2.2 List under `docs/` using `ls docs/`
  1.2.3 Read all files under `docs/`
1.3 Inspect repository structure with `git ls-files` (read‑only).  
1.4 List tasks with `npx task-master list --with-subtasks`.
1.5 **🛑 STOP & ASK** the user for their request.

---

## 2 REQUEST TRIAGE
 
2.1 Compare the request with existing docs and tasks; decide whether it is  
   - a new task,  
   - a subtask of an existing task, or  
   - duplicate/invalid.
2.2 **🛑 STOP & ASK** the user if the mapping is unclear.

---

## 3 TASK‑MASTER UPDATE

3.1 Update Task‑Master CLI to reflect the decision from Request Triage.  
3.2 Record the current date/time by running `date`.

---

## 4 NOTE INITIALISATION

4.1 Create `/notes/YYYY‑MM‑DD‑task‑<task‑id>-<slug>.md` containing:

```markdown
## BACKGROUND
* <brief project status> — <YYYY‑MM‑DD HH:MM>

## TASK
* Task <id>: <task name or subtask path>

## SUMMARY
* <one‑sentence paraphrase of user request>

## OBJECTIVES
* <bullet list of measurable outcomes>
```

4.2 **🛑 STOP & ASK** the user at least 3 clarification questions to confirm the project scope. Update the notes file based on the answers.

---

## 5 RESEARCH & PLANNING

5.1 Append to the note file a `## RESEARCH PLAN` section with a bullet list of research questions.
5.2 For **each** research question in the bullet list:
  5.2.1 Dispatch a Sub‑Agent to research each question by studying relevant code and docs and running read‑only commands as needed. They must update the `notes` file with their findings.
5.3 Review the `notes` file and confirm the research plan is complete.
5.4 Append to the note file:
   5.4.1 `## HIGH‑LEVEL PLAN` – bullet outline.
   5.4.2 `## IMPLEMENTATION` – ordered checklist (each item = one Sub‑Agent).
5.5 **🛑 STOP & ASK** the user to approve the plan.

---

## 6 USER APPROVAL GATE

6.1 Upon approval, append to the note file:

   ```markdown
   --- APPROVAL GRANTED ---
   "<exact user message>"
   ```

6.2 If approval is **not** granted, revise the plan and repeat §5.

---

## 7 IMPLEMENTATION EXECUTION

7.1 For **each** checklist item in `## IMPLEMENTATION`:

   7.1.1 Spawn a Sub‑Agent with a single, precise objective.
   7.1.2 Sub‑Agent executes and appends a line to `## IMPLEMENTATION LOG`:

   ```markdown
   * <action> – <result/challenges>
   ```

   7.1.3 On failure or major discovery → **🛑 STOP & ASK** the user before adjusting the plan.

---

## 8 POST‑IMPLEMENTATION WRAP‑UP

8.1 Report completion to the user and **🛑 STOP & ASK** the user for final approval.
8.2 After approval, you must update `notes/`, `docs/`, and Task‑Master to all reflect final status and any knowledge gained.


---

## 9 CHECKLIST SUMMARY (PIN ME)

```
[ ] 1 Preparation
[ ] 2 Request triage       🛑
[ ] 3 Task‑Master update
[ ] 4 Note initialisation  🛑
[ ] 5 Research & planning  🛑
[ ] 6 User approval gate   🛑
[ ] 7 Run Sub‑Agents       🛑 as needed
[ ] 8 Wrap‑up & report     🛑
```