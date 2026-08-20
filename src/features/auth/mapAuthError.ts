import type { AuthError } from "@supabase/supabase-js";

const EMAIL_RATE_LIMIT_MESSAGE =
  "Too many emails were sent just now. Check your inbox for the last email, or wait a few minutes and try again.";

export function mapAuthError(error: AuthError | { message: string; code?: string }): string {
  const code = "code" in error ? error.code : undefined;
  const message = error.message.toLowerCase();

  if (
    code === "over_email_send_rate_limit" ||
    message.includes("email rate limit exceeded")
  ) {
    return EMAIL_RATE_LIMIT_MESSAGE;
  }

  return error.message;
}
