# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development
- `npm run dev` or `npm start` - Start the Vite development server
- `npm run build` - Run TypeScript compilation and Vite build
- `npm run preview` - Preview the built app

## Linting and Type Checking
- `npm run lint` - Run ESLint with zero tolerance for warnings 
- `npm run lint:fix` - Automatically fix ESLint issues
- `npm run type-check` - Run TypeScript compiler without emission

## Testing
- `npm run test` - Run all Vitest tests
- `npm run test:watch` - Run tests in watch mode
- To run a single test: `npm run test -- -t "test name pattern"`

## Code Style Guidelines
- Use strict TypeScript with explicit typing where necessary
- 2-space indentation, no trailing whitespace
- Keep components small and focused on a single responsibility
- Follow path alias: `~/*` maps to `src/*`
- Use Jotai for state management in `src/atoms/`
- Follow CSS priority: DaisyUI > Tailwind > Custom CSS
- Organize imports by: external modules, internal modules, relative
- For arrays, use map functions to avoid repetitive code
- Use semantic keys when rendering lists
- Use React.lazy with Suspense for code splitting