import * as React from "react";
import { NumericFormat } from "react-number-format";
import { cn } from "@/lib/utils";

interface PercentageInputProps {
  value?: number | string;
  onChange?: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
  name?: string;
  min?: number;
  max?: number;
  allowNegative?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

const PercentageInput = React.forwardRef<
  HTMLInputElement,
  PercentageInputProps
>(
  (
    {
      value,
      onChange,
      placeholder = "7,5",
      className,
      disabled = false,
      autoFocus = false,
      id,
      name,
      min,
      max,
      allowNegative = false,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle digit input for percentage (with one decimal place precision)
      if (/\d/.test(e.key)) {
        e.preventDefault();
        const digit = e.key;
        const currentDigits = internalValue.replace(/\D/g, "");
        const newDigits = currentDigits + digit;

        // Convert to percentage with one decimal place
        const numValue = parseInt(newDigits) / 10;

        if (onChange) {
          onChange(numValue);
        }

        const formattedValue = numValue.toLocaleString("pt-BR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        });

        setInternalValue(formattedValue);
        return;
      }

      // Handle backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        const currentDigits = internalValue.replace(/\D/g, "");
        const newDigits = currentDigits.slice(0, -1);

        if (newDigits.length === 0) {
          setInternalValue("");
          if (onChange) {
            onChange(0);
          }
          return;
        }

        const numValue = parseInt(newDigits) / 10;

        if (onChange) {
          onChange(numValue);
        }

        const formattedValue = numValue.toLocaleString("pt-BR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        });

        setInternalValue(formattedValue);
        return;
      }
    };

    // Update internal value when external value changes
    React.useEffect(() => {
      if (value === 0 || value === "") {
        setInternalValue("");
      } else if (typeof value === "number") {
        const formattedValue = value.toLocaleString("pt-BR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        });
        setInternalValue(formattedValue);
      }
    }, [value]);

    return (
      <input
        ref={ref}
        value={internalValue}
        onKeyDown={handleKeyDown}
        onChange={() => {}} // Controlled by onKeyDown
        placeholder={placeholder}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        disabled={disabled}
        autoFocus={autoFocus}
        id={id}
        name={name}
        onBlur={onBlur}
        onFocus={onFocus}
        {...props}
      />
    );
  }
);

PercentageInput.displayName = "PercentageInput";

export { PercentageInput };
