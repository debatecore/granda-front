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
    <Select.Trigger>
      <Select.Value />
      <Select.Icon>
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content>
        <Select.ScrollUpButton>
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport>
          <Select.Group>
            {props.options.map((option, i) => {
              return (
                <Select.Item value={option.value} key={i}>
                  <Select.ItemText>{option.text}</Select.ItemText>
                  {option.icon}
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton>
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export default GenericSelect;
