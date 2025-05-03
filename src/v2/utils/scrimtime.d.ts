// Add missing exports from the scrimtime module

declare module '../../atoms/files/scrimtime' {
  export const LOG_SPEC: Record<string, any>;
  export interface DataSpec {
    displayName: string;
    key: string;
    fields: {
      displayName: string;
      key: string;
      dataType: 'string' | 'number' | 'boolean';
    }[];
  }
}