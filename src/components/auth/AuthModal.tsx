"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { TextInputController } from "@/components/controllers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  authFormSchema,
  authFormValues,
  type AuthFormMode,
  type AuthFormValues,
} from "@/features/auth/auth-form-schema";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LEGAL_PATHS } from "@/features/legal/constants";

export type AuthMode = AuthFormMode;

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which form to show when the modal opens. */
  defaultMode?: AuthMode;
  /** Shown once when the modal opens (e.g. expired reset link). */
  initialError?: string | null;
  /** Shown once when the modal opens (e.g. password updated). */
  initialInfo?: string | null;
};

export function AuthModal({
  open,
  onOpenChange,
  defaultMode = "login",
  initialError = null,
  initialInfo = null,
}: AuthModalProps) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const form = useForm<AuthFormValues>({
    defaultValues: authFormValues,
    resolver: (values, context, options) =>
      zodResolver(authFormSchema(mode))(values, context, options),
  });

  const isRegister = mode === "register";
  const isForgot = mode === "forgot";

  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      form.reset(authFormValues);
      setError(initialError);
      setInfo(initialInfo);
    }
  }, [open, defaultMode, initialError, initialInfo, form]);

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    form.setValue("password", "");
    form.setValue("confirmPassword", "");
    form.clearErrors(["password", "confirmPassword"]);
    resetMessages();
  };

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const trimmedEmail = values.email.trim();
    const trimmedName = values.fullName.trim();
    resetMessages();

    if (isForgot) {
      const result = await resetPassword(trimmedEmail);
      if (result.error) {
        setError(result.error);
        return;
      }
      setInfo(
        "If an account exists for this email, we sent a reset link. Open it to choose a new password.",
      );
      return;
    }

    if (isRegister) {
      const result = await signUp(trimmedEmail, values.password, trimmedName);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.alreadyRegistered) {
        setMode("login");
        form.setValue("password", "");
        form.setValue("confirmPassword", "");
        form.clearErrors(["password", "confirmPassword"]);
        setError("This email is already registered. Log in instead.");
        return;
      }
      if (result.needsEmailConfirm) {
        setInfo(
          "We sent a confirmation link to your email. Open it to activate your account, then come back here to log in.",
        );
        return;
      }
      handleOpenChange(false);
      return;
    }

    const result = await signIn(trimmedEmail, values.password);
    if (result.error) {
      setError(result.error);
      return;
    }
    handleOpenChange(false);
  });

  const title = isForgot
    ? "Reset your password"
    : isRegister
      ? "Create your account"
      : "Log in";
  const description = isForgot
    ? "Enter the email on your account. We will send a reset link if it is registered."
    : isRegister
      ? "Register to join workshops and bootcamps."
      : "Welcome back. Log in to continue.";
  const submitLabel = isForgot
    ? "Send reset link"
    : isRegister
      ? "Create account"
      : "Log in";

  const inputProps = {
    className: "h-12",
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[440px] gap-0 border-zinc-200 p-0">
        <form noValidate className="relative px-8 pb-8 pt-10" onSubmit={onSubmit}>
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
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-left text-sm leading-relaxed text-zinc-500">
            {description}
          </DialogDescription>

          <div className="mt-8 space-y-4">
            {isRegister ? (
              <TextInputController
                form={form}
                name="fullName"
                label="Full name"
                required
                placeholder="Your full name"
                componentProps={{
                  input: {
                    ...inputProps,
                    id: "auth-full-name",
                    autoComplete: "name",
                  },
                }}
              />
            ) : null}

            <TextInputController
              form={form}
              name="email"
              label="Email"
              required
              placeholder="name@email.com"
              componentProps={{
                input: {
                  ...inputProps,
                  id: "auth-email",
                  type: "email",
                  autoComplete: "email",
                },
              }}
            />

            {!isForgot ? (
              <TextInputController
                form={form}
                name="password"
                label="Password"
                required
                placeholder="At least 6 characters"
                password
                componentProps={{
                  input: {
                    ...inputProps,
                    id: "auth-password",
                    autoComplete: isRegister
                      ? "new-password"
                      : "current-password",
                  },
                }}
              />
            ) : null}

            {isRegister ? (
              <TextInputController
                form={form}
                name="confirmPassword"
                label="Confirm password"
                required
                placeholder="Re-enter your password"
                password
                componentProps={{
                  input: {
                    ...inputProps,
                    id: "auth-confirm-password",
                    autoComplete: "new-password",
                  },
                }}
              />
            ) : null}
          </div>

          {mode === "login" ? (
            <p className="mt-3 text-right text-sm">
              <button
                type="button"
                className="font-semibold text-primary underline-offset-2 hover:underline"
                onClick={() => switchMode("forgot")}
              >
                Forgot password?
              </button>
            </p>
          ) : null}

          {error ? (
            <p
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium leading-relaxed text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          {info ? (
            <p
              className="mt-4 rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-3 text-sm font-medium leading-relaxed text-zinc-800"
              role="status"
            >
              {info}
            </p>
          ) : null}

          <Button
            type="submit"
            className="mt-4 h-12 w-full rounded-lg text-base font-semibold"
            loading={form.formState.isSubmitting}
          >
            {submitLabel}
          </Button>

          <p className="mt-4 text-center text-sm text-zinc-600">
            {isForgot ? (
              <>
                Remembered your password?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                  onClick={() => switchMode("login")}
                >
                  Log in
                </button>
              </>
            ) : isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                  onClick={() => switchMode("login")}
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                  onClick={() => switchMode("register")}
                >
                  Register
                </button>
              </>
            )}
          </p>

          <p className="mt-8 text-center text-xs leading-relaxed text-zinc-500">
            By continuing, you agree to our{" "}
            <Link
              href={LEGAL_PATHS.terms}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-primary underline underline-offset-2"
            >
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link
              href={LEGAL_PATHS.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-primary underline underline-offset-2"
            >
              Privacy Notice
            </Link>
            .
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
