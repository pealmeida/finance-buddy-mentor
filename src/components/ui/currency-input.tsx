import * as React from "react";
import { NumericFormat, PatternFormat } from "react-number-format";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
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

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value,
      onChange,
      placeholder = "0,00",
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
      // Handle digit input to start with fraction digits
      if (/\d/.test(e.key)) {
        e.preventDefault();
        const digit = e.key;
        const currentDigits = internalValue.replace(/\D/g, "");
        const newDigits = currentDigits + digit;

        // Convert to cents (last 2 digits are fractional)
        const numValue = parseInt(newDigits) / 100;

        if (onChange) {
          onChange(numValue);
        }

        const formattedValue = numValue.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
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

        const numValue = parseInt(newDigits) / 100;

        if (onChange) {
          onChange(numValue);
        }

        const formattedValue = numValue.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
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
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
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

CurrencyInput.displayName = "CurrencyInput";

// Controller component for react-hook-form
interface CurrencyInputControllerProps extends CurrencyInputProps {
  field?: any; // react-hook-form field
}

const CurrencyInputController = React.forwardRef<
  HTMLInputElement,
  CurrencyInputControllerProps
>(({ field, onChange, onBlur, ...props }, ref) => {
  const handleValueChange = (value: number) => {
    if (field?.onChange) {
      field.onChange(value);
    }
    if (onChange) {
      onChange(value);
    }
  };

  const handleBlur = () => {
    if (field?.onBlur) {
      field.onBlur();
    }
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <CurrencyInput
      ref={ref}
      value={field?.value === 0 ? "" : field?.value}
      onChange={handleValueChange}
      onBlur={handleBlur}
      name={field?.name}
      {...props}
    />
  );
});

CurrencyInputController.displayName = "CurrencyInputController";

export { CurrencyInput, CurrencyInputController };
