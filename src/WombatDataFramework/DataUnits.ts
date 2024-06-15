export type DataBasicUnit = 'none' | 's' | '10m' | 'hp' | 'ult%' | 'cap%' | 'acc%' | 'count';

export type DataRatioUnit = {
  numerator: DataBasicUnit;
  denominator: DataBasicUnit;
};

export type DataUnit = DataBasicUnit | DataRatioUnit;

function isBasicUnit(unit: DataUnit): unit is DataBasicUnit {
  return typeof unit === 'string';
}

function isRatioUnit(unit: DataUnit): unit is DataRatioUnit {
  return typeof unit === 'object' && 'numerator' in unit && 'denominator' in unit;
}

export function formatUnit(unit: DataUnit): string {
  if (isBasicUnit(unit)) {
    return unit;
  }
  if (isRatioUnit(unit)) {
    return `${formatUnit(unit.numerator)}/${formatUnit(unit.denominator)}`;
  }
  throw new Error(`Unknown units: ${JSON.stringify(unit)}`);
}

export function reduceUnit(unit: DataUnit): DataUnit {
  if (isBasicUnit(unit)) {
    return unit;
  }
  if (isRatioUnit(unit)) {
    const numerator = reduceUnit(unit.numerator);
    const denominator = reduceUnit(unit.denominator);
    if (numerator === denominator) {
      return 'none' as DataBasicUnit;
    }
    return unit;
  }
  throw new Error(`Cannot reduce unit: ${JSON.stringify(unit)}`);
}

export function conversionWeight(fromUnit: DataUnit, toUnit: DataUnit): number | undefined {
  if (fromUnit === toUnit) {
    return 1;
  }
  if (fromUnit === 's') {
    if (toUnit === '10m') {
      return 600;
    }
  }
  if (fromUnit === '10m') {
    if (toUnit === 's') {
      return 1 / 600;
    }
  }
  return undefined;
}

export function canConvert(fromUnit: DataUnit, toUnit: DataUnit): boolean {
  return conversionWeight(fromUnit, toUnit) !== undefined;
}
