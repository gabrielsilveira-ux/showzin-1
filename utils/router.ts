import { routes, RoutesEnum } from "@/configs/routes";

export const getPageTitle = (title?: string) => {
  if (!title) return "Ícones";
  return `${title} - Ícones`;
};

export const getRoute = (route: RoutesEnum) =>
  routes.find((o) => o.route === route);

export const getRouteUrl = (
  route: RoutesEnum,
  params?: { [key: string]: string | number }
) => {
  let routeUrl = getRoute(route)?.url;
  if (!routeUrl) return "";

  if (params) {
    Object.keys(params).forEach((param) => {
      routeUrl = routeUrl?.replace(`[${param}]`, params[param].toString());
    });
  }

  return routeUrl;
};

export const scrollUp = () => {
  window.document.scrollingElement?.scrollTo(0, 0);
};

export const isCurrentRoute = (
  name: RoutesEnum,
  url: string,
  params?: { [key: string]: string | number }
): boolean => {
  return getRouteUrl(name, params) === url;
};
