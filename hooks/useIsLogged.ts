import { useAppSelector } from "@/store/hooks";

export default function useIsLogged() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasAuthData = useAppSelector((state) => !!state.auth.data);

  return isAuthenticated || hasAuthData;
}
