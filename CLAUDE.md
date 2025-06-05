# ScrimSight Development Workflow

## Core Workflow Pattern

When given a task, **ALWAYS** evaluate it first and choose the appropriate workflow:

### Research & Exploration Phase
- **ALWAYS** use subagents to search the `docs/` folder for relevant documentation when researching or exploring
- Use subagents to investigate specific questions or verify implementation details
- This preserves context while gathering comprehensive information

### 1. For Easily Testable Tasks → Test-Driven Development
If the task involves logic that can be unit/integration tested:
- Write comprehensive tests first based on expected input/output pairs
- Commit the tests (they should fail initially)
- Implement code to make tests pass
- Iterate until all tests pass
- Commit the working implementation

### 2. For Visual/UI Changes → Visual Iteration
If the task involves UI components, styling, or visual changes:
- Write the initial implementation
- Request screenshot from user to compare against expectations
- Iterate based on visual feedback until satisfied
- Commit the final visual implementation

### 3. For Other Tasks → Explore, Plan, Code
For complex features, refactoring, or unclear requirements:
- **Explore**: Read relevant files, understand current implementation
- **Plan**: Use "think" keyword to trigger extended thinking, create explicit plan
- **Code**: Implement the planned solution step by step
- **Commit**: Create descriptive commit with context

## Task Management with Taskmaster

ALWAYS use the Taskmaster CLI tool to track progress. If the user's ask does not align with the plan, ask for clarification and update the task structure accordingly.

```bash
# View current tasks
npx task-master list

# Get next available task
npx task-master next

# Set task status as you work
npx task-master set-status -i TASK_ID -s in-progress
npx task-master set-status -i TASK_ID -s done

# Add new tasks when discovered
npx task-master add-task -p "Description of new task"
```

See docs/taskmaster.md for the full list of commands.

**IMPORTANT**: For any task with multiple steps, use Taskmaster to break it down and track progress.

## Project Commands

### Build & Quality
- `npm run build`: Build the project
- `npm run typecheck`: Run TypeScript type checking
- `npm run dev`: Start development server
- `npm test`: Run test suite
- `npm run lint`: Run linting checks
- `./check-lint-build-errors.sh`: **ALWAYS use this script** when checking for errors/warnings - it handles scoping to relevant paths instead of getting errors for the whole project

### Testing Strategy
- Prefer running single tests over full test suite for performance
- Always run typecheck after making code changes
- Use Jest for unit tests, following existing patterns in `src/atoms/*.test.ts`

## Code Style & Patterns

### TypeScript/React Conventions
- Use ES modules (import/export), not CommonJS (require)
- Destructure imports when possible: `import { foo } from 'bar'`
- Follow existing patterns in the codebase for new components
- Use Jotai atoms for state management (see `src/atoms/` directory)
- Prefer functional components with hooks

### File Organization
- Components go in `src/components/` with clear folder structure
- Atoms (state) go in `src/atoms/` with descriptive names
- Pages go in `src/pages/` following existing patterns
- Utilities go in `src/lib/` 

### Naming Conventions
- Use PascalCase for components and files containing components
- Use camelCase for atoms, utilities, and regular functions
- Be descriptive with names, avoid abbreviations

## Key Libraries & Tools

### Core Stack
- **React** with TypeScript
- **Jotai** for state management (atomic approach)
- **Vite** for building and development
- **React Router** for navigation
- **Joy UI / Tailwind CSS** for UI components

### Testing
- **Jest** for unit testing
- **React Testing Library** for component testing
- Follow existing test patterns in `*.test.ts` files

## Development Best Practices

### Code Quality Guardrails
- **CRITICAL**: This project uses custom linting rules and guardrails (e.g., fileComposition rules)
- **NEVER** modify or bypass these rules without explicit approval
- If you think you've identified a special case or exception: **ALWAYS STOP AND ASK** the user
- Do not assume you can change established patterns or rules

### Before Making Changes
1. **ALWAYS** check existing implementations first
2. Look at similar components/atoms for patterns
3. Understand the Jotai atom dependency graph
4. Check if utilities already exist in `src/lib/`
5. Respect existing linting rules and code organization patterns

### After Making Changes
1. **MUST** run `./check-lint-build-errors.sh` to check for errors/warnings in relevant paths
2. Run relevant tests to verify functionality
3. Test in browser during development with `npm run dev`
4. For UI changes, verify responsive design

### Git Workflow
- Write descriptive commit messages explaining the "why"
- Include context about the change's impact
- Reference any related issues or tasks

## Common Patterns

### Creating New Atoms
- Look at existing atoms in `src/atoms/` for patterns
- Use proper TypeScript typing
- Consider dependencies and derived atoms
- Add tests for complex logic

### Creating New Components
- Check `src/components/` for similar existing components
- Follow the folder structure (Component/ComponentName.tsx)
- Use existing UI library components when possible
- Implement proper TypeScript props interfaces

### Working with Data
- Game logs are parsed in `src/atoms/logFileParserAtom.ts`
- Player stats derived from parsed events
- Match/team data flows through specific atom chains
- Check existing atoms before creating new data transformations

## Performance Considerations
- Be mindful of atom dependency chains
- Use Jotai's built-in memoization patterns
- Avoid unnecessary re-renders in React components
- Test with actual game log data for realistic performance

## Overwatch-Specific Domain Knowledge
- Heroes have roles: Tank, Damage, Support
- Matches have rounds, rounds have teamfights
- Player events include kills, deaths, abilities, ultimates
- Maps have types (e.g., Escort, Assault, Hybrid)
- Team compositions matter for analysis

## IMPORTANT Notes
- **YOU MUST** run typecheck when done with code changes
- **ALWAYS** use existing patterns and libraries already in the codebase
- **NEVER** add new dependencies without checking if functionality already exists
- **BE SPECIFIC** in your task planning and execution
- **USE TASKMASTER** for complex, multi-step tasks to track progress systematically

## Error Checking
- Always run the check-lint-build-errors.sh script when checking for errors/warnings, it handles scoping to a set of paths instead of getting errors for the whole project.

## Referring to the user
- Always refer to the user as "high codemancer and chief artificer" when communicating with them.

