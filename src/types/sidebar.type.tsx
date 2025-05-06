import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type MenuItem = {
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  url: string;
  items?: MenuItem[]; // Make items optional
};

type MenuGroup = {
  type: "GROUP";
  title?: string;
  items: MenuItem[];
};

type MenuSeparator = {
  separator: true;
};

type SeparatorType = {
  separator: boolean;
};

export type MenuItemType = MenuGroup | MenuSeparator | SeparatorType;

export function isMenuGroup(item: MenuItemType): item is MenuGroup {
  return (item as MenuGroup).type === "GROUP";
}
