import { IconType } from "react-icons";
import { RoutesEnum } from "@/configs/routes";

export type Route = {
  route: RoutesEnum;
  url: string;
  title?: string;
  icon?: IconType;
};

export type BreadcrumbItem = {
  route: RoutesEnum;
  isDisabled?: boolean;
  type?: string;
  params?: {
    [key: string]: string;
  };
};

export interface SidebarRoute {
  name: string;
  hide?: boolean;
  links: SidebarRouteLink[];
}

export interface SidebarRouteLink {
  name?: string;
  permissions?: string[];
  index?: number;
  icon?: IconType;
  route: RoutesEnum;
  params?: { [key: string]: string | number };
  disabled?: boolean;
  isCurrent?: boolean;
}
