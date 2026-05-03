"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setIsStarted } from "@/store/auth";
import { fetchUser, cleanUser } from "@/store/user";
import useIsLogged from "@/hooks/useIsLogged";

interface IProps {
  children: React.ReactNode;
}

export default function ApplicationWrapper({ children }: IProps) {
  const dispatch = useAppDispatch();
  const isLogged = useIsLogged();
  const userData = useAppSelector((state) => state.user.data);

  useEffect(() => {
    (async () => {
      if (isLogged && !userData) {
        await dispatch(fetchUser());
      } else if (!isLogged && userData) {
        dispatch(cleanUser());
      }
      dispatch(setIsStarted());
    })();
  }, [dispatch, isLogged, userData]);

  return <>{children}</>;
}
