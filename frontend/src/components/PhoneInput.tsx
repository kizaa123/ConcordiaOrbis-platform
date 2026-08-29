"use client";

import {
  formatNationalInput,
  getDialCodeForCountryName,
  nationalPlaceholder,
  parsePhoneInput,
} from "@/lib/phone";

interface PhoneInputProps {
  id?: string;
  value: string;
  country: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  hint?: string;
  invalid?: boolean;
}

export function PhoneInput({
  id,
  value,
  country,
  onChange,
  required,
  placeholder,
  className,
  inputClassName,
  hint,
  invalid,
}: PhoneInputProps) {
  const dialCode = getDialCodeForCountryName(country);
  const display = formatNationalInput(value);
  const groupedPlaceholder = placeholder ?? nationalPlaceholder(country);

  return (
    <div className={className}>
      <div
        className={`flex overflow-hidden rounded-xl border bg-white shadow-sm focus-within:ring-2 ${
          invalid
            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-200"
            : "border-brand-200 focus-within:border-brand-500 focus-within:ring-brand-200"
        }`}
      >
        <span className="flex w-[9.5rem] shrink-0 items-center justify-center border-r border-brand-200 bg-brand-50/90 px-3 py-3 text-sm font-semibold tabular-nums sm:w-[11rem]">
          {dialCode ? (
            <span className="text-brand-900">{dialCode}</span>
          ) : (
            <span className="font-medium text-gray-400">country</span>
          )}
        </span>
        <input
          id={id}
          required={required}
          inputMode="numeric"
          autoComplete="tel-national"
          value={display}
          onChange={(e) => onChange(parsePhoneInput(e.target.value, country))}
          placeholder={groupedPlaceholder}
          aria-invalid={invalid || undefined}
          className={
            inputClassName ??
            "min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm tracking-wide focus:outline-none focus:ring-0"
          }
        />
      </div>
      {hint ? <p className="auth-hint mt-1">{hint}</p> : null}
    </div>
  );
}
