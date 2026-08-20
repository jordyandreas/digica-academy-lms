"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, FileText, KeyRound, LogOut, Shield, SquarePen } from "lucide-react";
import { LEGAL_PATHS } from "@/features/legal/constants";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthModal, type AuthMode } from "@/components/auth/AuthModal";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { COURSES_ENABLED, PUBLIC_AUTH_ENABLED } from "@/constants/features";
import { cn } from "@/lib/utils";

type HeaderAuthProps = {
  className?: string;
  /** Compact row for course headers */
  variant?: "default" | "compact";
};

function LoggedInActions({
  email,
  displayName,
  onLogout,
  variant,
  className,
}: {
  email: string | null;
  displayName: string | null;
  onLogout: () => void;
  variant: "default" | "compact";
  className?: string;
}) {
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <div className={cn("flex items-center", className)}>
      <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "relative shrink-0 rounded-full p-0 hover:bg-transparent",
              variant === "compact" ? "h-9 w-9" : "h-10 w-10"
            )}
            aria-label="Account menu"
          >
            <UserAvatar
              size={variant === "compact" ? "sm" : "md"}
              className="h-full w-full"
            />
          </Button>
        </DialogTrigger>
        <DialogContent
          variant="drawer-right"
          overlayClassName={cn("account-drawer-overlay bg-black/45")}
          className={cn(
            "account-drawer-panel w-80 max-w-[85vw] overflow-hidden rounded-none border-l border-zinc-200 bg-white shadow-xl"
          )}
        >
          <DialogTitle className="sr-only">Account menu</DialogTitle>
          <div className="flex h-full flex-col">
            <div className="border-b border-zinc-200 px-6 py-6">
              <div className="flex flex-col items-center text-center">
                <UserAvatar size="lg" />
                {displayName ? (
                  <p className="mt-3 text-sm font-semibold text-zinc-900">
                    {displayName}
                  </p>
                ) : null}
                {email ? (
                  <p
                    className={cn(
                      "text-sm",
                      displayName
                        ? "mt-0.5 text-zinc-500"
                        : "mt-3 font-medium text-zinc-900",
                    )}
                  >
                    {email}
                  </p>
                ) : null}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-2"
                >
                  <Link
                    href="/account/profile"
                    onClick={() => setAccountOpen(false)}
                  >
                    <SquarePen className="h-4 w-4" strokeWidth={1.75} />
                    Edit profile
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-0 py-2">
              <nav className="flex flex-col">
                {COURSES_ENABLED ? (
                  <Link
                    href="/courses"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                  >
                    <BookOpen
                      className="h-4 w-4 shrink-0 text-primary"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    My Courses
                  </Link>
                ) : null}
                <Link
                  href="/account/change-password"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  <KeyRound
                    className="h-4 w-4 shrink-0 text-primary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Change password
                </Link>
                <Link
                  href={LEGAL_PATHS.terms}
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  <FileText
                    className="h-4 w-4 shrink-0 text-primary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Terms &amp; Conditions
                </Link>
                <Link
                  href={LEGAL_PATHS.privacy}
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  <Shield
                    className="h-4 w-4 shrink-0 text-primary"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Privacy Notice
                </Link>
                <div className="my-1 h-px bg-zinc-200" />

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setAccountOpen(false);
                    onLogout();
                  }}
                  className="h-auto min-h-0 w-full justify-start gap-2.5 rounded-none px-6 py-3 text-sm font-medium text-red-600 shadow-none hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut
                    className="h-4 w-4 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  Logout
                </Button>
              </nav>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const RESET_LINK_ERROR =
  "This reset link is invalid or expired. Request a new one.";
const PASSWORD_UPDATED_INFO =
  "Your password was updated. Log in with your new password.";

export function HeaderAuth({ className, variant = "default" }: HeaderAuthProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);
  const { isLoggedIn, email, displayName, logout } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const authErrorParam = params.get("authError");
    const authParam = params.get("auth");
    const authInfoParam = params.get("authInfo");
    let changed = false;

    if (authErrorParam === "reset") {
      setAuthMode("forgot");
      setAuthError(RESET_LINK_ERROR);
      setAuthInfo(null);
      setModalOpen(true);
      params.delete("authError");
      changed = true;
    } else if (authParam === "login") {
      setAuthMode("login");
      setAuthError(null);
      setAuthInfo(
        authInfoParam === "password-updated" ? PASSWORD_UPDATED_INFO : null
      );
      setModalOpen(true);
      params.delete("auth");
      params.delete("authInfo");
      changed = true;
    }

    if (!changed) return;
    const next = params.toString();
    const path = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", path);
  }, []);

  const openAuth = (mode: AuthMode) => {
    setAuthError(null);
    setAuthInfo(null);
    setAuthMode(mode);
    setModalOpen(true);
  };

  if (isLoggedIn) {
    return (
      <LoggedInActions
        email={email}
        displayName={displayName}
        onLogout={logout}
        variant={variant}
        className={className}
      />
    );
  }

  if (!PUBLIC_AUTH_ENABLED) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        type="button"
        variant="ghost"
        onClick={() => openAuth("login")}
        className="h-auto px-0 py-0 text-sm font-medium text-primary shadow-none hover:bg-transparent hover:text-primary/80"
      >
        Log In
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => openAuth("register")}
        className={cn(
          "relative overflow-hidden rounded-full px-5 py-2.5 font-bold text-primary",
          "border border-white/70 bg-linear-to-br from-white/75 via-white/40 to-primary/18",
          "shadow-[0_8px_24px_rgba(98,10,121,0.14),inset_0_1px_0_rgba(255,255,255,0.92)]",
          "ring-1 ring-inset ring-white/80",
          "backdrop-blur-xl backdrop-saturate-150",
          "transition-all duration-200",
          "hover:border-white/90 hover:bg-transparent hover:from-white/85 hover:via-white/50 hover:to-primary/25",
          "hover:text-primary hover:shadow-[0_10px_28px_rgba(98,10,121,0.2),inset_0_1px_0_rgba(255,255,255,1)]",
          "focus-visible:ring-primary/40",
          variant === "compact" && "h-9 px-4 py-2"
        )}
      >
        Join for Free
      </Button>
      <AuthModal
        open={modalOpen}
        onOpenChange={(next) => {
          setModalOpen(next);
          if (!next) {
            setAuthError(null);
            setAuthInfo(null);
          }
        }}
        defaultMode={authMode}
        initialError={authError}
        initialInfo={authInfo}
      />
    </div>
  );
}
