# Final Plan: Completing the Data Model Refactor

## Introduction

This document provides a definitive plan to complete the data model generation refactor. It synthesizes the goals of previous plans with the current, stable state of the codebase.

## Current Status Analysis

Initial analysis suggested the codebase was unstable due to recent refactoring. However, a comprehensive run of the test suite (`playerLivesBuilder.test.ts`, `playerRelationships.test.ts`, `teamCompositionBuilder.test.ts`, `teamfightBuilder.test.ts`, and the main `buildDataModel.test.ts`) shows that **all tests are currently passing.**

This indicates that the regressions and bugs identified in `statsplan_nextsteps.md` have already been resolved. The codebase is stable.

However, two key items from the original plans remain incomplete:

1.  **Structural Alignment (`refactor_plan.md`)**: The `playerStatBreakdown` logic has not been moved into its own dedicated subdirectory.
2.  **Statistical Validation (`statsplan.md`)**: The complex derived measures (e.g., `ultKills`, `teamfightsParticipated`) have been fully implemented in `baseStatCollection.ts`, but they lack specific, targeted unit tests to verify their correctness.

## The Path Forward: A Two-Phase Plan

With the codebase stable, we can proceed with the final stages of the refactor.

### Phase 1: Align the Code Structure

**Goal**: Complete the original structural vision from `refactor_plan.md` for better organization and clarity.

1.  **Create `playerStatBreakdown` Directory**:
    *   Create the directory: `src/lib/dataModel/playerStatBreakdown/`

2.  **Move Stat-Related Files**:
    *   Move the following files into the new directory:
        *   `baseStatCollection.ts`
        *   `statAggregation.ts`
        *   `derivedStatComputation.ts`
        *   `statRanking.ts`

3.  **Rename and Move the Orchestrator**:
    *   Move and rename `src/lib/dataModel/playerStatBreakdown.ts` to `src/lib/dataModel/playerStatBreakdown/index.ts`.

4.  **Update Import Paths**:
    *   Globally search for and update all import paths that are broken by these file moves. The primary file to update will be `src/lib/dataModel/index.ts`, which orchestrates the entire build process.

### Phase 2: Verify and Validate New Statistics

**Goal**: Ensure the correctness of the new, complex derived measures.

1.  **Create New Unit Tests**:
    *   Create a new test file: `src/lib/dataModel/playerStatBreakdown/baseStatCollection.test.ts`.
    *   In this file, write comprehensive unit tests for each of the 10 complex derived measure helper functions found in `baseStatCollection.ts` (e.g., `calculateUltKills`, `calculateTeamfightsParticipated`).
    *   These tests **must** mock the `dataModel` dependency to test the functions in isolation.
    *   The tests should cover a wide range of scenarios and edge cases to fully validate the logic.

2.  **Update and Verify Stage 3 Ratios**:
    *   Review `derivedStatComputation.ts`.
    *   Ensure that all derived ratios correctly use the newly available aggregated measures (e.g., `aggregatedBase.teamfightsWon`).
    *   Add targeted tests to `derivedStatComputation.test.ts` to verify the correctness of these ratio calculations.

3.  **Final Review**:
    *   Address any remaining `TODO` comments in the code, particularly in `derivedStatComputation.ts` for metrics like `ultimateChargeTime`.

## Success Metrics

*   All existing and new test suites pass without errors.
*   The final code structure matches the vision of `refactor_plan.md`.
*   All complex derived measures in `baseStatCollection.ts` have 100% test coverage and are proven to be accurate.
