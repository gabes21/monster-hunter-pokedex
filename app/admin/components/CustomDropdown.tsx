"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Element } from "@/types";

export function CustomDropDown({
  text1,
  text2,
  optionList,
  element,
  onValueChange,
}: {
  text1?: string;
  text2?: string;
  optionList: string[];
  element: string;
  onValueChange: (val: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="mx-auto">
            {element || text1 || "Select an element"} <ChevronDown />
          </Button>
        }
      />
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{text2 || "Element List"}</DropdownMenuLabel>

          {optionList.map((item) => (
            <DropdownMenuItem key={item} onClick={() => onValueChange(item)}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
