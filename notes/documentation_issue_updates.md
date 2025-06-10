# Documentation and Issue Template Analysis Report

**Date:** 2025-06-09  
**Scope:** Analysis of task/issue type consistency across `.claude/commands/ghprime.md`, `docs/*.md`, and `.github/ISSUE_TEMPLATE/*.md`

## Executive Summary

This analysis reveals **significant inconsistencies** in task and issue type definitions across the documentation. While GitHub issue templates do exist, there are major gaps between the defined task types and available templates, plus conflicting label taxonomies across documents.

## Critical Issues Found

### 1. Incomplete Issue Template Coverage
- **Existing Templates:** 4 templates found
  - `bug_report.yml` (maps to "fix" task type)
  - `feature_request.yml` (maps to "feat" task type) 
  - `docs_improvement.yml` (maps to "docs" task type)
  - `research_spike.yml` (maps to "spike" task type)
- **Missing Templates:** 7 task types lack corresponding issue templates
  - refactor, test, perf, build, ci, style, chore

### 2. Task Type vs Issue Label Inconsistencies

**Task-type prefixes** (from `.claude/commands/ghprime.md` lines 72-84):
- feat, fix, docs, chore, refactor, test, perf, build, ci, style, spike

**Issue labels** (from `.claude/commands/ghprime.md` Appendix A, lines 238-249):
- bug, feat, docs, chore, spike, question, inbox, in-progress, blocked, done

**Issue labels** (from `docs/github-issues-guide.md` lines 41-54):
- bug, feat, docs, refactor, test, research, chore, question, inbox, in-progress, blocked, done

#### Specific Conflicts:
1. **"fix" vs "bug"**: Task type uses "fix" but labels use "bug"
2. **Missing labels**: No labels for task types: perf, build, ci, style
3. **Extra labels**: "research" label exists but no corresponding task type
4. **Inconsistent definitions**: Different label sets between documents

### 3. Coverage Gaps

**Task types without corresponding issue templates:**
- refactor, test, perf, build, ci, style, chore (7 missing templates)

**Task types without corresponding issue labels:**
- refactor (missing in ghprime.md Appendix A)
- test (missing in ghprime.md Appendix A)  
- perf (missing in both)
- build (missing in both)
- ci (missing in both)
- style (missing in both)

**Issue labels without corresponding task types:**
- research (in github-issues-guide.md only)
- question (workflow/status label, not a task type)

**Existing templates use correct labels:**
- bug_report.yml → ["bug", "inbox"] ✅
- feature_request.yml → ["feat", "inbox"] ✅
- docs_improvement.yml → ["docs", "inbox"] ✅
- research_spike.yml → ["spike", "inbox"] ✅

### 4. Duplicated Information with Discrepancies

The label taxonomy appears in **two different documents** with **different content**:

#### `.claude/commands/ghprime.md` Appendix A (lines 238-249):
```
bug, feat, docs, chore, spike, question, inbox, in-progress, blocked, done
```

#### `docs/github-issues-guide.md` (lines 41-54):
```
bug, feat, docs, refactor, test, research, chore, question, inbox, in-progress, blocked, done
```

**Key Differences:**
- github-issues-guide.md includes: refactor, test, research
- Both should have identical content for consistency

### 5. Workflow Integration Problems

The PRIME COMMAND workflow expects:
- Issue templates for each task type (step 3.1)
- Consistent labeling between branch names and issue labels
- Automated issue creation via `gh issue create` with proper labels

**Current state blocks this workflow entirely.**

## Recommended Solutions

### Phase 1: Establish Single Source of Truth
1. **Consolidate task/issue types** into one definitive list
2. **Choose consistent naming** (recommend aligning with conventional commits)
3. **Update all documentation** to reference the single source

### Phase 2: Create Missing Infrastructure  
1. **Create 7 additional issue templates** for missing task types
2. **Implement proper GitHub label management**
3. **Ensure consistent template structure** across all templates

### Phase 3: Eliminate Duplication
1. **Remove duplicate label definitions**
2. **Establish documentation hierarchy** (ghprime.md → docs/ → issue templates)
3. **Add cross-references: ghprime.md should link to docs/github-issues-guide.md for details**

## Proposed Task/Issue Type Taxonomy

**Recommend standardizing on these types with both task-type prefix AND issue label:**

| Type | Branch Prefix | Issue Label | Description | Issue Template Status |
|------|--------------|-------------|-------------|---------------------|
| feat | feat | feat | New feature or capability | ✅ EXISTS |
| fix | fix | bug | Bug fix or correction | ✅ EXISTS |
| docs | docs | docs | Documentation changes | ✅ EXISTS |
| research | research | research | Time-boxed research investigation | ✅ EXISTS (needs rename from spike) |
| refactor | refactor | refactor | Code restructuring without behavior change | ❌ MISSING |
| test | test | test | Adding or adjusting tests | ❌ MISSING |
| perf | perf | perf | Performance improvements | ❌ MISSING |
| build | build | build | Build system or dependency changes | ❌ MISSING |
| ci | ci | ci | CI/CD configuration changes | ❌ MISSING |
| style | style | style | Code formatting/style changes | ❌ MISSING |
| chore | chore | chore | Maintenance/tooling tasks | ❌ MISSING |

**Status labels (not task types):**
- question, inbox, in-progress, blocked, done

## Files Requiring Updates

### Priority 1 (Critical)
1. **Create:** 7 missing issue templates in `.github/ISSUE_TEMPLATE/` directory
2. **Update:** `.claude/commands/ghprime.md` Appendix A to match proposed taxonomy
3. **Update:** `docs/github-issues-guide.md` to remove duplicate taxonomy and reference ghprime.md

### Priority 2 (Important)  
4. **Update:** `.claude/commands/ghprime.md` task-type table to use "fix" → "bug" consistently
5. **Add:** Missing task types to issue label system
6. **Remove:** Research label or add corresponding research task type

### Priority 3 (Cleanup)
7. **Review:** All other docs files for consistency
8. **Add:** Cross-references between documents
9. **Update:** Any examples or references to align with new taxonomy

## Implementation Order

**This analysis recommends implementing changes in this specific order:**

1. **Get approval** on proposed task/issue type taxonomy
2. **Rename spike → research and create 6 missing GitHub issue templates** for task types: refactor, test, perf, build, ci, style, chore
3. **Update `.claude/commands/ghprime.md`** to align with approved taxonomy
4. **Update `docs/github-issues-guide.md`** to reference ghprime.md instead of duplicating
5. **Verify workflow integration** works end-to-end
6. **Clean up remaining inconsistencies** in other documentation

## Impact Assessment

**Without these fixes:**
- Contributors can only create 4 types of issues (missing 7 task types)
- Issue creation and labeling will be inconsistent
- Branch naming conventions won't align with issue management for 7 task types
- Project management and tracking will be compromised for maintenance work

**With these fixes:**
- Clear, consistent workflow for all contributors
- Automated issue management via GitHub CLI
- Proper categorization and tracking of all work
- Reduced confusion and improved developer experience

---

**Status:** Ready for review and approval before implementation
**Next Steps:** Await user approval to begin implementing the recommended changes