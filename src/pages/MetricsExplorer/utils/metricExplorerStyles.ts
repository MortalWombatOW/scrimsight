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


// Base styles (common parts)
const baseControlStyles = (provided: any, state: any) => ({
  ...provided,
  backgroundColor: "#2A303C", // bg-base-200
  borderColor: state.isFocused ? "#666" : "#4A5568",
  boxShadow: state.isFocused ? "0 0 0 1px #666" : provided.boxShadow,
  "&:hover": {
    borderColor: "#666",
  },
  color: "#A6ADBB",
});

const baseMenuStyles = (provided: any) => ({
  ...provided,
  backgroundColor: "#1D232A", // bg-base-100
  zIndex: 20,
});

const baseOptionStyles = (provided: any, state: any) => ({
  ...provided,
  backgroundColor: state.isSelected
    ? "#0052CC"
    : state.isFocused
    ? "#4A5568"
    : provided.backgroundColor,
  color: state.isSelected ? "white" : "#A6ADBB",
  "&:active": {
    backgroundColor: "#666",
  },
});

const baseInputStyles = (provided: any) => ({ ...provided, color: "#A6ADBB" });
const baseSingleValueStyles = (provided: any) => ({ ...provided, color: "#A6ADBB" });
const baseMultiValueStyles = (provided: any) => ({ ...provided, backgroundColor: "#4A5568" });
const baseMultiValueLabelStyles = (provided: any) => ({ ...provided, color: "#FFFFFF" });
const baseMultiValueRemoveStyles = (provided: any) => ({
  ...provided,
  color: "#A6ADBB",
  ":hover": { backgroundColor: "#ff4d4d", color: "white" },
});
const basePlaceholderStyles = (provided: any) => ({ ...provided, color: "#6B7280" });


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


// Helper function to get distinct colors for chart bars
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];
export const getColor = (index: number) => COLORS[index % COLORS.length];
