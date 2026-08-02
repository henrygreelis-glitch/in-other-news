import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY?.trim();
const from =
  process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
const to =
  process.env.RESEND_TEST_TO?.trim() || "henrygreelis@gmail.com";

if (!apiKey || apiKey === "re_xxxxxxxxx") {
  throw new Error(
    "Replace re_xxxxxxxxx with your real Resend API key in .env.local as RESEND_API_KEY=..."
  );
}

const resend = new Resend(apiKey);
const { data, error } = await resend.emails.send({
  from,
  to,
  subject: "Hello World",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});

if (error) {
  throw new Error(error.message || "Resend could not send the test email.");
}

console.log(`Test email sent successfully. Email ID: ${data?.id}`);
