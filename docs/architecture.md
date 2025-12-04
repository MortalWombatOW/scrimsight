# Architecture & State Management

Scrimsight uses a **Layered Architecture** to separate concerns between raw data storage, business logic, and UI presentation.

---

## The Three Layers

### 1. Data Layer (`src/data`)
**Responsibility:** Storage, persistence, and ingestion.
* **Repositories:** Atoms that hold the "Source of Truth" (e.g., `matchesRepositoryAtom`).
* **Ingestors:** Functions that parse raw text files into structured JSON objects.
* **Types:** Raw entity definitions (DTOs) from the logs.

*Rule:* This layer should not contain complex business logic or UI code.

### 2. Domain Layer (`src/domain`)
**Responsibility:** Business logic and derived knowledge.
* **Pure Functions:** Algorithms that calculate stats, detect team fights, or group matches into scrims.
* **Testability:** These files are pure TypeScript and easy to unit test without mocking React or Atoms.

*Example:* `detectScrims(matches)` takes a list of matches and returns grouped Scrim objects.

### 3. Hook/Facade Layer (`src/hooks`)
**Responsibility:** Connecting Data/Domain to React.
* **Facades:** Hooks like `useScrims()` use `useAtomValue` to read from the repository, apply domain functions, and return ready-to-render data.
* **Abstraction:** Components never import atoms directly; they import hooks.

---

## Data Flow Example

When a user opens the "Scrims" page:

1.  **Repository**: `matchesRepositoryAtom` contains all loaded match data.
2.  **Hook**: `useScrims()` is called by the page.
    * It reads the matches from the repository.
    * It imports `detectScrims` from `src/domain/scrims`.
    * It memoizes the result of `detectScrims(matches)`.
3.  **UI**: `ScrimsPage.tsx` receives a list of `Scrim` objects and renders them.

