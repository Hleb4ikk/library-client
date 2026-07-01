import { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export type DropdownOption = {
  value: string;
  label: string;
  icon?: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value?: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
};

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Выберите...",
  className,
  triggerClassName,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setIsOpen(false);
  }
  return (
    <div ref={dropdownRef} className={twMerge("", className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={twMerge(
          "flex w-full items-center justify-between gap-2 rounded-xl border border-natural/20 bg-white px-4 py-3 text-left text-sm font-medium text-fern transition-all",
          "hover:border-apricot/50 focus:border-apricot focus:outline-none focus:ring-2 focus:ring-apricot/20",
          disabled && "cursor-not-allowed opacity-50",
          isOpen && "border-apricot ring-2 ring-apricot/20",
          triggerClassName,
        )}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon && (
            <span className="text-base">{selectedOption.icon}</span>
          )}
          <span className={!selectedOption ? "text-natural-text" : ""}>
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <svg
          className={twMerge(
            "h-4 w-4 text-natural transition-transform",
            isOpen && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 overflow-hidden rounded-xl border border-natural/20 bg-white shadow-lg ">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={twMerge(
                  "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors",
                  "hover:bg-apricot/10",
                  option.value === value
                    ? "bg-apricot/15 font-semibold text-apricot"
                    : "text-fern",
                )}
              >
                {option.icon && (
                  <span className="text-base">{option.icon}</span>
                )}
                {option.label}
                {option.value === value && (
                  <svg
                    className="ml-auto h-4 w-4 text-apricot"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
