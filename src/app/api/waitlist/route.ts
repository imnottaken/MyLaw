import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
const emailFrom = process.env.EMAIL_FROM || "MyLaw <onboarding@resend.dev>";
const googleSheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role, source = "waitlist_page" } = body;

    // 1. Validation
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address format." },
        { status: 400 }
      );
    }

    const sanitizedRole =
      role === "lawyer"
        ? "lawyer"
        : role === "help" || role === "individual"
        ? "help"
        : null;

    const userAgent = request.headers.get("user-agent") || undefined;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      undefined;

    // 2. Insert into Supabase
    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        email: trimmedEmail,
        role: sanitizedRole,
        source,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) {
      // Handle unique email constraint violation gracefully (code 23505)
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          alreadyRegistered: true,
          message: "You're already on the waitlist! We'll keep you updated.",
        });
      }

      console.error("Supabase waitlist error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to join waitlist. Please try again." },
        { status: 500 }
      );
    }

    // 3. Sync to Google Sheets if configured
    if (googleSheetsWebhookUrl) {
      try {
        fetch(googleSheetsWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            email: trimmedEmail,
            role: sanitizedRole === "lawyer" ? "Lawyer" : sanitizedRole === "help" ? "Individual" : "Not specified",
            source,
            timestamp: new Date().toISOString(),
          }),
        }).catch((err) => console.error("Google Sheets async sync error:", err));
      } catch (sheetErr) {
        console.error("Google Sheets trigger error:", sheetErr);
      }
    }

    // 4. Send Email Notifications if Resend is configured
    if (resend) {
      try {
        const roleLabel =
          sanitizedRole === "lawyer"
            ? "Lawyer / Practitioner"
            : sanitizedRole === "help"
            ? "Individual seeking legal help"
            : "Not specified";

        // Admin notification email
        if (adminEmail) {
          await resend.emails.send({
            from: emailFrom,
            to: adminEmail,
            subject: `🎉 New MyLaw Waitlist Signup: ${trimmedEmail}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #172033; max-width: 600px; margin: 0 auto; border: 1px solid #E6E8EC; rounded: 8px;">
                <div style="margin-bottom: 20px;">
                  <h2 style="color: #285A8E; margin: 0 0 8px 0; font-size: 20px;">New Waitlist Registration</h2>
                  <p style="color: #667085; font-size: 14px; margin: 0;">A new user just joined the MyLaw waitlist.</p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                  <tr style="border-bottom: 1px solid #F0F2F5;">
                    <td style="padding: 10px 0; color: #667085; width: 120px;">Email:</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #172033;">${trimmedEmail}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F0F2F5;">
                    <td style="padding: 10px 0; color: #667085;">Role:</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #285A8E;">${roleLabel}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F0F2F5;">
                    <td style="padding: 10px 0; color: #667085;">Source:</td>
                    <td style="padding: 10px 0; color: #172033;">${source}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #667085;">Date:</td>
                    <td style="padding: 10px 0; color: #172033;">${new Date().toUTCString()}</td>
                  </tr>
                </table>

                <div style="font-size: 12px; color: #94A3B8; text-align: center; border-top: 1px solid #E6E8EC; padding-top: 16px;">
                  MyLaw Platform • Waitlist Engine
                </div>
              </div>
            `,
          });
        }

        // Welcome / Confirmation Email to Subscriber
        await resend.emails.send({
          from: emailFrom,
          to: trimmedEmail,
          subject: `You're on the list — Welcome to MyLaw`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px 24px; color: #172033; max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E6E8EC; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #172033; font-size: 24px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.02em;">MyLaw</h1>
                <p style="color: #285A8E; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Priority Access Confirmed</p>
              </div>

              <div style="margin-bottom: 28px; line-height: 1.6; color: #475467; font-size: 15px;">
                <p>Hello,</p>
                <p>Thank you for joining the <strong>MyLaw</strong> waitlist. We're building a simpler, transparent way to discover and connect with verified legal professionals.</p>
                <p>You have secured priority access. As we roll out our initial release cohorts, you'll be among the first invited to explore the platform.</p>
              </div>

              <div style="background: #F7F8FA; border: 1px solid #E6E8EC; border-radius: 8px; padding: 16px; margin-bottom: 28px; font-size: 13px; color: #667085;">
                <strong style="color: #172033;">What's next?</strong><br>
                We'll reach out directly at this address with release milestones and your invitation link. No spam, ever.
              </div>

              <div style="border-top: 1px solid #E6E8EC; padding-top: 20px; text-align: center; font-size: 12px; color: #98A2B3;">
                &copy; 2026 MyLaw. All rights reserved.<br>
                Legal help, simplified.
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        // Log email errors without failing the waitlist signup itself
        console.error("Email notification dispatch error:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: { id: data.id, email: data.email },
    });
  } catch (err: any) {
    console.error("Waitlist API handler error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
