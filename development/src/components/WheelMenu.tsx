import "@ncdai/react-wheel-picker/style.css";
import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

// --- Wheel Picker Primitive Wrappers ---

type WheelPickerValue = WheelPickerPrimitive.WheelPickerValue;

type WheelPickerOption<T extends WheelPickerValue = string> =
  WheelPickerPrimitive.WheelPickerOption<T>;

type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames;

function WheelPickerWrapper({
  className,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPickerWrapper>) {
  return (
    <WheelPickerPrimitive.WheelPickerWrapper
      className={cn(
        "w-56 rounded-lg border border-zinc-200 px-1 shadow-xs dark:border-zinc-700/80",
        "*:data-rwp:first:*:data-rwp-highlight-wrapper:rounded-s-md",
        "*:data-rwp:last:*:data-rwp-highlight-wrapper:rounded-e-md",
        className,
      )}
      {...props}
    />
  );
}

function WheelPicker<T extends WheelPickerValue = string>({
  classNames,
  ...props
}: WheelPickerPrimitive.WheelPickerProps<T>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        optionItem: cn(
          "text-zinc-400 data-disabled:opacity-40 dark:text-zinc-500",
          classNames?.optionItem,
        ),
        highlightWrapper: cn(
          "text-zinc-950 dark:text-zinc-50",
          classNames?.highlightWrapper,
        ),
        highlightItem: cn("data-disabled:opacity-40", classNames?.highlightItem),
      }}
      {...props}
    />
  );
}

// --- Wheel Menu Component ---

export interface WheelMenuProps {
  items: { id: string; title: string }[];
  onSelect: (id: string) => void;
  selectedId: string;
}

export function WheelMenu({ items, onSelect, selectedId }: WheelMenuProps) {
  const options: WheelPickerOption[] = useMemo(
    () =>
      items.map((item) => ({
        value: item.id,
        label: item.title,
      })),
    [items],
  );

  // Ensure selectedId matches one of the options, otherwise fallback to first if available
  const activeValue = options.some((o) => o.value === selectedId)
    ? selectedId
    : options[0]?.value;

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <WheelPickerWrapper className="w-full border-none bg-transparent shadow-none dark:bg-transparent">
        <WheelPicker
          options={options}
          value={activeValue}
          onValueChange={onSelect}
          scrollSensitivity={7}
          optionItemHeight={60}
          visibleCount={20}
          classNames={{
            optionItem:
              "bg-white text-lg text-muted-foreground transition-all duration-300 opacity-60",
            highlightWrapper:
              "bg-white border-none data-rwp-focused:ring-0 dark:data-rwp-focused:ring-0",
            highlightItem: "font-bold text-foreground opacity-100",
          }}
        />
      </WheelPickerWrapper>
    </div>
  );
}
