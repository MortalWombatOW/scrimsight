# TypeScript Guidelines

## Import Aliases
We use `tsconfig` paths to avoid `../../` hell.

* ✅ `import { useScrims } from '@hooks';`
* ❌ `import { useScrims } from '../../hooks/useScrims';`

## Strict Mode
`strict: true` is enabled.
* No implicit `any`.
* All component props must be typed.
* Use `zod` for validating external data (file ingestion) in `src/data`.

## Type Locations
* **Domain Entities**: Define in `src/data/types.ts` if they represent raw data, or `src/domain/{context}.ts` if they are derived.
* **Component Props**: Define inline with the component or in a separate `types.ts` if shared.

## Styling

ScrimSight uses Tailwind CSS v4 with daisyUI v5 themes.

* Use daisyUI theme tokens (`text-primary`, `bg-base-100`, `border-base-content/10`) — never hardcode colors.
* No `dark:` prefixes. The daisyUI theme handles light/dark mode automatically.
* Use the `cn()` helper from `@library/cn` for conditional class name merging.