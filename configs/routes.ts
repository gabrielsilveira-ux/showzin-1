import { Route } from "@/types/routes";

export enum RoutesEnum {
  login = "login",
  home = "home",
  producers = "producers",
  producersDetails = "producersDetails",
}

export const routes: Route[] = [
  {
    route: RoutesEnum.login,
    url: "/login",
  },
  {
    route: RoutesEnum.home,
    url: "/",
  },
  {
    route: RoutesEnum.producers,
    url: "/produtoras",
  },
  {
    route: RoutesEnum.producersDetails,
    url: "/produtoras/[producerId]",
  },
];
