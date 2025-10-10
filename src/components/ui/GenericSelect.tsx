import { LanguageCode } from "@/types/Language";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import React from "react";
import { JSX } from "react";

export type SelectOption = {
  value: string;
  text: string;
  icon?: JSX.Element;
};

type GenericSelectProps = {
  options: SelectOption[];
  value?: string;
  onValueChange: (newValue: LanguageCode) => void;
};

const GenericSelect = (props: GenericSelectProps) => (
  <Select.Root onValueChange={props.onValueChange} value={props.value}>
    <Select.Trigger
      className="
      inline-flex items-center justify-center gap-1.5
      rounded-md px-4 h-9
      text-sm leading-none
      bg-stone-700/45 border-stone-700
      shadow-md
      hover:border-stone-500
      focus:outline-none focus:ring-2 focus:ring-black
    "
    >
      <Select.Icon>
        <ChevronDownIcon />
      </Select.Icon>
      <Select.Value />
      {props.value ? getSelectedIcon(props.value, props.options) : ""}
    </Select.Trigger>

    <Select.Portal>
      <Select.Content
        className="
        overflow-hidden
        bg-stone-800 rounded-lg shadow-lg
      "
      >
        <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-stone-700/45">
          <ChevronUpIcon />
        </Select.ScrollUpButton>

        <Select.Viewport className="p-1.5">
          <Select.Group>
            {props.options.map((option, i) => (
              <Select.Item
                key={i}
                value={option.value}
                className="
                text-sm leading-none
                rounded px-6 h-7
                flex items-center relative select-none
                data-[highlighted]:outline-none data-[highlighted]:bg-stone-700 data-[highlighted]:text-white
              "
              >
                <Select.ItemText>{option.text}</Select.ItemText>
                {option.icon}
                <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>

        <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-stone-700/45">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const getSelectedIcon = (value: string, options: SelectOption[]) => {
  const selectedOption = options.filter((option) => {
    return option.value == value;
  })[0];
  return selectedOption.icon;
};

export default GenericSelect;
