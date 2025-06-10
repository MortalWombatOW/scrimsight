# Raising a GitHub Issue

> **Audience:** Agents & Sub‑Agents  
> **Goal:** File an Issue that is instantly actionable, linkable in `/notes/`, and compatible with the Git workflow defined in the Prime Command.

---

## 0 Prerequisites

1. **GitHub CLI** (`gh` ≥ 2.50) installed and authenticated. :contentReference[oaicite:0]{index=0}  
2. Repository has the label set in §3 and the Issue‑form templates in `.github/ISSUE_TEMPLATE/`.

---

## 1 Prepare a Draft Locally (optional)

Create `draft.md` with the structured headings shown in the template that matches your case (“Bug Report”, “Feature Request”, “Docs Update”). Use a text editor so you can spell‑check and link screenshots.

---

## 2 Create the Issue via CLI

```bash
# Syntax
gh issue create \
  --title "feat: concise summary (≤ 60 chars)" \
  --body-file draft.md \          # or --body "Free‑text"
  --label "feat,inbox" \          # multiple, comma‑separated
  --assignee @me \                # or specific login(s)
  --milestone "Sprint Q3‑WK02"    # if known
```

CLI flags match one‑for‑one with the form fields defined below. 

If you need to update after submission (e.g., add labels or milestone):
```bash
gh issue edit <number> --add-label "investigation"
```

## 3 Label Taxonomy (keep tidy & semantic)
For the complete list of standard issue labels and their purposes, see [PRIME COMMAND Appendix A](../.claude/commands/ghprime.md#appendix-a--standard-issue-labels).

Manage labels via gh label API.