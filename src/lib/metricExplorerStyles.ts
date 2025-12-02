import { StylesConfig, CSSObjectWithLabel } from "react-select";
import type {
  PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys,
} from "@library";

// Define option types used in controls
type OptionType = { value: string; label: string };
type GroupByOptionType = { value: PlayerStatsCategoryKeys; label: string };
type MetricsOptionType = { value: PlayerStatsNumericalKeys; label: string };
type SortByOptionType = { value: PlayerStatsCategoryKeys | PlayerStatsNumericalKeys; label: string };
type SortDirectionOptionType = { value: "asc" | "desc"; label: string };


// Base styles - using hardcoded colors that react-select can properly render
// Colors derived from the scrimsight theme in index.css
const baseControlStyles = (provided: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
  ...provided,
  backgroundColor: "#1f1f23", // base-200: oklch(14% 0.004 49.25)
  borderColor: state.isFocused ? "#c2e078" : "#000000", // primary / base-300
  boxShadow: state.isFocused ? "0 0 0 1px #c2e078" : provided.boxShadow,
  "&:hover": {
    borderColor: "rgba(216, 216, 216, 0.5)",
  },
  color: "#d8d8d8", // base-content
  borderRadius: '0.25rem',
  minHeight: "38px",
});

const baseMenuStyles = (provided: CSSObjectWithLabel) => ({
  ...provided,
  backgroundColor: "#2a2a2f", // base-100: oklch(21% 0.006 56.043)
  zIndex: 9999,
  borderRadius: '0.5rem',
  border: "1px solid #000000", // base-300
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
});

const baseOptionStyles = (provided: CSSObjectWithLabel, state: { isSelected: boolean; isFocused: boolean }) => ({
  ...provided,
  backgroundColor: state.isSelected
    ? "#c2e078" // primary
    : state.isFocused
      ? "#000000" // base-300
      : "transparent",
  color: state.isSelected ? "#1f2419" : "#d8d8d8", // primary-content / base-content
  "&:active": {
    backgroundColor: "rgba(194, 224, 120, 0.8)",
  },
  borderRadius: '0.25rem',
});

const baseInputStyles = (provided: CSSObjectWithLabel) => ({ ...provided, color: "#d8d8d8" });
const baseSingleValueStyles = (provided: CSSObjectWithLabel) => ({ ...provided, color: "#d8d8d8" });
const baseMultiValueStyles = (provided: CSSObjectWithLabel) => ({
  ...provided,
  backgroundColor: "#000000", // base-300
  borderRadius: '1.9rem',
  display: 'flex',
  alignItems: 'center',
  padding: '1px',
});
const baseMultiValueLabelStyles = (provided: CSSObjectWithLabel) => ({ 
  ...provided, 
  color: "#d8d8d8",
  padding: '2px 6px',
  paddingLeft: '8px',
});
const baseMultiValueRemoveStyles = (provided: CSSObjectWithLabel) => ({
  ...provided,
  color: "rgba(216, 216, 216, 0.7)",
  ":hover": { backgroundColor: "rgba(234, 142, 98, 0.3)", color: "#ea8e62" }, // error color
  borderTopRightRadius: '1.9rem',
  borderBottomRightRadius: '1.9rem',
  borderRadius: '1.9rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4px',
  marginLeft: '2px',
});
const basePlaceholderStyles = (provided: CSSObjectWithLabel) => ({ ...provided, color: "rgba(216, 216, 216, 0.5)" });
const baseMenuPortalStyles = (provided: CSSObjectWithLabel) => ({ ...provided, zIndex: 9999 }); // Ensure portal has high z-index


// Specific Styles Configurations
export const groupBySelectStyles: StylesConfig<GroupByOptionType, true> = {
  control: baseControlStyles,
  menu: baseMenuStyles,
  option: baseOptionStyles,
  input: baseInputStyles,
  multiValue: baseMultiValueStyles,
  multiValueLabel: baseMultiValueLabelStyles,
  multiValueRemove: baseMultiValueRemoveStyles,
  placeholder: basePlaceholderStyles,
  menuPortal: baseMenuPortalStyles,
};

export const metricsSelectStyles: StylesConfig<MetricsOptionType, true> = {
  control: baseControlStyles,
  menu: baseMenuStyles,
  option: baseOptionStyles,
  input: baseInputStyles,
  multiValue: baseMultiValueStyles,
  multiValueLabel: baseMultiValueLabelStyles,
  multiValueRemove: baseMultiValueRemoveStyles,
  placeholder: basePlaceholderStyles,
  menuPortal: baseMenuPortalStyles,
};

export const sortBySelectStyles: StylesConfig<SortByOptionType, false> = {
  control: baseControlStyles,
  menu: baseMenuStyles,
  option: baseOptionStyles,
  input: baseInputStyles,
  singleValue: baseSingleValueStyles,
  placeholder: basePlaceholderStyles,
  menuPortal: baseMenuPortalStyles,
};

export const sortDirectionSelectStyles: StylesConfig<SortDirectionOptionType, false> = {
  control: baseControlStyles,
  menu: baseMenuStyles,
  option: baseOptionStyles,
  input: baseInputStyles,
  singleValue: baseSingleValueStyles,
  placeholder: basePlaceholderStyles,
  menuPortal: baseMenuPortalStyles,
};

export const filterSelectStyles: StylesConfig<OptionType, true> = {
  control: baseControlStyles,
  menu: baseMenuStyles,
  option: baseOptionStyles,
  input: baseInputStyles,
  multiValue: baseMultiValueStyles,
  multiValueLabel: baseMultiValueLabelStyles,
  multiValueRemove: baseMultiValueRemoveStyles,
  placeholder: basePlaceholderStyles,
  menuPortal: baseMenuPortalStyles,
};


// Helper function to get distinct colors for chart bars/points using theme colors
// Using the actual CSS custom properties defined in index.css
const THEME_COLORS = [
  "var(--color-primary)", // Primary
  "var(--color-accent)", // Accent
  "var(--color-secondary)", // Secondary
  "var(--color-info)", // Info
  "var(--color-success)", // Success
  "var(--color-warning)", // Warning
  "var(--color-error)", // Error
  // Add more variations if needed, e.g., slightly desaturated versions or base colors
  "var(--color-base-300)", // Base-300 (darker)
  "var(--color-neutral)", // Neutral
];
export const getColor = (index: number) => THEME_COLORS[index % THEME_COLORS.length];
