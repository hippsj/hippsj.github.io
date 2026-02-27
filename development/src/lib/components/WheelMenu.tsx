import "@ncdai/react-wheel-picker/style.css";
import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { Magnetic } from "./ui/Magnetic";

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
        "rounded-lg border-none px-1 transition-transform duration-300",
        isHorizontal ? "w-auto h-screen -rotate-90 origin-center scale-125" : "w-56",
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
            className="w-full h-full flex items-center justify-center px-2"
            data-wheel-item-id={opt.value}
          >
            <Magnetic strength={0.15} className="w-full flex items-center justify-center">
              <span
                className={cn(
                  "text-center leading-snug",
                  isHorizontal ? "rotate-90 whitespace-nowrap" : "line-clamp-3 w-full",
                )}
              >
                {opt.label}
              </span>
            </Magnetic>
          </div>
        ),
      }))}
      classNames={{
        optionItem: cn(
          "data-disabled:opacity-40 hover:opacity-100",
          classNames?.optionItem,
        ),
        highlightWrapper: cn(classNames?.highlightWrapper),
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
        isHorizontal ? "pt-4" : "pb-[20%]",
      )}
    >
      <WheelPickerWrapper
        className="w-full border-none shadow-none"
        isHorizontal={isHorizontal}
      >
        <WheelPicker
          options={options}
          value={activeValue}
          onValueChange={onSelect}
          onItemClick={onSelect}
          scrollSensitivity={7}
          // Use 35px for horizontal (width of slot), 70px for vertical (height of slot)
          optionItemHeight={isHorizontal ? 35 : 70}
          isHorizontal={isHorizontal}
          visibleCount={20}
          classNames={{
            optionItem:
              "text-lg text-nav-foreground/80 transition-all hover:text-nav-foreground duration-300",
            highlightWrapper:
              "bg-nav-bg border-none data-rwp-focused:ring-0 rounded-full",
            highlightItem: "font-bold text-nav-foreground opacity-100",
          }}
        />
      </WheelPickerWrapper>
    </div>
  );
}
