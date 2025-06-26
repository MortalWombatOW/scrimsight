## Plan to Resolve Lint Errors

1.  **Run `npm run lint:fix`**: ✅ **COMPLETED** - Identified 83 problems (58 errors, 25 warnings):
    - Missing .stories.tsx files for AppLayout and AuthGuard components
    - 23 Storybook import errors (@storybook/react → @storybook/react-vite)
    - Multiple project-structure/independent-modules violations
    - @typescript-eslint/no-explicit-any warnings (25 instances)
    - @typescript-eslint/no-unused-vars errors (few instances)
    - react-hooks/exhaustive-deps warning (1 instance)
2.  **Update Storybook imports**: ✅ **COMPLETED** - Updated 25 .stories.tsx files to use `@storybook/react-vite` instead of `@storybook/react`.
3.  **Create missing Storybook files**: ✅ **COMPLETED** - Created AppLayout.stories.tsx and AuthGuard.stories.tsx with comprehensive story variants and proper TypeScript typing.
4.  **Investigate `project-structure/independent-modules` errors**: ✅ **ANALYZED** - Found strict module independence rules that are overly restrictive:
    *   **Library modules** (src/lib/) importing React hooks and atoms (violates pure business logic principle)
    *   **Page modules** cannot import atoms directly (but need them for state management)  
    *   **Component stories** cannot import atoms directly (but need them for realistic testing)
    *   **Icon modules** cannot import lib types (but may need them for typing)
    
    **Recommended Solution**: Adjust architecture to allow more practical import patterns while maintaining separation of concerns.
    
    **PENDING**: Need approval to modify `independentModules.mjs` configuration to allow:
    - Pages to import atoms
    - Component stories to import atoms
    - Icons to import lib types
    
    **Alternative**: Restructure code to move React hooks from lib/ to hooks/ directory.
5.  **Resolve `@typescript-eslint/no-explicit-any` warnings**: ✅ **COMPLETED** - Fixed all 25 instances by replacing `any` types with proper TypeScript types in buildDataModel.ts, MatchDetailsPage.tsx, ScrimDetailsPage.tsx, and TeamDetailsPage.tsx.
6.  **Resolve `@typescript-eslint/no-unused-vars` errors**: ✅ **COMPLETED** - Fixed unused variables in buildDataModel.test.ts by prefixing with underscore to indicate intentional non-use.
7.  **Resolve `react-hooks/exhaustive-deps` warnings**: ✅ **COMPLETED** - Added missing 'setAuthAtom' dependency to useEffect in CallbackPage.tsx.

## Summary

**PROGRESS**: 6 of 7 tasks completed ✅

**COMPLETED**:
- ✅ Fixed stylistic/indent errors (auto-fixed)
- ✅ Updated 25 Storybook imports to use @storybook/react-vite 
- ✅ Created missing AppLayout.stories.tsx and AuthGuard.stories.tsx files
- ✅ Fixed all 25 @typescript-eslint/no-explicit-any warnings
- ✅ Fixed @typescript-eslint/no-unused-vars errors
- ✅ Fixed react-hooks/exhaustive-deps warning

**PENDING APPROVAL**:
- ⏳ **project-structure/independent-modules errors** - Analyzed and identified that current module rules are overly restrictive. Need approval to adjust architecture to allow practical import patterns (pages → atoms, component stories → atoms, icons → lib types) OR restructure code to move React hooks from lib/ to hooks/ directory.

**ESTIMATED REMAINING LINT ERRORS**: ~40-50 errors (all project-structure/independent-modules violations)
