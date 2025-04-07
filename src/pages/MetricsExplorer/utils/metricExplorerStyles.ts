import { StylesConfig } from "react-select"; // Removed GroupBase
import {
  PlayerStatsCategoryKeys,
  PlayerStatsNumericalKeys,
} from "~/atoms/metrics/playerMetricsAtoms";

// Define option types used in controls
type OptionType = { value: string; label: string };
type GroupByOptionType = { value: PlayerStatsCategoryKeys; label: string };
type MetricsOptionType = { value: PlayerStatsNumericalKeys; label: string };
type SortByOptionType = { value: PlayerStatsCategoryKeys | PlayerStatsNumericalKeys; label: string };
type SortDirectionOptionType = { value: "asc" | "desc"; label: string };


// Base styles (common parts) using DaisyUI theme variables
const baseControlStyles = (provided: any, state: any) => ({
  ...provided,
  backgroundColor: "hsl(var(--b2))", // Use base-200
  borderColor: state.isFocused ? "hsl(var(--p))" : "hsl(var(--b3))", // Use primary on focus, base-300 otherwise
  boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--p))" : provided.boxShadow, // Use primary shadow on focus
  "&:hover": {
    borderColor: "hsl(var(--bc) / 0.5)", // Use base-content with opacity on hover
  },
  color: "hsl(var(--bc))", // Use base-content color
  borderRadius: 'var(--radius-field, 0.25rem)', // Use theme radius
});

const baseMenuStyles = (provided: any) => ({
  ...provided,
  backgroundColor: "hsl(var(--b1))", // Use base-100
  zIndex: 20,
  borderRadius: 'var(--radius-box, 0.5rem)', // Use theme radius
});

const baseOptionStyles = (provided: any, state: any) => ({
  ...provided,
  backgroundColor: state.isSelected
    ? "hsl(var(--p))" // Use primary for selected
    : state.isFocused
    ? "hsl(var(--b3))" // Use base-300 for focused
    : provided.backgroundColor, // Default background
  color: state.isSelected ? "hsl(var(--pc))" : "hsl(var(--bc))", // Use primary-content or base-content
  "&:active": {
    backgroundColor: "hsl(var(--p) / 0.8)", // Slightly darker primary on active
  },
  borderRadius: 'var(--radius-field, 0.25rem)', // Use theme radius
});

const baseInputStyles = (provided: any) => ({ ...provided, color: "hsl(var(--bc))" }); // Use base-content
const baseSingleValueStyles = (provided: any) => ({ ...provided, color: "hsl(var(--bc))" }); // Use base-content
const baseMultiValueStyles = (provided: any) => ({
  ...provided,
  backgroundColor: "hsl(var(--b3))", // Use base-300
  borderRadius: 'var(--radius-badge, 1.9rem)', // Use badge radius for pill shape
});
const baseMultiValueLabelStyles = (provided: any) => ({ ...provided, color: "hsl(var(--bc))" }); // Use base-content
const baseMultiValueRemoveStyles = (provided: any) => ({
  ...provided,
  color: "hsl(var(--bc) / 0.7)", // Use base-content with opacity
  ":hover": { backgroundColor: "hsl(var(--er) / 0.3)", color: "hsl(var(--er))" }, // Use error color on hover
  borderTopRightRadius: 'var(--radius-badge, 1.9rem)', // Match pill shape
  borderBottomRightRadius: 'var(--radius-badge, 1.9rem)', // Match pill shape
});
const basePlaceholderStyles = (provided: any) => ({ ...provided, color: "hsl(var(--bc) / 0.5)" }); // Use base-content with opacity


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
};

export const sortBySelectStyles: StylesConfig<SortByOptionType, false> = {
  control: baseControlStyles,
  menu: baseMenuStyles,
  option: baseOptionStyles,
  input: baseInputStyles,
  singleValue: baseSingleValueStyles,
  placeholder: basePlaceholderStyles,
};

export const sortDirectionSelectStyles: StylesConfig<SortDirectionOptionType, false> = {
  control: baseControlStyles,
  menu: baseMenuStyles,
  option: baseOptionStyles,
  input: baseInputStyles,
  singleValue: baseSingleValueStyles,
  placeholder: basePlaceholderStyles,
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
};


// Helper function to get distinct colors for chart bars/points using theme colors
// Using HSL values directly from src/index.css for better theme consistency
const THEME_COLORS = [
  "oklch(var(--p))", // Primary
  "oklch(var(--a))", // Accent
  "oklch(var(--s))", // Secondary
  "oklch(var(--in))", // Info
  "oklch(var(--su))", // Success
  "oklch(var(--wa))", // Warning
  "oklch(var(--er))", // Error
  // Add more variations if needed, e.g., slightly desaturated versions or base colors
  "oklch(var(--b3))", // Base-300 (darker)
  "oklch(var(--n))", // Neutral
];
export const getColor = (index: number) => THEME_COLORS[index % THEME_COLORS.length];
