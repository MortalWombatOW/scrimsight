# Tech Context

*What technologies are used? What is the development setup? Are there technical constraints or dependencies? What are the common tool usage patterns?*

---

### Core Technologies

*   **Frontend Framework:** React
*   **Language:** TypeScript
*   **State Management:** Jotai
*   **Styling:** Tailwind CSS with DaisyUI (specifically the "scrimsight" theme - UIX-6.1)
*   **Build Tool:** Vite (DO-7.1)
*   **Authentication:** Discord OpenID Connect (OIDC) via `react-oidc-context` library (FR-3.8, NFR-4.3)
*   **Charting Library:** Recharts (for visualizations) or custom components
*   **Payment Processing:** Stripe

### Dependencies & Constraints

*   **Data Source:** Exclusively supports `.txt` log files from the "ScrimTime" Overwatch workshop code (DKEEH) (DR-5.1). The application's accuracy is dependent on the reliability and format consistency of these logs (Risk 9).
*   **Platform:** Browser-based, client-side application (Architecture Overview in systemPatterns.md).
*   **Browser APIs:** Relies on standard File API (`<input type="file">`) and potentially the File System Access API for directory selection (FR-3.1.2), which has limited browser support (primarily Chrome - Risk 9). Drag and Drop API is also used (FR-3.1.4).
*   **Authentication Provider:** Discord via OIDC (FR-3.8.1). Requires Discord account for users.
*   **Performance:** Client-side processing limits scalability based on user's machine resources and browser capabilities, especially with large log volumes (NFR-4.1, NFR-4.5, Risk 9).

### Development & Setup

*   **Environment Variables:** OIDC configuration (Client ID, secrets, URIs) and potentially other settings must be managed via environment variables (FR-3.8.5, DO-7.2).
*   **Code Quality:** Adherence to TypeScript best practices and code consistency is expected (NFR-4.4). Linting/formatting tools (like ESLint, Prettier - inferred from typical React/TS setups) are likely used.
*   **Testing:** Basic accessibility testing (UIX-6.4) and likely unit/integration tests for atoms and components are needed for maintainability (NFR-4.4). Automated testing via CI/CD is desired (DO-7.4).

### Deployment

*   **Hosting:** Static web hosting platform (Cloudflare)
*   **Build Process:** Production builds generated using Vite (DO-7.1).
*   **CI/CD:** Pipeline for automated testing and deployment is provided by Github.

### Tool Usage Patterns

*   **State Management:** Heavy reliance on Jotai atoms for managing application state, from raw data to complex derived statistics. Understanding atom dependencies and creation patterns (`atom`, `atomFamily`, derived atoms) is crucial.
*   **Component Structure:** Follows standard React patterns (functional components, hooks). Components are organized based on pages and reusable UI elements.
*   **Styling:** Component-first approach with DaisyUI, potentially augmented by Tailwind utility classes.
