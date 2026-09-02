import assert from "node:assert/strict";
import { POST } from "../src/app/api/waitlist/route.ts";
import { NextRequest } from "next/server";
import { supabase } from "../src/lib/supabase.ts";

async function runApiUnitTests() {
  console.log("=== Running API Route Direct Unit & Integration Tests ===");

  function createRequest(body, headers = {}) {
    const req = new NextRequest("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "MyLaw-Test-Runner/1.0",
        "x-forwarded-for": "127.0.0.1",
        ...headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
    return req;
  }

  // 1. Invalid JSON body
  {
    const req = createRequest("not a json string");
    const res = await POST(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /Invalid JSON/i);
    console.log("✓ Invalid JSON returns 400 Bad Request");
  }

  // 2. Missing email
  {
    const req = createRequest({ mobile: "9876543210" });
    const res = await POST(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /email/i);
    console.log("✓ Missing email returns 400 Bad Request");
  }

  // 3. Malformed email
  {
    const req = createRequest({ email: "invalid-email", mobile: "9876543210" });
    const res = await POST(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /valid email address/i);
    console.log("✓ Malformed email returns 400 Bad Request");
  }

  // 4. Missing mobile
  {
    const req = createRequest({ email: "test@example.com", mobile: "" });
    const res = await POST(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /mobile/i);
    console.log("✓ Missing mobile returns 400 Bad Request");
  }

  // 5. Malformed mobile (<10 digits or alphabets)
  {
    const req = createRequest({ email: "test@example.com", mobile: "12345" });
    const res = await POST(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /10-digit mobile/i);
    console.log("✓ Malformed mobile returns 400 Bad Request");
  }

  // 6. Lawyer missing bar_council_state
  {
    const req = createRequest({
      email: "lawyer.test@example.com",
      mobile: "+91 98765 43210",
      user_type: "lawyer",
      enrollment_number: "D/1234/2020",
    });
    const res = await POST(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /State Bar Council/i);
    console.log("✓ Lawyer missing bar council returns 400 Bad Request");
  }

  // 7. Lawyer invalid bar_council_state
  {
    const req = createRequest({
      email: "lawyer.test@example.com",
      mobile: "+91 98765 43210",
      user_type: "lawyer",
      bar_council_state: "Bar Council of Mars",
      enrollment_number: "D/1234/2020",
    });
    const res = await POST(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /valid Indian State Bar Council/i);
    console.log("✓ Lawyer invalid bar council returns 400 Bad Request");
  }

  // 8. Lawyer missing enrollment_number
  {
    const req = createRequest({
      email: "lawyer.test@example.com",
      mobile: "+91 98765 43210",
      user_type: "lawyer",
      bar_council_state: "Bar Council of Delhi",
      enrollment_number: "   ",
    });
    const res = await POST(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /Enrollment Number/i);
    console.log("✓ Lawyer missing enrollment number returns 400 Bad Request");
  }

  // 9. Successful Individual submission
  const uniqueIndividualEmail = `test.individual.${Date.now()}@example.com`;
  {
    const req = createRequest({
      email: `  ${uniqueIndividualEmail}  `,
      mobile: "+91 (98765) 43210",
      user_type: "individual",
    });
    const res = await POST(req);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.email, uniqueIndividualEmail.toLowerCase());
    assert.equal(data.data.mobile, "9876543210");
    assert.equal(data.data.user_type, "individual");
    assert.equal(data.data.bar_council_state, null);
    assert.equal(data.data.enrollment_number, null);
    assert.equal(data.data.verification_status, "pending");
    console.log("✓ Successful individual submission persists correctly");
  }

  // 10. Duplicate submission handling (Postgres 23505)
  {
    const req = createRequest({
      email: uniqueIndividualEmail,
      mobile: "9876543210",
      user_type: "individual",
    });
    const res = await POST(req);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.alreadyRegistered, true);
    assert.match(data.message, /already on the waitlist/i);
    console.log("✓ Duplicate submission returns 200 with alreadyRegistered: true");
  }

  // 11. Successful Lawyer submission
  const uniqueLawyerEmail = `test.lawyer.${Date.now()}@lawchambers.in`;
  {
    const req = createRequest({
      email: uniqueLawyerEmail,
      mobile: "09876543210",
      user_type: "lawyer",
      bar_council_state: "Bar Council of Delhi",
      enrollment_number: "d/9876/2021",
    });
    const res = await POST(req);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.data.email, uniqueLawyerEmail.toLowerCase());
    assert.equal(data.data.mobile, "9876543210");
    assert.equal(data.data.user_type, "lawyer");
    assert.equal(data.data.bar_council_state, "Bar Council of Delhi");
    assert.equal(data.data.enrollment_number, "D/9876/2021");
    assert.equal(data.data.verification_status, "pending");
    console.log("✓ Successful lawyer submission persists and capitalizes enrollment number");
  }

  // Clean up created test records from Supabase
  await supabase.from("waitlist").delete().eq("email", uniqueIndividualEmail.toLowerCase());
  await supabase.from("waitlist").delete().eq("email", uniqueLawyerEmail.toLowerCase());
  console.log("✓ Cleaned up test database records");

  console.log("\nALL 11 API ROUTE UNIT TESTS PASSED SUCCESSFULLY!");
}

runApiUnitTests().catch((err) => {
  console.error("API test failure:", err);
  process.exit(1);
});
