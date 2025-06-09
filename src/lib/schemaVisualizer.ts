// Types for schema visualization

// Field of an atom
export interface Field {
  name: string;
  type: string;
  dependencies?: string[];
}

// Atom (node) data
export interface Atom {
  id: string;
  label: string;
  type: string;
  fields: Field[];
  layer: 'data' | 'extractor' | 'derived_event' | 'derived_state' | 'derived_stats' | 'metrics';
  sourceFile?: string;
}

// Dependency (edge) data
export interface Dependency {
  sourceAtom: string;
  sourceField: string;
  targetAtom: string;
  targetField: string;
  label?: string;
}

// Collection of all atoms in the application
export interface AtomCollection {
  atoms: Atom[];
  dependencies: Dependency[];
}
