"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputController } from "@/components/controllers";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/change-password-schema";
import { useAuth } from "@/features/auth/hooks/useAuth";

const emptyValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: emptyValues,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    const result = await changePassword(
      values.currentPassword,
      values.newPassword,
    );
    if (result.error) {
      setFormError(result.error);
      return;
    }

    form.reset(emptyValues);
    setSuccessOpen(true);
  });

  return (
    <>
      <form noValidate onSubmit={(event) => void onSubmit(event)} className="space-y-5">
        <TextInputController
          form={form}
          name="currentPassword"
          label="Current password"
          required
          placeholder="Enter your current password"
          password
          componentProps={{
            input: {
              id: "current-password",
              autoComplete: "current-password",
            },
          }}
        />
        <TextInputController
          form={form}
          name="newPassword"
          label="New password"
          required
          placeholder="At least 6 characters"
          password
          componentProps={{
            input: {
              id: "new-password",
              autoComplete: "new-password",
            },
          }}
        />
        <TextInputController
          form={form}
          name="confirmPassword"
          label="Confirm new password"
          required
          placeholder="Re-enter your new password"
          password
          componentProps={{
            input: {
              id: "confirm-new-password",
              autoComplete: "new-password",
            },
          }}
        />

        {formError ? (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          className="h-11 w-full rounded-lg text-sm font-semibold"
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
        description="Use your new password the next time you log in."
        confirmLabel="Nice, got it"
      />
    </>
  );
}
