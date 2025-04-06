# Product Context

*Why does this project exist? What problems does it solve? How should it work? What are the user experience goals?*

---

*Extracted from projectbrief.md (PRD v1.0)*

### 1. Introduction

**1.1 Purpose:**
Scrimsight aims to be a powerful, browser-based analytical tool for Overwatch players, coaches, and teams utilizing the "ScrimTime" (DKEEH) workshop code. It allows users to upload ScrimTime log files, processes the data, and provides insightful statistics, visualizations, and analysis to facilitate performance review and strategic planning.

**1.2 Goals for v1:**
*   Provide accurate parsing and processing of standard ScrimTime log files.
*   Offer core analytical features covering matches, players, teams, and basic compositions.
*   Deliver essential statistics and visualizations inspired by professional coaching methods.
*   Establish a user-friendly interface for file management and data exploration.
*   Implement secure authentication via Discord.
*   Create a stable foundation for future feature expansion.

**1.3 Target Audience:**
*   Overwatch Team Coaches & Analysts (Amateur to Semi-Pro)
*   Individual Players seeking performance insights
*   Team Captains / Managers

### 2. Core Principles

*   **Accuracy:** Data parsing, calculations, and metrics must be accurate and reflect the events of the game logs reliably.
*   **Usability:** The interface should be intuitive, allowing users to easily upload logs, navigate data, and understand the presented information with minimal friction.
*   **Performance:** The application should handle a reasonable number of log files (e.g., a full scrim block, ~5-10 maps) and perform calculations/render views efficiently within the browser environment. Loading states should be clear.
*   **Clarity:** Visualizations and statistics should be presented clearly and concisely, prioritizing actionable insights over raw data dumps.
*   **Modularity:** Maintain a modular codebase (as facilitated by Jotai atoms) to allow for easier testing, maintenance, and future expansion.
