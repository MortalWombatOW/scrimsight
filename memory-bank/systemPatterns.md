# System Patterns

*What is the system architecture? What are the key technical decisions and design patterns in use? How do components relate? What are the critical implementation paths?*

---


### Architecture Overview

*   **Client-Side Processing:** All data loading, parsing, calculation, and state management occur within the user's browser. There is no backend database or server-side processing for core features in v1.
*   **State Management:** Jotai is used for global state management. Data is processed and flows through a graph of Jotai atoms, starting from raw file content to derived statistics and UI-ready summaries. This promotes modularity and maintainability (NFR-4.4).
*   **Component-Based UI:** The user interface is built with React components, organized by feature/page (e.g., `pages/`, `components/`).

### Data Flow & Processing

1.  **Input:** Users provide `.txt` log files (ScrimTime  format) via file input, directory selection (Chrome-based), or drag-and-drop (`AddFilesPage`, FR-3.1).
2.  **Parsing:** Files are read client-side, and each line is parsed into a structured event object based on `scrimtime.ts` (`LOG_SPEC`) (FR-3.2.1, FR-3.2.2). Basic error handling is included (FR-3.2.5). A unique `matchId` is generated per file (FR-3.2.3). Timestamps are converted to seconds (FR-3.2.4).
3.  **Core Aggregation (Jotai Atoms):**
    *   Raw events are processed by initial atoms (e.g., `fileDataAtom`, `parsedLogsAtom`).
    *   Base statistics and match/round timings are calculated (e.g., `mapTimesAtom`, `roundTimesAtom`, `matchDataAtom`, `playerStatExpandedAtom`).
    *   Data is grouped and aggregated (e.g., `scrimAtom`, `teamNamesAtom`, `uniquePlayerNamesAtom`, `teamStatsAtom`).
4.  **Derived Statistics & Analysis (Jotai Atoms):**
    *   Further calculations produce derived metrics (e.g., per-10 stats, KDA, accuracy - FR-3.4.3, FR-3.4.4, FR-3.4.5).
    *   Specific event sequences are analyzed (e.g., player lives, ultimate usage, teamfights - FR-3.4.6, FR-3.4.7, FR-3.6.1).
    *   Contextual statistics are generated (e.g., stats per scrim, per team, per player - FR-3.4.10).
    *   Team-level analysis is performed (e.g., win rates by map, composition tracking - FR-3.5.1, FR-3.5.2).
    *   Match-specific analysis like Kill Matrices are generated (FR-3.6.4).
5.  **UI Rendering:** React components consume the state from Jotai atoms to display statistics, tables, charts, and navigation elements across various pages (FR-3.7).

### Key Design Patterns & Decisions

*   **Atomistic State (Jotai):** Enables fine-grained dependency tracking and efficient updates. Facilitates modularity and testability. Core principle (2. Core Principles - Modularity).
*   **Client-Side Focus (v1):** Simplifies deployment (static hosting) but introduces potential performance limitations with large datasets (NFR-4.1, NFR-4.5, Risk 9).
*   **Workshop Code Dependency:** Tightly coupled to the ScrimTime (DKEEH) log format (DR-5.1). Changes to the workshop code could break parsing.
*   **Progressive Disclosure:** UI likely presents summaries first (Homepage, List pages) and allows users to drill down into details (Detail pages).
*   **Contextual Data Views:** Atoms are designed to provide statistics filtered by different contexts (overall, per scrim, per team, per player, per match).

### Critical Implementation Paths

*   **Log Parsing (`scrimtime.ts`, `files/` atoms):** Accuracy is paramount (Core Principle). Must be robust to variations/errors in logs.
*   **Core Data Aggregation Atoms:** Foundation for all derived stats. Logic must be correct.
*   **Derived Statistic Atoms (e.g., `teamfightsAtom`, `playerLivesAtom`, `detailedTeamCompositionsAtom`):** Complex logic requiring careful implementation and validation.
*   **Timeline Visualization (`Timeline` component):** Identified as potentially high-effort (Risk 9).
*   **Authentication Flow (OIDC):** Needs secure and correct implementation (FR-3.8, NFR-4.3).
