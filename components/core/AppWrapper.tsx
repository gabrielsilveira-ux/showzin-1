"use client";

import useIsLogged from "../../hooks/useIsLogged";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../common/Loading";
import { RoutesEnum } from "@/configs/routes";
import { getRouteUrl } from "@/utils/router";

interface IProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: IProps) {
  const isLogged = useIsLogged();
  const router = useRouter();

  const isStarted = useAppSelector((state) => state.auth.isStarted);

  useEffect(() => {
    if (isStarted && !isLogged) {
      router.replace(getRouteUrl(RoutesEnum.login));
    }
  }, [isLogged, isStarted, router]);

  if (!isStarted || !isLogged) return <Loading />;

  return children;
}
