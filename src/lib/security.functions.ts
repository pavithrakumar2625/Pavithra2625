import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

type AttemptInput = {
  attemptedEmail: string;
  reason: "non_owner_email" | "invalid_credentials";
};

/**
 * Records a denied admin login attempt and (when email sending is configured)
 * notifies the owner. Runs server-side only: the owner address, service-role
 * key and email API key never reach the browser.
 */
export const reportAdminLoginAttempt = createServerFn({ method: "POST" })
  .inputValidator((data: AttemptInput): AttemptInput => {
    const email = String(data?.attemptedEmail ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 254);
    const reason = data?.reason === "invalid_credentials" ? "invalid_credentials" : "non_owner_email";
    return { attemptedEmail: email, reason };
  })
  .handler(async ({ data }) => {
    // Always resolve as a no-op for the caller: never leak whether an account
    // exists, whether an alert was sent, or who the owner is.
    try {
      const { logAdminLoginAttempt } = await import("./security.server");
      await logAdminLoginAttempt({
        ...data,
        request: getRequest(),
      });
    } catch (error) {
      console.error("[security] failed to record admin login attempt", error);
    }
    return { ok: true };
  });
