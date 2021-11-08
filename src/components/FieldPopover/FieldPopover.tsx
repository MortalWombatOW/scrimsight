/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useRef, useState } from 'react';
import { Popover, Button } from '@mui/material';
import {
  FieldDescription, Dataset, DatasetTransform, filterTransform,
  DataRow, applyTransforms, fieldTransforms,
} from '../../data';

interface FieldPopoverProps {
  field: FieldDescription;
  dataset: Dataset;
  addTransform: (transform: DatasetTransform) => void;
    close: () => void;
}

interface FieldPopoverChildProps {
  field: FieldDescription;
  dataset: Dataset;
  addTransform: (transform: DatasetTransform) => void;
  close: () => void;
  closeInner: () => void;
}

const FilterPopover = (props: FieldPopoverChildProps) => {
  const {
    field, dataset, addTransform, closeInner, close,
  } = props;

  const [selected, setSelected] = useState<string[]>([]);

  if (field.type === 'string') {
    const distinctValues: string[] = [...new Set(dataset.getField(field.name))];
    return (
      <div>
        <div className="filterButtonGroup">
          {distinctValues.map((value) => (
            <Button
              key={value}
              onClick={() => {
                if (selected.includes(value)) {
                  setSelected(selected.filter((v) => v !== value));
                } else {
                  setSelected([...selected, value]);
                }
              }}
              className="filterButton"
              variant={selected.includes(value) ? 'contained' : 'outlined'}
            >
              {value}
            </Button>
          ))}
        </div>

        <Button
          onClick={() => {
            closeInner();
            close();

            if (selected.length === 1) {
              addTransform({
                name: `Filter ${field.name} = ${selected[0]}`,
                transform: (d) => filterTransform((row: DataRow) => selected.includes(row.get(field.name)), field.name, selected.join(',')).transform(d),
              });
              // if only one eventType is selected, transform fields to that eventType
              if (field.name === 'eventType' && fieldTransforms.get('raw_event')!.get(selected[0]) !== undefined) {
                addTransform({
                  name: `Transform ${field.name} = ${selected[0]}`,
                  transform: (d) => applyTransforms(d, fieldTransforms.get('raw_event')!.get(selected[0])!),
                });
              }
            } else if (selected.length > 1) {
              addTransform(filterTransform((row: DataRow) => selected.includes(row.get(field.name)), field.name, selected.join(', ')));
            }
          }}
          className="filterButton"
          variant="outlined"
        >
          Filter
        </Button>
      </div>
    );
  }

  return (
    <div>
      filter
    </div>
  );
};

const GroupByPopover = (props: FieldPopoverChildProps) => {
  const {
    field, dataset, addTransform, close, closeInner,
  } = props;

  return (
    <div>
      group by
    </div>
  );
};

const PopoverOptions = (props: FieldPopoverProps) => {
  const {
    field, dataset, addTransform, close,
  } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const closeInner = () => setAnchorEl(null);

  const openOption = anchorEl?.dataset.optionid;
  return (
    <div className="FieldPopover-root">
      <div className="FieldPopover-description">{field.description}</div>
      <div className="popoveroptions">
        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          data-optionid="filter"
          variant={openOption === 'filter' ? 'contained' : 'outlined'}
        >
          Filter
        </Button>
        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          data-optionid="groupby"
          variant={openOption === 'groupby' ? 'contained' : 'outlined'}
        >
          Group By
        </Button>
      </div>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {openOption === 'filter' && (
          <FilterPopover
            field={field}
            dataset={dataset}
            addTransform={addTransform}
            close={close}
            closeInner={closeInner}
          />
        )}
        {openOption === 'groupby' && (
          <GroupByPopover
            field={field}
            dataset={dataset}
            addTransform={addTransform}
            close={close}
            closeInner={closeInner}
          />
        )}
      </Popover>
    </div>
  );
};

const FieldPopover = (props: FieldPopoverProps) => {
  const { field, dataset, addTransform } = props;
  const { name, type, description } = field;

  const headerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <th>
      <div className="fieldHeader" ref={headerRef} onClick={() => setOpen(true)}>{name}</div>
      <Popover
        open={open}
        anchorEl={headerRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}

      >
        <PopoverOptions
          field={field}
          dataset={dataset}
          addTransform={addTransform}
          close={() => setOpen(false)}
        />
      </Popover>

    </th>
  );
};

export default FieldPopover;
