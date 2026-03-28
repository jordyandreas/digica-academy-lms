"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (email?: string | null) => void;
};

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-5 w-5 shrink-0", className)}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AuthModal({ open, onOpenChange, onLogin }: AuthModalProps) {
  const [email, setEmail] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) setEmail("");
    onOpenChange(next);
  };

  const finish = (emailValue?: string | null) => {
    onLogin(emailValue ?? null);
    handleOpenChange(false);
  };

  const handleContinue = () => {
    const trimmed = email.trim();
    if (!trimmed.includes("@")) return;
    finish(trimmed);
  };

  const handleGoogle = () => {
    finish(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[440px] gap-0 border-zinc-200 p-0">
        <div className="relative px-8 pb-8 pt-10">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Close"
            onClick={() => handleOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          <DialogTitle className="pr-10 text-left text-xl font-bold tracking-tight text-zinc-900">
            Log in or create account
          </DialogTitle>
          <DialogDescription className="mt-2 text-left text-sm leading-relaxed text-zinc-500">
            Learn on your own time with structured lessons and hands-on projects.
          </DialogDescription>

          <div className="mt-8 space-y-2">
            <label
              htmlFor="auth-email"
              className="text-sm font-medium text-zinc-800"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button
            type="button"
            className="mt-4 h-12 w-full rounded-lg text-base font-semibold"
            disabled={!email.trim().includes("@")}
            onClick={handleContinue}
          >
            Continue
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-zinc-500">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            className="h-12 w-full gap-3 rounded-lg border-2 border-zinc-900 bg-white text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            <GoogleGlyph />
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-xs leading-relaxed text-zinc-500">
            By continuing, you agree to our{" "}
            <a href="#" className="cursor-pointer text-primary underline underline-offset-2">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="cursor-pointer text-primary underline underline-offset-2">
              Privacy Notice
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
