"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PhoneInputController,
  SelectController,
  TextInputController,
} from "@/components/controllers";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/ui/feedback-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getOrganizationCopy } from "@/constants/organization-copy";
import {
  studentProfileSchema,
  type StudentProfileFormValues,
} from "@/features/profile/student-profile-schema";
import { updateStudentProfile } from "@/features/profile/updateStudentProfile";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { registrationOccupationOptions } from "@/schemas/participant-registration-schema";

type EditProfileFormProps = {
  email: string;
  defaultValues: StudentProfileFormValues;
};

export function EditProfileForm({ email, defaultValues }: EditProfileFormProps) {
  const router = useRouter();
  const form = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const occupation = form.watch("occupation");
  const organizationCopy = useMemo(
    () => getOrganizationCopy(occupation, "en"),
    [occupation],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);

    if (!isSupabaseConfigured()) {
      setFormError("Supabase is not configured.");
      return;
    }

    const supabase = createClient();
    const result = await updateStudentProfile(supabase, values);
    if (result.error) {
      setFormError(result.error);
      return;
    }

    setSuccessOpen(true);
    router.refresh();
  });

  return (
    <form noValidate onSubmit={(event) => void onSubmit(event)} className="space-y-5">
      <TextInputController
        form={form}
        name="full_name"
        label="Full name"
        required
        placeholder="Enter your full name"
        componentProps={{
          input: { autoComplete: "name" },
        }}
      />

      <div className="w-full">
        <Label htmlFor="profile-email" className="text-brand-deep">
          Email
        </Label>
        <Input
          id="profile-email"
          type="email"
          value={email}
          readOnly
          disabled
          className="mt-2 bg-muted/50"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Email is used to sign in and cannot be changed here.
        </p>
      </div>

      <PhoneInputController
        form={form}
        name="phone"
        label="WhatsApp number"
        placeholder="812 3456 7890"
        description="Optional. Used to prefill program registration."
        componentProps={{
          input: { id: "profile-phone", autoComplete: "tel" },
        }}
      />

      <SelectController
        form={form}
        name="occupation"
        label="Occupation / status"
        placeholder="Select status"
        options={registrationOccupationOptions.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        componentProps={{ selectTrigger: { id: "profile-occupation" } }}
      />

      <TextInputController
        form={form}
        name="organization"
        label="Organization / school"
        placeholder={organizationCopy.placeholder}
        description={organizationCopy.helper}
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
        Save profile
      </Button>

      <FeedbackDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        variant="success"
        title="Profile saved"
        description="Your name, WhatsApp, and background details are ready the next time you register for a program."
        confirmLabel="Nice, got it"
      />
    </form>
  );
}
