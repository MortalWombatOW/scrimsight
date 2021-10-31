/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Popover } from '@mui/material';
import { EventFilter, RawEvent, StrIndexable } from '../types';
import Histogram from './Histogram/Histogram';

interface OrderedChecklistProps {
  data: string[];
  onSelectionChange: (selected: string[]) => void;
}

// react component with sorted checklist of unique values
const CategoricalSelect = (props: OrderedChecklistProps) => {
  const {
    data,
    onSelectionChange,
  } = props;

  const [uniqueValues, setUniqueValues] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const _uniqueValues = new Map<string, number>();
    data.forEach((value) => {
      if (_uniqueValues.has(value)) {
        const count = _uniqueValues.get(value);
        if (count !== undefined) {
          _uniqueValues.set(value, count + 1);
        }
      } else {
        _uniqueValues.set(value, 1);
      }
    });
    // limit to 10 values sorted by frequency
    const sorted = Array.from(_uniqueValues.entries()).sort((a, b) => b[1] - a[1]);
    setUniqueValues(new Map(sorted.slice(0, 15)));
  }, [data]);

  const [fieldState, setFieldState] = useState<Map<string, boolean>>(
    new Map(Array.from(uniqueValues.entries()).map(([value, _]) => [value, false])),
  );

  useEffect(() => {
    // get all selected values
    const selected = Array.from(fieldState.entries())
      .filter(([value, active]) => active).map(([value, _]) => value);

    // eslint-disable-next-line no-console
    console.log('fieldState', fieldState);
    if (selected.length > 0) {
      onSelectionChange(selected);
    }
  }, [fieldState]);

  return (
    <div>
      {Array.from(uniqueValues.keys()).map((value, index) => (
        <div>
          <Checkbox
            key={value}
            checked={fieldState.get(value)}
            onChange={(e) => setFieldState(new Map(fieldState.set(value, e.target.checked)))}
          />
          {value}
        </div>
      ))}
    </div>
  );
};

// function getUniqueValuesWithFrequency(arr: Array<string>):
//   Map<string, number> {
//   return arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
// }

function isNumeric(n: string): boolean {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}

const FieldButton = (props: FieldButtonProps) => {
  const { fieldName, events, addFilter } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const makeRangeFilter = (selection: number[]) => {
    const evalFn = (event: StrIndexable) => (event as StrIndexable)[fieldName] >= selection[0]
    && (event as StrIndexable)[fieldName] <= selection[1];
    console.log(selection); // eslint-disable-line no-console
    return { constraint: `${fieldName}: ${selection.join('->')}`, eval: evalFn };
  };

  const makeCategoricalFilter = (selection: string[]) => {
    const evalFn = (event: StrIndexable) => selection.includes((event as StrIndexable)[fieldName]);
    console.log(selection); // eslint-disable-line no-console
    return { constraint: `${fieldName}: ${selection.join(',')}`, eval: evalFn };
  };

  const values = events.map((evt) => (evt as StrIndexable)[fieldName]);
  const allNumeric = values.every((v) => isNumeric(v));
  // const distribution = getUniqueValuesWithFrequency(values);
  // let numericDistribution = new Map();
  // if (allNumeric) {
  //   numericDistribution = new Map(Array.from(
  //     distribution.entries(),
  //   ).map(([k, v]) => [Number(k), v]));
  // }

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={(e) => setAnchorEl(e.currentTarget)}>
        {fieldName}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className="popover-content">
          {allNumeric && values.length > 10 ? ( // if all values are numeric, show a histogram
            <Histogram
              data={values}
              onSelectionChange={(min, max) => addFilter(makeRangeFilter([min, max]))}
              width={600}
              height={200}
              bins={200}
            />
          )
            : (
              <CategoricalSelect
                data={values}
                onSelectionChange={(selected) => addFilter(makeCategoricalFilter(selected))}
              />
            )}
        </div>
      </Popover>
    </div>
  );
};

interface FieldButtonProps {
  fieldName: string;
  addFilter: (f: EventFilter) => void;
  events: Array<RawEvent>;
}

export default FieldButton;
