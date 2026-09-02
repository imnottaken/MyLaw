import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { INDIAN_STATE_BAR_COUNCILS, StateBarCouncil } from "@/lib/constants";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
const emailFrom = process.env.EMAIL_FROM || "MyLaw Team <onboarding@resend.dev>";
const googleSheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

interface WaitlistRequestBody {
  email?: unknown;
  mobile?: unknown;
  user_type?: unknown;
  role?: unknown;
  bar_council_state?: unknown;
  enrollment_number?: unknown;
  source?: unknown;
}

export async function POST(request: NextRequest) {
  try {
    let body: WaitlistRequestBody;
    try {
      body = (await request.json()) as WaitlistRequestBody;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Request payload must be a valid JSON object." },
        { status: 400 }
      );
    }

    const {
      email,
      mobile,
      user_type,
      role,
      bar_council_state,
      enrollment_number,
      source = "waitlist_page",
    } = body;

    // 1. Email Validation
    if (!email || typeof email !== "string" || email.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address format." },
        { status: 400 }
      );
    }

    // 2. Mobile Validation
    if (!mobile || typeof mobile !== "string" || mobile.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Please provide your mobile number." },
        { status: 400 }
      );
    }

    const rawMobile = mobile.trim();
    const cleanDigits = rawMobile.replace(/[\s\-()]/g, "");
    let coreDigits = cleanDigits;

    if (coreDigits.startsWith("+91")) {
      coreDigits = coreDigits.slice(3);
    } else if (coreDigits.startsWith("91") && coreDigits.length === 12) {
      coreDigits = coreDigits.slice(2);
    } else if (coreDigits.startsWith("0") && coreDigits.length === 11) {
      coreDigits = coreDigits.slice(1);
    }

    const tenDigitRegex = /^\d{10}$/;
    if (!tenDigitRegex.test(coreDigits)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const sanitizedMobile = coreDigits;

    // 3. User Type / Role Handling
    let resolvedUserType: "individual" | "lawyer" = "individual";
    if (user_type === "lawyer" || role === "lawyer") {
      resolvedUserType = "lawyer";
    } else if (
      user_type === "individual" ||
      role === "individual" ||
      role === "help"
    ) {
      resolvedUserType = "individual";
    } else if (user_type && user_type !== "individual" && user_type !== "lawyer") {
      return NextResponse.json(
        { success: false, error: "Invalid user type specified." },
        { status: 400 }
      );
    }

    // 4. Persona-specific Validation
    let validatedBarCouncilState: string | null = null;
    let validatedEnrollmentNumber: string | null = null;

    if (resolvedUserType === "lawyer") {
      if (
        !bar_council_state ||
        typeof bar_council_state !== "string" ||
        bar_council_state.trim() === ""
      ) {
        return NextResponse.json(
          { success: false, error: "Please select your State Bar Council." },
          { status: 400 }
        );
      }

      const trimmedBarCouncil = bar_council_state.trim();
      if (!INDIAN_STATE_BAR_COUNCILS.includes(trimmedBarCouncil as StateBarCouncil)) {
        return NextResponse.json(
          {
            success: false,
            error: "Please select a valid Indian State Bar Council.",
          },
          { status: 400 }
        );
      }
      validatedBarCouncilState = trimmedBarCouncil;

      if (
        !enrollment_number ||
        typeof enrollment_number !== "string" ||
        enrollment_number.trim() === ""
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Please provide your Bar Council Enrollment Number.",
          },
          { status: 400 }
        );
      }
      validatedEnrollmentNumber = enrollment_number.trim().toUpperCase();
    }

    // 5. Metadata extraction
    const userAgent = request.headers.get("user-agent") || undefined;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      undefined;
    const sanitizedSource =
      typeof source === "string" && source.trim() ? source.trim() : "waitlist_page";

    // 6. Supabase Database Insertion (with dual-write role and user_type)
    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        email: trimmedEmail,
        mobile: sanitizedMobile,
        user_type: resolvedUserType,
        role: resolvedUserType === "lawyer" ? "lawyer" : "individual",
        bar_council_state: validatedBarCouncilState,
        enrollment_number: validatedEnrollmentNumber,
        verification_status: "pending",
        source: sanitizedSource,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) {
      // Handle unique email constraint violation gracefully (Postgres code 23505)
      if (
        error.code === "23505" ||
        error.message?.includes("waitlist_email_unique_idx") ||
        error.message?.includes("duplicate key")
      ) {
        return NextResponse.json({
          success: true,
          alreadyRegistered: true,
          message: "You're already on the waitlist! We'll keep you updated.",
        });
      }

      console.error("Supabase waitlist insertion error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to join waitlist. Please try again." },
        { status: 500 }
      );
    }

    // 7. Google Sheets Webhook Sync (Non-blocking async dispatch)
    if (googleSheetsWebhookUrl) {
      try {
        fetch(googleSheetsWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            email: trimmedEmail,
            mobile: sanitizedMobile,
            user_type: resolvedUserType,
            role: resolvedUserType === "lawyer" ? "Lawyer" : "Individual",
            bar_council_state: validatedBarCouncilState || "N/A",
            enrollment_number: validatedEnrollmentNumber || "N/A",
            verification_status: "pending",
            source: sanitizedSource,
            timestamp: new Date().toISOString(),
          }),
        }).catch((err) => console.error("Google Sheets async sync error:", err));
      } catch (sheetErr) {
        console.error("Google Sheets trigger error:", sheetErr);
      }
    }

    // 8. Resend Email Notifications (Admin alert + Persona-tailored subscriber confirmation)
    if (resend) {
      try {
        const personaLabel =
          resolvedUserType === "lawyer" ? "Lawyer / Practitioner" : "Individual";

        // Admin alert email
        if (adminEmail) {
          await resend.emails.send({
            from: emailFrom,
            to: adminEmail,
            subject: `🎉 New ${resolvedUserType === "lawyer" ? "Lawyer" : "Individual"} Waitlist Signup: ${trimmedEmail}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #172033; max-width: 600px; margin: 0 auto; border: 1px solid #E6E8EC; border-radius: 8px; background: #FFFFFF;">
                <div style="margin-bottom: 20px;">
                  <h2 style="color: #285A8E; margin: 0 0 8px 0; font-size: 20px;">New Waitlist Registration</h2>
                  <p style="color: #667085; font-size: 14px; margin: 0;">A new ${personaLabel.toLowerCase()} has joined the MyLaw waitlist.</p>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                  <tr style="border-bottom: 1px solid #F0F2F5;">
                    <td style="padding: 10px 0; color: #667085; width: 160px;">Email:</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #172033;">${trimmedEmail}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F0F2F5;">
                    <td style="padding: 10px 0; color: #667085;">Mobile:</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #172033;">${sanitizedMobile}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F0F2F5;">
                    <td style="padding: 10px 0; color: #667085;">User Type:</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #285A8E;">${personaLabel}</td>
                  </tr>
                  ${
                    resolvedUserType === "lawyer"
                      ? `
                  <tr style="border-bottom: 1px solid #F0F2F5;">
                    <td style="padding: 10px 0; color: #667085;">State Bar Council:</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #172033;">${validatedBarCouncilState}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F0F2F5;">
                    <td style="padding: 10px 0; color: #667085;">Enrollment Number:</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #172033;">${validatedEnrollmentNumber}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #F0F2F5;">
                    <td style="padding: 10px 0; color: #667085;">Verification Status:</td>
                    <td style="padding: 10px 0; font-weight: 600; color: #D97706;">Pending Review</td>
                  </tr>
                  `
                      : ""
                  }
                  <tr style="border-bottom: 1px solid #F0F2F5;">
                    <td style="padding: 10px 0; color: #667085;">Source:</td>
                    <td style="padding: 10px 0; color: #172033;">${sanitizedSource}</td>
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

        // Subscriber welcome email (tailored for individual vs lawyer)
        if (resolvedUserType === "individual") {
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
                  We'll reach out directly at this address (${trimmedEmail}) or mobile (${sanitizedMobile}) with release milestones and your invitation link. No spam, ever.
                </div>

                <div style="border-top: 1px solid #E6E8EC; padding-top: 20px; text-align: center; font-size: 12px; color: #98A2B3;">
                  &copy; 2026 MyLaw. All rights reserved.<br>
                  Legal help, simplified.
                </div>
              </div>
            `,
          });
        } else {
          await resend.emails.send({
            from: emailFrom,
            to: trimmedEmail,
            subject: `Priority Access Confirmed — MyLaw Lawyer Verification`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px 24px; color: #172033; max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E6E8EC; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #172033; font-size: 24px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.02em;">MyLaw</h1>
                  <p style="color: #2F7C78; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Lawyer Verification Priority Cohort</p>
                </div>

                <div style="margin-bottom: 28px; line-height: 1.6; color: #475467; font-size: 15px;">
                  <p>Dear Advocate,</p>
                  <p>Thank you for registering your practice for the <strong>MyLaw</strong> early access practitioner network.</p>
                  <p>We have received your credential submission for verification:</p>
                  <div style="background: #F7F8FA; border: 1px solid #E6E8EC; border-radius: 8px; padding: 14px 16px; margin: 16px 0; font-size: 14px;">
                    <p style="margin: 4px 0;"><strong>State Bar Council:</strong> ${validatedBarCouncilState}</p>
                    <p style="margin: 4px 0;"><strong>Enrollment Number:</strong> ${validatedEnrollmentNumber}</p>
                    <p style="margin: 4px 0;"><strong>Contact Mobile:</strong> ${sanitizedMobile}</p>
                    <p style="margin: 4px 0;"><strong>Verification Status:</strong> <span style="color: #D97706; font-weight: 600;">Pending Verification</span></p>
                  </div>
                  <p>Our practitioner onboarding team will verify your Bar Council credentials before our platform beta launch. Once approved, you will gain priority access to your verified digital practice profile and prospective client inquiries.</p>
                </div>

                <div style="background: #F7F8FA; border: 1px solid #E6E8EC; border-radius: 8px; padding: 16px; margin-bottom: 28px; font-size: 13px; color: #667085;">
                  <strong style="color: #172033;">Practitioner Onboarding Support</strong><br>
                  If you need to update any details, simply reply directly to this email or reach our onboarding desk.
                </div>

                <div style="border-top: 1px solid #E6E8EC; padding-top: 20px; text-align: center; font-size: 12px; color: #98A2B3;">
                  &copy; 2026 MyLaw. All rights reserved.<br>
                  Legal practice, modernized.
                </div>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        // Log email dispatch errors without failing the waitlist registration
        console.error("Resend email notification dispatch error:", emailErr);
      }
    }

    // 9. Return Successful JSON Response
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        email: data.email,
        user_type: data.user_type,
        mobile: data.mobile,
        bar_council_state: data.bar_council_state,
        enrollment_number: data.enrollment_number,
        verification_status: data.verification_status,
      },
    });
  } catch (err: unknown) {
    console.error("Waitlist API unexpected handler error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
