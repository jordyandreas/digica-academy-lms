"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputController } from "@/components/controllers";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/reset-password-schema";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const emptyValues: ResetPasswordFormValues = {
  password: "",
  confirmPassword: "",
};

export function ResetPasswordForm() {
  const router = useRouter();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: emptyValues,
  });
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }

    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: values.password,
    });
    if (updateError) {
      setError(updateError.message);
      return;
    }

    form.reset(emptyValues);
    setSuccessOpen(true);
  });

  return (
    <>
      <form noValidate className="space-y-4" onSubmit={onSubmit}>
        <TextInputController
          form={form}
          name="password"
          label="New password"
          required
          placeholder="At least 6 characters"
          password
          componentProps={{
            input: {
              className: "h-12",
              id: "reset-password",
              autoComplete: "new-password",
            },
          }}
        />
        <TextInputController
          form={form}
          name="confirmPassword"
          label="Confirm password"
          required
          placeholder="Re-enter your password"
          password
          componentProps={{
            input: {
              className: "h-12",
              id: "reset-confirm-password",
              autoComplete: "new-password",
            },
          }}
        />
        {error ? (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium leading-relaxed text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          className="h-12 w-full rounded-lg text-base font-semibold"
          loading={form.formState.isSubmitting}
        >
          Update password
        </Button>
      </form>
      <FeedbackDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        variant="success"
        title="Password updated"
        description="Your password has been changed. Continue to log in with your new password."
        confirmLabel="Done"
        onConfirm={async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          router.replace("/?auth=login&authInfo=password-updated");
          router.refresh();
        }}
      />
    </>
  );
}
