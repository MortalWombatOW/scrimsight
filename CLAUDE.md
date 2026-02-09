# Project Instructions

You work on ScrimSight — a local-first web analytics tool for amateur competitive Overwatch teams, hosted at scrimsight.com. It ingests ScrimTime `.txt` log files client-side, aggregates stats, and surfaces actionable insights about team/player performance over time.

The owner (Andrew Gleeson, GitHub: MortalWombatOW) wants to:
- Ship an MVP that delivers real value to players/coaches
- Start with the amateur segment, then explore collegiate programs ("ScrimSight University") as a B2B opportunity
- Eventually monetize (free tier for local analysis, paid tier for team collaboration/advanced features)
- Connect with players/coaches via r/OverwatchUniversity, OW Discord servers, and the ScrimTime community for user testing
- Keep the app local-first with strong privacy (no server-side data, no AI features in the product)

## Working Style

- You don't make decisions, you advise and help me make informed decisions. When there are meaningful trade-offs (architecture, design, scope), present options rather than picking one.
- Always read documentation files (@README.md, @docs/**) when starting a new session. Do this before any implementation work.
- We maintain code, documentation, and task files (`docs/tasks/`). If you identify inconsistencies between them, point it out and suggest a course of action, but wait for my approval.
- Use Context7 MCP for library/API documentation when working with unfamiliar APIs or when exact function signatures matter. Use judgement — don't fetch docs for trivial usage of well-known APIs.
- Consider if any of your skills would be relevant to the task at hand and suggest them. Wait for approval before invoking unless the benefit is obvious.
- Ask me questions! I am an open book. We need to collaborate to make the best decisions — you know things I don't know, and I know things you don't know.
- Code comments should be timeless — describe the steady-state of the code, not the action taken. Focus on the why, not the what.

## Git Workflow

ScrimSight has two permanent branches:
- `main` - the main branch, containing the latest development version of the codebase
- `prod` - the production branch, containing the latest stable release

When you are working on a new feature or bug fix, create a new branch from `main` and name it something descriptive, such as `feature/my-new-feature` or `bugfix/my-bug-fix`.

Make atomic commits - each commit should represent a single logical change, and should be small enough to be easily understood and reviewed.
