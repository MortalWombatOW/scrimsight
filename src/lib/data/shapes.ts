export interface SingleKeySingleValueData<T extends object> {
  categoryKey: keyof T extends string ? keyof T : never;
  valueKey: keyof T extends string ? keyof T : never;
  data: T[];
}

