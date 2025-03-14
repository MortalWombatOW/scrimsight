import React, { useEffect, useRef, useState } from "react";

interface IconAutocompleteProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  icon: React.ReactNode;
  noOptionsText: string;
  label: string;
  size?: "small" | "large";
  optionLabel?: (option: string) => string;
  optionSubLabel?: (option: string) => string;
}

export const IconAutocomplete: React.FC<IconAutocompleteProps> = ({
  options,
  selected,
  onChange,
  icon,
  noOptionsText,
  label,
  size = "large",
  optionLabel,
  optionSubLabel,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter options based on input
  const filteredOptions = options.filter((option) =>
    (optionLabel ? optionLabel(option) : option)
      .toLowerCase()
      .includes(inputValue.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Handle selection toggle
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  // Remove a selected tag
  const removeTag = (option: string) => {
    onChange(selected.filter((item) => item !== option));
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative ${
        size === "large"
          ? "w-full min-w-[300px] max-w-[500px]"
          : "min-w-[200px] max-w-[300px]"
      }`}
    >
      <div className="relative">
        {/* Input field */}
        <div className="relative flex flex-wrap items-center gap-1 rounded-md border border-base-300 bg-white p-2 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 dark:border-base-600 dark:bg-base-700">
          {/* Icon */}
          {icon && (
            <span className="mr-2 text-base-500 dark:text-base-400">
              {icon}
            </span>
          )}

          {/* Selected tags */}
          {selected.map((option) => (
            <div
              key={option}
              className="flex items-center gap-1 rounded-full border border-base-300 bg-base-100 px-2 py-1 text-sm dark:border-base-600 dark:bg-base-800"
            >
              <span>{optionLabel ? optionLabel(option) : option}</span>
              <button
                type="button"
                onClick={() => removeTag(option)}
                className="font-bold hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}

          {/* Input */}
          <input
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className={`flex-grow border-0 bg-transparent p-1 outline-none ${
              size === "small" ? "text-sm" : ""
            }`}
            placeholder={selected.length > 0 ? "" : label}
          />
        </div>

        {/* Floating label */}
        <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-base-600 dark:bg-base-800 dark:text-base-400">
          {label}
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-base-300 bg-white py-1 shadow-md dark:border-base-600 dark:bg-base-800">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option}
                className="cursor-pointer px-3 py-2 hover:bg-base-100 dark:hover:bg-base-700"
                onClick={() => toggleOption(option)}
              >
                <div className="flex items-center">
                  <div className="mr-2">{icon}</div>
                  <div>
                    <div
                      className={
                        selected.includes(option)
                          ? "font-medium text-primary-600 dark:text-primary-400"
                          : ""
                      }
                    >
                      {optionLabel ? optionLabel(option) : option}
                    </div>
                    {optionSubLabel && (
                      <div className="text-sm text-base-500 dark:text-base-400">
                        {optionSubLabel(option)}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="cursor-default px-3 py-2 text-base-500 dark:text-base-400">
              {noOptionsText}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
