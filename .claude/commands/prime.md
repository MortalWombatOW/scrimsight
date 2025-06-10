# PRIME COMMAND 

> **Audience:** The **Agent** (planner/orchestrator) and their disposable **Sub‑Agents** (executors).  
> **Scope:** Exact, repeatable workflow for handling every new user request.  
> **Penalty for deviation:** Immediate removal from the project.

---

## 0 GROUND RULES

0.1 **Clean‑State Git Workflow**  
 • **Always begin with `git status --porcelain`.** If the output is **not empty** (staged or unstaged changes), abort the workflow and inform the user.  
 • Record the current branch name (e.g., `main`, `dev`) as the **Base Branch**.  
 • From this point forward the Agent *may* run `git checkout -b`, `git add`, `git commit`, and `git push`, but **only** in the explicitly listed steps below and **never** rewrite history (`reset`, `rebase`, `push --force`, etc.).  
 • All other original Git‑safety principles still apply (no destructive commands).

0.2 **No Direct Code Changes Outside Commits** – Implementation details live in `/notes/*` and are captured in commits at Stages 6 and 7.

0.3 **Single Source of Truth** – Keep `notes/`, `docs/`, and **GitHub Issues** perfectly in sync.

0.4 **STOP‑QUESTIONS** – Whenever a step is marked **🛑 STOP & ASK**, immediately pause, ask the user, and await an explicit go‑ahead (`"Looks good, proceed"` or similar).

---

## 1 PREPARATION PHASE

1.0 **Git Clean‑Slate Check**  
 `git status --porcelain`  
 • If output ≠ empty → abort & notify the user.  
 • If empty → note the current branch name as `branch_name`.

1.1 Read `README.md` in the project root.  
1.2 Read documentation:  
 1.2.1 `docs/README.md`  
 1.2.2 List files under `docs/` with `ls docs/`  
 1.2.3 Read all files under `docs/`  
1.3 Inspect repository structure with `git ls-files` (read‑only).  
1.4 Review task state with the GitHub CLI:  

```bash
gh issue list --json number,title,labels
````

1.5 **🛑 STOP & ASK** the user for their request.

*Note:* The **Base Branch** recorded here must appear later in the note file (§4).

---

## 2 REQUEST TRIAGE

2.1 Compare the request with existing docs and **open GitHub Issues**; decide whether it is
 • a new Issue,
 • a follow‑up / sub‑task of an existing Issue, or
 • duplicate / invalid.

2.2 **🛑 STOP & ASK** the user if the mapping is unclear.

---

## 2a BRANCH SET‑UP

2a.1 Build a short, kebab‑case branch name:

```
{task-type}/{slug}
```

— *task‑type* must be chosen from the table below.
— *slug* is a concise summary of the task (max 4 words).

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
| **research**     | Time‑boxed research investigation                      |

2a.2 `git checkout -b {task-type}/{slug}`
2a.3 Record this branch name in the notes file (§4).

---

## 3 GITHUB ISSUE UPDATE

3.1 **Create or update** the Issue via CLI:

*If creating new:*

```bash
gh issue create \
  --title "feat: concise summary" \
  --body-file draft.md \
  --label "feat,inbox" \
  --assignee @<github‑user>
```

*If mapping to an existing Issue (`#<num>`):*

```bash
gh issue edit <num> --add-label "in-progress" --remove-label "inbox"
```

3.2 Record the current date/time with `date`.
3.3 Copy the Issue URL (e.g., `https://github.com/<org>/<repo>/issues/<num>`).

---

## 4 NOTE INITIALISATION

4.1 Create `/notes/YYYY-MM-DD-task-<issue-num>-<slug>.md` containing:

```markdown
## BACKGROUND
* <brief project status> — <YYYY-MM-DD HH:MM>
* Base branch: <branch_name>

## TASK
* Issue: https://github.com/<org>/<repo>/issues/<num>
* Working branch: {task-type}/{slug}

## SUMMARY
* <one‑sentence paraphrase of user request>

## OBJECTIVES
* <bullet list of measurable outcomes>
```

4.2 **🛑 STOP & ASK** the user at least 3 clarification questions to confirm scope. Update the notes file with the answers.

---

## 5 RESEARCH & PLANNING

5.1 Append to the note file a `## RESEARCH PLAN` section with a bullet list of research questions.
5.2 For **each** research question:
 5.2.1 Dispatch a Sub‑Agent to research and append findings to the note file.
5.3 Review the note file; confirm the research plan is complete.
5.4 Append:
 5.4.1 `## HIGH‑LEVEL PLAN` – bullet outline.
 5.4.2 `## IMPLEMENTATION` – ordered checklist (each item = one Sub‑Agent).
5.5 **🛑 STOP & ASK** the user to approve the plan.

---

## 6 USER APPROVAL GATE — **Plan Snapshot Commit**

6.1 After the user approves, append to the note file:

```markdown
--- APPROVAL GRANTED ---
"<exact user message>"
```

6.2 **Immediately commit the approved plan**:

```bash
git add notes/ docs/
git commit -m "docs: commit user‑approved implementation plan for Issue #<num>"
```

6.3 Proceed to Implementation Execution.

---

## 7 IMPLEMENTATION EXECUTION — Per‑Task Commits

7.1 For **each** checklist item in `## IMPLEMENTATION`:

 7.1.1 Spawn a **Sub‑Agent** with a single, precise objective.
 7.1.2 Sub‑Agent executes and appends a line to `## IMPLEMENTATION LOG` in the note:

```markdown
* <action> – <result/challenges>
```

 7.1.3 **Commit immediately**:

```bash
git add -A
git commit -m "<short: Sub‑Agent step – result> (refs #<num>)"
```

 7.1.4 On failure or major discovery → **🛑 STOP & ASK** the user before adjusting the plan.

---

## 8 POST‑IMPLEMENTATION WRAP‑UP — Final Commit & Push

8.1 Report completion to the user and **🛑 STOP & ASK** for final approval.
8.2 Update `notes/` and `docs/` with any final updates.
8.3 Push to GitHub and create a PR for review (auto‑closes the Issue):

```bash
git add -A
git commit -m "final: complete Issue #<num> – user‑approved wrap‑up"
git push -u origin {task-type}/{slug}

gh pr create \
  --base {base-branch} \
  --head {task-type}/{slug} \
  --title "Resolve #{num}: <short description>" \
  --body  "Closes #<num>\n\n<detailed description of changes>"
```

*(“Closes #<num>” ensures GitHub auto‑closes the Issue on merge.)*

Do **not** close the Issue manually.
Do **not** say that it was written by Claude.

---

## 9 CHECKLIST SUMMARY (PIN ME)

```
[ ] 1 Preparation (clean‑state Git)
[ ] 2 Request triage                         🛑
[ ] 2a Branch set‑up
[ ] 3 GitHub Issue update
[ ] 4 Note initialisation                    🛑
[ ] 5 Research & planning                    🛑
[ ] 6 Approval + commit plan snapshot        🛑
[ ] 7 Run Sub‑Agents & commit after each     🛑 as needed
[ ] 8 Wrap‑up, final commit & push           🛑
```

---

### Appendix A — Standard Issue Labels

*For detailed guidance on creating GitHub issues, see [docs/github-issues-guide.md](../docs/github-issues-guide.md).*

| Label           | Purpose                                   |
| --------------- | ----------------------------------------- |
| **bug**         | Incorrect behaviour                       |
| **feat**        | New feature / capability                  |
| **docs**        | Documentation change                      |
| **refactor**    | Code restructuring without behavior change |
| **test**        | Adding or adjusting automated tests       |
| **perf**        | Performance improvements                  |
| **build**       | Build system or dependency changes        |
| **ci**          | CI/CD configuration changes              |
| **style**       | Code formatting/style changes            |
| **chore**       | Tooling / meta / infra                    |
| **research**    | Time‑boxed research task                  |
| **question**    | Support / clarification                   |
| **inbox**       | Newly filed, awaiting triage              |
| **in‑progress** | Being actively worked on                  |
| **blocked**     | Waiting on external dependency / decision |
| **done**        | Completed & closed                        |

---

#### Remember

* **Always reference the Issue number** (`#<num>`) in commits and PRs.
* **/notes/** captures all context; the Issue thread shows task state.
* **CLI first**—avoid GitHub web UI unless reviewing or merging.

Happy shipping! 🚀
