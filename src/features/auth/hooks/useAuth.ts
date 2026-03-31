"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { readAuthSession, writeAuthSession } from "@/features/auth/storage";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const go = () => onStoreChange();
  window.addEventListener("digica-auth-change", go);
  window.addEventListener("storage", go);
  return () => {
    window.removeEventListener("digica-auth-change", go);
    window.removeEventListener("storage", go);
  };
}

function getServerSnapshot() {
  return "0|";
}

function getClientSnapshot() {
  const s = readAuthSession();
  return `${s.isLogin ? "1" : "0"}|${s.email ?? ""}`;
}

export function useAuth() {
  const router = useRouter();
  const snap = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const session = useMemo(() => {
    const pipe = snap.indexOf("|");
    const flag = snap.slice(0, pipe);
    const email = snap.slice(pipe + 1);
    return {
      isLoggedIn: flag === "1",
      email: email.length > 0 ? email : null,
    };
  }, [snap]);

  const login = useCallback((emailArg?: string | null) => {
    writeAuthSession(true, emailArg ?? undefined);
    router.replace("/");
    router.refresh();
  }, [router]);

  const logout = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.clear();
    window.dispatchEvent(new Event("digica-auth-change"));
    router.replace("/");
  }, [router]);

  return {
    isLoggedIn: session.isLoggedIn,
    email: session.email,
    login,
    logout,
  };
}
