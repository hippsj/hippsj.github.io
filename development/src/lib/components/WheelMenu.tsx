import "@ncdai/react-wheel-picker/style.css";
import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

// --- Wheel Picker Primitive Wrappers ---

type WheelPickerValue = WheelPickerPrimitive.WheelPickerValue;

type WheelPickerOption<T extends WheelPickerValue = string> =
  WheelPickerPrimitive.WheelPickerOption<T>;

type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames;

interface WrapperProps extends React.ComponentProps<
  typeof WheelPickerPrimitive.WheelPickerWrapper
> {
  isHorizontal?: boolean;
}

function WheelPickerWrapper({ className, isHorizontal, ...props }: WrapperProps) {
  return (
    <WheelPickerPrimitive.WheelPickerWrapper
      className={cn(
        "rounded-lg border border-zinc-200 px-1 shadow-xs dark:border-zinc-700/80 transition-transform duration-300",
        isHorizontal ? "w-auto h-screen rotate-[-90deg] origin-center scale-125" : "w-56",
        className,
      )}
      {...props}
    />
  );
}

interface PickerProps<
  T extends WheelPickerValue = string,
> extends WheelPickerPrimitive.WheelPickerProps<T> {
  isHorizontal?: boolean;
  onItemClick?: (value: T) => void;
}

function WheelPicker<T extends WheelPickerValue = string>({
  classNames,
  isHorizontal,
  options,
  onItemClick,
  ...props
}: PickerProps<T>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      options={options.map((opt) => ({
        ...opt,
        label: (
          <div
            className="w-full h-full flex items-center justify-center"
            onClick={(e) => {
              // Intercept click for immediate selection
              if (onItemClick) {
                onItemClick(opt.value);
              }
            }}
          >
            <span className={isHorizontal ? "rotate-[90deg] whitespace-nowrap" : ""}>
              {opt.label}
            </span>
          </div>
        ),
      }))}
      classNames={{
        optionItem: cn(
          "text-zinc-400 data-disabled:opacity-40 dark:text-zinc-500 hover:text-foreground hover:opacity-100",
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
  isHorizontal?: boolean;
}

export function WheelMenu({ items, onSelect, selectedId, isHorizontal }: WheelMenuProps) {
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
    <div
      className={cn(
        "flex h-full w-full items-center justify-center overflow-hidden",
        isHorizontal && "pt-4",
      )}
    >
      <WheelPickerWrapper
        className="w-full border-none bg-card shadow-none dark:bg-card"
        isHorizontal={isHorizontal}
      >
        <WheelPicker
          options={options}
          value={activeValue}
          onValueChange={onSelect}
          onItemClick={onSelect}
          scrollSensitivity={7}
          optionItemHeight={60}
          visibleCount={20}
          classNames={{
            optionItem:
              "bg-card text-lg text-muted-foreground transition-all hover:text-foreground duration-300 opacity-60",
            highlightWrapper:
              "bg-card border-none data-rwp-focused:ring-0 dark:data-rwp-focused:ring-0",
            highlightItem: "font-bold text-brand-purple opacity-100",
          }}
        />
      </WheelPickerWrapper>
    </div>
  );
}
