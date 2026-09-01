import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

/**
 * Records a denied admin login attempt and (when email sending is configured)
 * notifies the owner. Runs server-side only: the owner address, service-role
 * key and email API key never reach the browser.
 */
export const reportAdminLoginAttempt = createServerFn({ method: "POST" })
  .inputValidator((data: { attemptedEmail: string }) => ({
    attemptedEmail: String(data?.attemptedEmail ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 254),
  }))
  .handler(async ({ data }) => {
    // Always resolve as a no-op for the caller: never leak whether an account
    // exists, whether an alert was sent, or who the owner is.
    try {
      const { logAdminLoginAttempt } = await import("./security.server");
      await logAdminLoginAttempt({
        attemptedEmail: data.attemptedEmail,
        reason: "non_owner_email",
        request: getRequest(),
      });
    } catch (error) {
      console.error("[security] failed to record admin login attempt", error);
    }
    return { ok: true };
  });
