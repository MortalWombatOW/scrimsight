# PRIME COMMAND

> **Audience:** The **Agent** (planner / orchestrator) and their disposable **Sub‑Agents** (executors).
> **Scope:** Defines the **only** acceptable workflow for every new user request.
> **Penalty for deviation:** Immediate removal from the project.

---

## 0 GROUND RULES

0.1 **Clean‑State Git Workflow**
  • **Always begin with `git status --porcelain`.** If the output is **not empty** (staged *or* unstaged changes), **abort** and notify the user.
  • Record the current branch name (e.g. `main`, `develop`) as the **Base Branch**.
  • From this point forward the Agent *may* run `git checkout -b`, `git add`, `git commit`, and `git push`, but **only** in those explicitly listed steps, and **never** rewrite history (`reset`, `rebase`, `push --force`, etc.).
  • All other standard Git‑safety principles still apply (no destructive commands).

0.2 **No Direct Code Changes Outside Commits** – Implementation details live in `/notes/*` and are committed in Stage 6; other commits solely capture Sub‑Agent work (Stage 7) and final wrap‑up (Stage 8).

0.3 **Single Source of Truth** – Keep `notes/`, `docs/`, and **Task‑Master** tasks perfectly in sync at all times.

0.4 **STOP‑QUESTIONS** – Whenever a step is marked **🛑 STOP & ASK**, immediately halt, ask the user, and wait for an explicit go‑ahead (e.g. *“Looks good, proceed”*).

0.5 **Delegation Principle** – The Agent **must not** execute domain work directly. Every concrete action (research, coding, doc editing, testing, etc.) is delegated to a single‑objective disposable Sub‑Agent. The Agent’s role is orchestration, quality‑control, and coordination only.

0.6 **Explicit‑Approval Guardrail** – Answers to clarification questions **never** count as plan approval. The workflow is locked such that:
  1. Clarifications → update notes.
  2. Research (by Sub‑Agents) → update notes.
  3. High‑level & implementation plan → update notes.
  4. **🛑 STOP at Step 5.5** and obtain user approval (“Approve plan”).
  5. Only after approval is recorded *and committed* may implementation begin.

---

## 1 PREPARATION PHASE

1.0 **Git Clean‑Slate Check**
  `git status --porcelain`
  • If output ≠ empty → abort & notify the user.
  • If empty → note the current branch name as `branch_name`.

1.1 Read `README.md` in the project root.
1.2 Read documentation:
  1.2.1 `docs/README.md`
  1.2.2 List files under `docs/` with `ls docs/`
  1.2.3 Read **all** files under `docs/`
1.3 Inspect repository structure with `git ls-files` (read‑only).
1.4 List tasks with `npx task-master list --with-subtasks`.
1.5 **🛑 STOP & ASK** the user for their request.

▶ *Note:* The **Base Branch** recorded here must appear later in the note file (§4).

---

## 2 REQUEST TRIAGE

2.1 Compare the user request with existing docs and tasks; decide whether it is
  • a **new task**,
  • a **sub‑task** of an existing task, or
  • **duplicate/invalid**.
2.2 **🛑 STOP & ASK** the user if the mapping is unclear.

---

## 2a BRANCH SET‑UP

2a.1 Construct a short, kebab‑case branch name:

```
{task-type}/{slug}
```

  — *task‑type* must be chosen from the table below.
  — *slug* is a concise summary of the task (≤ 4 words).

| Task‑type prefix | Appropriate when…                                      |
| ---------------- | ------------------------------------------------------ |
| **feat**         | Implementing a new feature or capability               |
| **fix**          | Correcting a bug or regression                         |
| **docs**         | Editing or adding documentation only                   |
| **chore**        | Routine maintenance, tooling, meta tasks               |
| **refactor**     | Re‑structuring code without changing behaviour         |
| **test**         | Adding or adjusting automated tests                    |
| **perf**         | Improving performance without functional change        |
| **build**        | Modifying build scripts or external dependencies       |
| **ci**           | Changing continuous‑integration configuration          |
| **style**        | Code formatting, white‑space, comments—no logic change |

2a.2 `git checkout -b {task-type}/{slug}`
2a.3 Record this working branch name in the notes file (§4).

---

## 3 TASK‑MASTER UPDATE

3.1 Use Task‑Master CLI to reflect the decision from Request Triage.
3.2 Record the current date/time with `date`.

---

## 4 NOTE INITIALISATION

4.1 Create `/notes/YYYY‑MM‑DD-task-<task-number>-<slug>.md` containing:

```markdown
## BACKGROUND
* <brief project status> — <YYYY-MM-DD HH:MM>
* Base branch: <branch_name>

## TASK
* Task <id>: <task name or subtask path>
* Working branch: {task-type}/{slug}

## SUMMARY
* <one‑sentence paraphrase of user request>

## OBJECTIVES
* <bullet list of measurable outcomes>

## CLARIFICATIONS
* (to be filled in Step 4.2)
```

4.2 **🛑 STOP & ASK** the user **at least three** clarification questions to confirm scope.
    • Append each Q\&A under `## CLARIFICATIONS`.
    • Save the file.

---

## 5 RESEARCH & PLANNING

5.0 **Pre‑condition:** All clarifications from 4.2 are answered and recorded.
5.1 Append a `## RESEARCH PLAN` section – bullet list of research questions.
5.2 For **each** research question:
  5.2.1 Spawn a Sub‑Agent to research and append findings to the note file under `### Findings: <question>`.
5.3 Review completeness; if gaps exist, loop 5.1–5.2 until satisfied.
5.4 Append:
  5.4.1 `## HIGH‑LEVEL PLAN` – bullet outline.
  5.4.2 `## IMPLEMENTATION` – ordered checklist (**each item = one Sub‑Agent action**).
5.5 **🛑 STOP & ASK** the user to **approve the plan** (this is the *only* approval gate that authorises implementation).
5.6 *If the user requests changes* → update notes accordingly and **return to 5.4**, then re‑ask for approval.

---

## 6 USER APPROVAL GATE — **Plan Snapshot Commit**

6.1 After the user approves, append to the note file:

```markdown
--- APPROVAL GRANTED ---
"<exact user message>"
```

6.2 **Immediately commit** the approved plan snapshot:

```bash
git add notes/ docs/ task-master.yml
git commit -m "docs: commit user‑approved implementation plan for task <id>"
```

6.3 Proceed to **Implementation Execution**.

---

## 7 IMPLEMENTATION EXECUTION — Per‑Task Commits

> **Delegation Principle Enforced**: **Every** checklist item is executed by its **own** disposable Sub‑Agent. The orchestrating Agent writes *no* functional code directly.

7.1 For each checklist item in `## IMPLEMENTATION`:

  7.1.1 Spawn a Sub‑Agent with a single, precise objective.
  7.1.2 Sub‑Agent executes and appends to `## IMPLEMENTATION LOG`:

```markdown
* <action> – <result/challenges>
```

  7.1.3 **Commit immediately**:

```bash
git add -A
git commit -m "<short: Sub‑Agent step – result>"
```

  7.1.4 On failure or major discovery → **🛑 STOP & ASK** the user before modifying the plan.

---

## 8 POST‑IMPLEMENTATION WRAP‑UP — Final Commit & Push

8.1 Report completion to the user and **🛑 STOP & ASK** for final approval.
8.2 Update documentation to reflect final status and knowledge gained.
  8.2.1 Update `notes/` with any high‑level learnings or findings. What would be critical to know about this task in the future?
  8.2.2 Update `docs/` with any changes due to the implementation.
  8.2.3 Update Task‑Master with any changes due to the implementation, such as marking a task as complete.
  8.2.4 Run `npm run build-graph` to update the codebase structure graph.
8.3 Push to GitHub and open a PR:

```bash
git add -A
git commit -m "final: complete task <id> – user‑approved wrap‑up"
git push -u origin {task-type}/{slug}
gh pr create --base {base-branch} \
              --head {task-type}/{slug} \
              --title "{short description of changes}" \
              --body  "Task {id}: {task-name}\n\n{detailed description of changes}"
```

In the PR description, do not mention that it was created by Claude.

---

## 9 CHECKLIST SUMMARY (PIN ME)

```
[ ] 1 Preparation (clean‑state Git)
[ ] 2 Request triage                         🛑
[ ] 2a Branch setup
[ ] 3 Task‑Master update
[ ] 4 Note initialisation                    🛑
[ ] 5 Research & planning                    🛑
      ↳ 5.5 User approval required
[ ] 6 Approval + commit plan snapshot        🛑
[ ] 7 Run Sub‑Agents & commit after each     🛑 as needed
[ ] 8 Wrap‑up, final commit & push           🛑
```
