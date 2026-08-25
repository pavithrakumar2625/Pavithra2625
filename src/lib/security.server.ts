import { supabaseAdmin } from "@/integrations/supabase/client.server";

const OWNER_EMAIL = "pavi212026@gmail.com";
const APP_NAME = "Pavithra K — AI & Data Science Portfolio";

// Rate limiting: at most 3 alert emails per rolling 30 minutes overall, and at
// most 1 per attempted email address in that window.
const WINDOW_MINUTES = 30;
const MAX_ALERTS_PER_WINDOW = 3;

type LogArgs = {
  attemptedEmail: string;
  reason: "non_owner_email" | "invalid_credentials";
  request: Request | undefined;
};

function clientMeta(request: Request | undefined) {
  const headers = request?.headers;
  const forwarded = headers?.get("x-forwarded-for") ?? "";
  const ip =
    headers?.get("cf-connecting-ip") ??
    (forwarded ? forwarded.split(",")[0]!.trim() : null) ??
    headers?.get("x-real-ip") ??
    null;
  return {
    ip: ip ? ip.slice(0, 64) : null,
    userAgent: (headers?.get("user-agent") ?? "").slice(0, 400) || null,
  };
}

function describeDevice(userAgent: string | null): string {
  if (!userAgent) return "Unknown device";
  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /Chrome\//.test(userAgent)
      ? "Chrome"
      : /Safari\//.test(userAgent)
        ? "Safari"
        : /Firefox\//.test(userAgent)
          ? "Firefox"
          : "Unknown browser";
  const platform = /Android/.test(userAgent)
    ? "Android"
    : /iPhone|iPad/.test(userAgent)
      ? "iOS"
      : /Mac OS X/.test(userAgent)
        ? "macOS"
        : /Windows/.test(userAgent)
          ? "Windows"
          : /Linux/.test(userAgent)
            ? "Linux"
            : "Unknown platform";
  return `${browser} on ${platform}`;
}

export async function logAdminLoginAttempt({ attemptedEmail, reason, request }: LogArgs) {
  const { ip, userAgent } = clientMeta(request);
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

  const { count: recentAlerts } = await supabaseAdmin
    .from("admin_login_attempts")
    .select("id", { count: "exact", head: true })
    .eq("alert_sent", true)
    .gte("created_at", since);

  const { count: sameEmailAlerts } = await supabaseAdmin
    .from("admin_login_attempts")
    .select("id", { count: "exact", head: true })
    .eq("alert_sent", true)
    .eq("attempted_email", attemptedEmail)
    .gte("created_at", since);

  const allowedByRateLimit =
    (recentAlerts ?? 0) < MAX_ALERTS_PER_WINDOW && (sameEmailAlerts ?? 0) === 0;

  const alertSent = allowedByRateLimit
    ? await sendOwnerAlert({ attemptedEmail, reason, ip, userAgent })
    : false;

  await supabaseAdmin.from("admin_login_attempts").insert({
    attempted_email: attemptedEmail,
    reason,
    status: "denied",
    ip_address: ip,
    user_agent: userAgent,
    alert_sent: alertSent,
  });
}

async function sendOwnerAlert(args: {
  attemptedEmail: string;
  reason: string;
  ip: string | null;
  userAgent: string | null;
}): Promise<boolean> {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["ALERT_EMAIL_FROM"];
  if (!apiKey || !from) {
    // Email sending is not configured yet: the attempt is still recorded and
    // visible to the owner in the admin panel.
    console.warn("[security] admin login attempt recorded; email sending not configured");
    return false;
  }

  const when = new Date().toUTCString();
  const reasonLabel =
    args.reason === "invalid_credentials"
      ? "Incorrect password for the administrator account"
      : "Unauthorized email address used on the owner login";

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#0b0813;padding:32px;color:#efeaf7">
      <h1 style="font-size:20px;margin:0 0 16px">Security Alert — Portfolio Admin Login Attempt</h1>
      <p style="margin:0 0 20px;color:#c9c0dd">Someone attempted to access your portfolio admin panel.</p>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#9c8fbb">Application</td><td>${APP_NAME}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#9c8fbb">Attempted email</td><td>${escapeHtml(args.attemptedEmail)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#9c8fbb">Date / time (UTC)</td><td>${when}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#9c8fbb">Status</td><td><strong>Access Denied</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#9c8fbb">Reason</td><td>${reasonLabel}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#9c8fbb">Device / browser</td><td>${escapeHtml(describeDevice(args.userAgent))}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#9c8fbb">IP address</td><td>${escapeHtml(args.ip ?? "Not available")}</td></tr>
      </table>
      <p style="margin:24px 0 0;color:#c9c0dd">If this wasn't you, no action is required. Your administrator account remains protected.</p>
    </div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [OWNER_EMAIL],
        subject: "Security Alert — Portfolio Admin Login Attempt",
        html,
      }),
    });
    if (!response.ok) {
      console.error("[security] alert email rejected", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[security] alert email failed", error);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}
