# ScrimSight V2: Medallion Architecture

This directory contains the V2 implementation of the ScrimSight data processing system, using the Medallion Architecture pattern.

## Architecture Overview

The V2 implementation follows a layered Medallion Architecture approach:

1. **Raw Layer**: Initial file input and loading
2. **Bronze Layer**: Parsing log lines with validation using Zod schemas
3. **Silver Layer**: Transforming and deriving more complex data structures
4. **Gold Layer**: Aggregation and metrics calculation

This architecture provides several benefits:
- Clean separation of concerns
- Strong typing and validation at layer boundaries
- Pure logic functions for testability
- Efficient data processing with pandas-js
- Reactive state management with Jotai

## Directory Structure

- `atoms/`: Jotai atoms for each layer
  - `rawAtoms.ts`: File input and loading
  - `bronzeAtoms.ts`: Parsed and validated log events
  - `silverAtoms.ts`: Transformed and derived entities
  - `goldAtoms.ts`: Aggregation engine atom family
- `layers/`: Pure logic functions for data processing
  - `bronzeLogic.ts`: Log line parsing and validation
  - `silverLogic.ts`: Transformation and derivation
  - `goldLogic.ts`: Metrics aggregation engine
- `schemas/`: Zod schema definitions
  - `bronzeSchema.ts`: Log event schemas
  - `silverSchema.ts`: Entity schemas
  - `metricsSchema.ts`: Metrics configuration schemas
- `metrics/`: Metrics configuration and related utilities
  - `metricsConfig.ts`: Definition of available metrics
- `tests/`: Unit tests for pure logic functions
- `utils/`: Shared helper functions

## Key Components

### Raw Layer (`rawAtoms.ts`)

The Raw layer is responsible for:
- Accepting file inputs from the user
- Loading file contents
- Handling sample data for demo purposes

### Bronze Layer (`bronzeSchema.ts`, `bronzeLogic.ts`, `bronzeAtoms.ts`)

The Bronze layer is responsible for:
- Defining schemas for all log event types
- Parsing log lines based on the LOG_SPEC
- Validating the parsed data against schemas
- Organizing events by type

### Silver Layer (`silverSchema.ts`, `silverLogic.ts`, `silverAtoms.ts`)

The Silver layer is responsible for:
- Defining schemas for derived entities (matches, rounds, teamfights, etc.)
- Transforming Bronze events into unified structures
- Calculating derived data (playtime, teamfights, ultimate cycles, player lives)
- Correlating events across time and entities

### Gold Layer (`metricsSchema.ts`, `metricsConfig.ts`, `goldLogic.ts`, `goldAtoms.ts`)

The Gold layer is responsible for:
- Defining metric configurations (simple, ratio, per-10-min, derived)
- Calculating aggregated metrics based on Silver data
- Supporting flexible grouping and filtering
- Providing a unified interface for accessing metrics

## Usage Examples

### Accessing Match Data

```typescript
import { useAtom } from 'jotai';
import { silverMatchesAtom } from '~/v2';

function MatchList() {
  const [matches] = useAtom(silverMatchesAtom);
  
  return (
    <div>
      {matches.map(match => (
        <div key={match.id}>
          {match.map_name}: {match.team1_name} vs {match.team2_name}
        </div>
      ))}
    </div>
  );
}
```

### Calculating Aggregated Metrics

```typescript
import { useAtom } from 'jotai';
import { getAggregatedMetricsAtom } from '~/v2';

function PlayerStats({ playerName }) {
  const [playerStats] = useAtom(getAggregatedMetricsAtom({
    sourceAtom: 'silverPlayerRoundStats',
    groupBy: ['player_name', 'hero'],
    filters: { player_name: playerName },
    metrics: [
      'eliminations', 'deaths', 'hero_damage',
      'healing', 'kd_ratio', 'damage_per_10'
    ]
  }));
  
  return (
    <div>
      {playerStats.map(stat => (
        <div key={stat.hero}>
          {stat.hero}: {stat.eliminations} eliminations, {stat.healing} healing
        </div>
      ))}
    </div>
  );
}
```

## Testing

The V2 implementation emphasizes testability through pure functions:

```typescript
import { calculateSilverMatches } from '~/v2/layers/silverLogic';

// Test with mock Bronze data
const mockBronzeData = { /* ... */ };
const matches = calculateSilverMatches(mockBronzeData);

// Assert expectations
expect(matches[0].team1_score).toBe(3);
expect(matches[0].winner).toBe('Team 1');
```

## Migration from V1

The V2 implementation can run alongside the existing V1 code, allowing for:
- Gradual migration of components
- Comparison testing between V1 and V2 outputs
- Fallback to V1 if needed during transition