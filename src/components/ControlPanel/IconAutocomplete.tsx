import { Autocomplete, Checkbox, Chip, TextField } from "@mui/material";


interface IconAutocompleteProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  icon: React.ReactNode;
  noOptionsText: string;
  label: string;
  size?: 'small' | 'large';
}

const IconAutocomplete: React.FC<IconAutocompleteProps> = ({options, selected, onChange, icon, noOptionsText, label, size}) => {
  return (<Autocomplete
    style={{ width: '100%', minWidth: size === 'large' ? 300 : 200, maxWidth: size === 'large' ? 500 : 300 }}
    size={size === 'large' ? 'medium' : 'small'}
    multiple
    getOptionLabel={(option) =>
      String(option)
    }
    // filterOptions={(x) => x}
    options={options}
    autoComplete
    // includeInputInList
    value={selected}
    disableCloseOnSelect
    noOptionsText={noOptionsText}
    onChange={(_, newValue: string[]) => {
      onChange(newValue);
    }}
    renderOption={(props, option, { selected }) => {
      const { key, ...optionProps } = props;
      return (
        <li key={key} {...optionProps}>
          <Checkbox
            icon={icon}
            checkedIcon={icon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      );
    }}

    renderInput={(params) => (
      <div>
        <TextField
          {...params}
          label={label}
          variant="outlined"
          // This is broken due to https://github.com/mui/material-ui/issues/22103
          // InputProps={{
          //   ...params.InputProps,
          //   startAdornment: (
          //     <InputAdornment position="start">
          //       {icon}
          //     </InputAdornment>
          //   )
          // }}  
          fullWidth
        />
      </div>
    )}
    renderTags={(value: readonly string[], getTagProps) =>
      value.map((option: string, index: number) => {
        const { key, ...tagProps } = getTagProps({ index });
        return (
          <Chip variant="outlined" label={option} key={key} {...tagProps} />
        );
      })
    }

  />);
};

export default IconAutocomplete;