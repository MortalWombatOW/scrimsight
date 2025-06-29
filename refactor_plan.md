# Refactoring the Scrimsight Data Model Builder: A Path to Clarity and Maintainability

## Introduction

The `src/lib/buildDataModel.ts` file has grown significantly, becoming a monolithic component responsible for parsing raw log data, building relationships, and computing a wide array of player statistics. While functional, its size and complexity hinder readability, maintainability, and testability. As we continue to evolve our statistical models, particularly with the introduction of granular derived measures, it's imperative to refactor this core component into a more modular and semantically focused structure.

This post outlines a plan to break down `buildDataModel.ts` into smaller, independent modules, each responsible for a specific aspect of the data model construction. This modularization will improve code organization, facilitate easier understanding of individual components, and enable more targeted unit testing.

## The Problem with Monoliths

A large, single file like `buildDataModel.ts` presents several challenges:

*   **Cognitive Load**: Understanding the entire data flow requires comprehending hundreds of lines of interconnected logic.
*   **Maintainability**: Changes in one part of the file can have unintended side effects elsewhere, making modifications risky.
*   **Testability**: Unit testing specific functions within the file is difficult due as they are tightly coupled to the overall `dataModel` object and other internal helpers.
*   **Reusability**: Individual pieces of logic are not easily reusable outside the context of the main `buildDataModel` function.

## Proposed Refactored Structure

Our goal is to create a `src/lib/dataModel/` directory containing several new files, each encapsulating a distinct logical domain. The main `buildDataModel` function will then act as an orchestrator, importing and coordinating these smaller, focused modules.

Here's the proposed new file structure:

```
src/lib/dataModel/
├── index.ts                      // New main entry point for buildDataModel
├── eventExtraction.ts            // Handles extracting all log events
├── scrimRelationships.ts         // Builds scrim relationships
├── matchRelationships.ts         // Builds match relationships
├── teamRelationships.ts          // Builds team relationships
├── playerRelationships.ts        // Builds player relationships
├── playerLivesBuilder.ts         // Builds player life segments
├── teamfightBuilder.ts           // Builds teamfight data and related helpers
├── roundBuilder.ts               // Builds round data
├── teamCompositionBuilder.ts     // Builds team composition data
├── killCountBuilder.ts           // Builds kill count data
└── playerStatBreakdown/          // Subdirectory for player stat computation
    ├── index.ts                  // Orchestrates the three stages of stat computation
    ├── baseStatCollection.ts     // Handles Stage 1: Base Stats + Derived Measures Collection
    ├── statAggregation.ts        // Handles Stage 2: Aggregation
    ├── derivedStatComputation.ts // Handles Stage 3: Derived Ratios Computation
    └── statRanking.ts            // Handles stat ranking
```

### Responsibilities of New Modules:

*   **`eventExtraction.ts`**: Will contain the `extractAllEvents` function.
*   **`*Relationships.ts`**: Each file will contain its respective `build*Relationships` function.
*   **`*Builder.ts`**: Each file will contain its respective `build*` function (e.g., `buildPlayerLives`, `buildTeamfights`, `buildRounds`, `buildTeamCompositions`, `buildKillCounts`). Complex builders like `teamfightBuilder.ts` will also house their internal helper functions (e.g., `createTeamfight`, `getPlayersAliveAtTime`).
*   **`playerStatBreakdown/index.ts`**: This file will contain the main `buildPlayerStatBreakdown` function, orchestrating the three stages by importing from its sibling modules.
*   **`playerStatBreakdown/baseStatCollection.ts`**: Will contain the logic for "STAGE 1: Base Stats + Derived Measures Collection," including the `calculatePlaytime` helper and any new helpers for granular derived measures (e.g., `calculateTeamfightsParticipated`, `calculateTeamfightsWon`).
*   **`playerStatBreakdown/statAggregation.ts`**: Will contain the `aggregateBaseStats` function.
*   **`playerStatBreakdown/derivedStatComputation.ts`**: Will contain the `computeDerivedStats` function, focusing solely on calculating derived ratios.
*   **`playerStatBreakdown/statRanking.ts`**: Will contain `rankValues` and `buildPlayerStatBreakdownRanks`.

## Updated Testing Strategy

Refactoring the codebase necessitates a refined testing strategy to ensure both the correctness of individual modules and the integrity of the overall data model build process.

1.  **Retain `buildDataModel.test.ts` as an Integration Test**:
    *   The existing `src/lib/buildDataModel.test.ts` file is invaluable as an end-to-end integration test. It verifies that the entire data model construction pipeline, from raw logs to final aggregated and derived statistics, functions correctly.
    *   This file will be updated to import the new `buildDataModel` function from `src/lib/dataModel/index.ts`. Its tests will continue to assert the correctness of the final `ScrimsightDataModel` output.
    *   This provides a crucial safety net, ensuring that the refactoring doesn't introduce regressions in the overall system behavior.

2.  **Introduce New Unit Tests for Each Module**:
    *   For each new file created (e.g., `src/lib/dataModel/teamfightBuilder.ts`, `src/lib/dataModel/playerStatBreakdown/derivedStatComputation.ts`), a corresponding unit test file will be created (e.g., `src/lib/dataModel/teamfightBuilder.test.ts`, `src/lib/dataModel/playerStatBreakdown/derivedStatComputation.test.ts`).
    *   These unit tests will focus on verifying the functionality of the specific module in isolation.
    *   **Mocking Dependencies**: Where a module depends on data or functions from other parts of the `dataModel` (e.g., `teamfightBuilder` depends on `dataModel.kill` and `dataModel.playerLives`), these dependencies will be mocked. This allows for precise testing of the module's logic without being affected by potential issues or complexities in other modules.
    *   **Example**: `teamfightBuilder.test.ts` would provide mock `kill` events and `playerLives` data to test how `buildTeamfights` correctly identifies teamfight periods and calculates their properties. `derivedStatComputation.test.ts` would receive mock `aggregatedBase` data and test the accuracy of ratio calculations.
    *   This granular testing approach will make it significantly easier to pinpoint the source of bugs and ensure the correctness of each refactored component.

## Benefits of This Approach

*   **Improved Readability**: Smaller, focused files are easier to read and understand.
*   **Enhanced Maintainability**: Changes are localized to specific modules, reducing the risk of introducing bugs elsewhere.
*   **Better Testability**: Dedicated unit tests for each module allow for more precise and efficient testing.
*   **Increased Reusability**: Individual modules can potentially be reused in other contexts if needed.
*   **Clearer Separation of Concerns**: Each file has a single, well-defined responsibility.

This refactoring effort is a crucial step towards a more robust, scalable, and developer-friendly codebase.

---
## Comments and Review

**Senior Reviewer**: This is a solid plan, Implementer. The modular breakdown looks logical and addresses the core issues of complexity and testability. I particularly like the clear distinction between the orchestrator `index.ts` files and the specific builders/calculators.

A few initial thoughts/questions:

1.  **Dependency Management**: How will you manage dependencies between these new modules? For instance, `playerStatBreakdown/baseStatCollection.ts` will need access to `playerLives` and `teamfights`. Will these be passed as arguments, or will the `dataModel` object itself be passed around? We need to ensure we don't re-introduce tight coupling through implicit dependencies.
2.  **Helper Functions**: Many of the current helper functions (e.g., `getRoundIndexForTime`, `getPlayersAliveAtTime` within `buildDataModel.ts`) are currently defined globally or within `createTeamfight`. Where will these helpers reside in the new structure? Should they be part of the module that primarily uses them, or should some be extracted into a `utils.ts` if they are truly generic?
3.  **Error Handling**: Will this refactoring impact our current error handling strategy? Should we consider adding more specific error types or validation within these new modules?
4.  **Performance**: While modularity is key, we should keep an eye on potential performance impacts due to increased function calls or data passing. Have you considered this?

**Implementer**: Thanks for the feedback!

1.  **Dependency Management**: The `dataModel` object will continue to be the primary mechanism for passing data between these modules. Each builder function (e.g., `buildPlayerLives`, `buildTeamfights`) will take the `dataModel` as an argument and modify/populate relevant sections of it. This keeps the top-level `buildDataModel` function clean as an orchestrator, and each sub-builder can access the necessary raw data or previously built relationships from the `dataModel`. For the `playerStatBreakdown` sub-modules, the `aggregatedBase` will be passed explicitly, and the `dataModel` will still be available for context-dependent calculations (like `ultimateChargeTime` or `averageLifeDuration` which need raw events). This balances explicit data flow with access to the full context when needed.

2.  **Helper Functions**: Good point. My current thinking is:
    *   **Module-Specific Helpers**: Helpers that are *only* used by a single module (e.g., `createTeamfight` and its direct dependencies like `getPlayersAliveAtTime` within `teamfightBuilder.ts`) will reside within that module's file and not be exported. This keeps them encapsulated.
    *   **Shared Helpers**: For truly generic helpers that might be used across multiple modules (e.g., `getRoleFromHero` from `hero.ts`, or potentially a new `getRoundIndexForTime` if it's needed widely), they will be placed in a `src/lib/utils/` directory or an existing `src/lib/` file if semantically appropriate, and explicitly imported. I'll review the usage of existing helpers during implementation to make this decision.

3.  **Error Handling**: This refactoring provides an excellent opportunity to improve error handling. Currently, many functions might return `0` or `null` on invalid input. With modularization, we can introduce more specific error types or throw exceptions for invalid states within each module. This will make debugging easier and ensure data integrity. I'll propose specific error handling improvements as part of the implementation phase for each module.

4.  **Performance**: I've considered this. The primary performance concern would be excessive data copying or redundant computations. By passing the `dataModel` object by reference (as is typical in JavaScript/TypeScript for objects), we avoid deep copying. The modularization itself doesn't inherently add overhead; it's more about organizing existing logic. The key is to ensure that the new helper functions (especially for derived measures in Stage 1) are efficient and don't re-process large datasets unnecessarily. We'll monitor performance during development and testing, and optimize specific modules if bottlenecks are identified. The current use of `remeda` for functional programming patterns already promotes efficient data processing.

**Senior Reviewer**: That's a comprehensive response, Implementer. I'm satisfied with the dependency management and helper function strategy. Encapsulating module-specific helpers is definitely the way to go.

Regarding error handling, I agree this is a great opportunity. Let's make it a point to explicitly define error handling strategies for each new module during its implementation. For instance, if a builder receives malformed input, how should it respond? Throw an error, return an empty array, or log a warning? Consistency here will be important.

On performance, your points are valid. The `remeda` library is indeed a good foundation. We should prioritize correctness and clarity during the initial refactoring, and then profile for performance bottlenecks if they arise.

One final thought: How will you manage the `ScrimsightDataModel` interface itself? Will it remain a single large interface, or will it also be broken down to reflect the modularity of the builders? For example, `MatchRelationships` is built by `matchRelationships.ts`. Should `ScrimsightDataModel` import `MatchRelationships` from that module, or will `ScrimsightDataModel` remain the central definition of the entire data shape?

**Implementer**: That's a crucial question, Senior Reviewer. For now, I propose keeping `ScrimsightDataModel.ts` as the central source of truth for the overall data shape. Breaking it down further could lead to circular dependencies or make it harder to get a holistic view of the entire data model.

The individual builder modules (e.g., `matchRelationships.ts`) will import and use the types defined in `ScrimsightDataModel.ts` (e.g., `ScrimsightDataModel.MatchRelationships`). This maintains a clear hierarchy: `ScrimsightDataModel.ts` defines the *structure*, and the builder modules *implement* the population of that structure.

If, in the future, we find that certain parts of `ScrimsightDataModel.ts` become too large or complex, we can revisit breaking it down. But for this refactoring phase, keeping it centralized seems like the most pragmatic approach to avoid introducing new complexities in type management.

**Senior Reviewer**: Agreed. Let's keep `ScrimsightDataModel.ts` as the central type definition for now. Pragmatism over premature optimization, especially with type definitions. This plan looks solid. Proceed with the implementation, and let's ensure we adhere to the TDD principles throughout. I'll be looking for those new unit tests!

