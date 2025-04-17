# Atoms Architecture

This directory contains the state management logic for the ScrimSight application, using Jotai for state management.

## Structure

The atoms are organized into several categories:

- **Base atoms**: Files directly in `src/atoms`
- **Derived events**: In `derived_events/` - combined events from various extractors
- **Derived state**: In `derived_state/` - processes events into state timelines
- **Derived stats**: In `derived_stats/` - calculates complex statistics
- **Event extractors**: In `event_extractors/` - extracts events from log files
- **Files**: In `files/` - handles log file loading and parsing
- **Metrics**: In `metrics/` - defines metrics and utility functions

## Folder Structure Requirements

Each atom must live in its own folder following this structure:

```
/atoms/(atom_group)/(atom_name)/
  ├── interface.ts   # Defines the output type of the atom
  ├── logic.ts       # Contains the function that transforms input data to output data
  ├── atom.ts        # Integrates with Jotai to await input data and call the logic function
  ├── logic.test.ts  # Unit tests for the logic function
  └── index.ts       # Exports the atom and type, not exposing the logic function directly
```

This structure ensures a clear separation of concerns, makes testing easier, and provides a consistent organization across the codebase.

## Implementation Example

**Interface Definition (interface.ts):**
```typescript
interface MyData {
  myNum: number;
}

export default MyData;
```

**Pure Logic (logic.ts):**
```typescript
import { MyData } from "./interface";


function generateMyData(myNumber: number): KillMatrixData {
  return {
    myNum: myNumber
  };
}

export default generateMyData;
```

**Jotai Integration (atom.ts):**
```typescript
import { atom } from "jotai";
import logic from "./logic";
import MyData from "./interface";

const myDataAtom = atom(async (): Promise<KillMatrixData> => {
    // Get dependencies through Jotai if needed
    const myDependency = await get(dependencyAtom);
    const myNumber = myDependency.myNumber;

    // Use the pure business logic function
    return logic(myNumber);
});

export default myDataAtom;
```

**Exports (index.ts):**
```typescript
import myDataAtom from "./atom";
import MyData from "./interface";

export default myDataAtom;
export type MyData = MyData;
```

## Testing

With this separation, you can test the business logic directly without testing Jotai:

```typescript
import { describe, it, expect } from 'vitest';
import logic from './logic';
import MyData from './interface';

describe('myDataAtom', () => {
  it('returns correct number', () => {
    const result = logic(10);
    expect(result.myNum).toBe(10);
  });
});
```