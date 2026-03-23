import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { Pool } from "@neondatabase/serverless";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  basePath: "/api/auth",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  // Force emailVerified = false for new signups so OTP verification is required
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              emailVerified: false,
            },
          };
        },
      },
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`Sending OTP to ${email}, type: ${type}, otp: ${otp}`);
        
        if (type === "email-verification") {
          await resend.emails.send({
            from: "BuatLirik <onboarding@resend.dev>",
            to: email,
            subject: `Kode Verifikasi BuatLirik: ${otp}`,
            html: `
              <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #7c3aed;">🎵 BuatLirik</h2>
                <p>Hai! Masukkan kode ini untuk verifikasi email kamu:</p>
                <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${otp}</span>
                </div>
                <p style="color: #6b7280; font-size: 14px;">Kode berlaku 10 menit. Jangan bagikan ke siapapun.</p>
              </div>
            `,
          });
        }
      },
      otpLength: 6,
      expiresIn: 600, // 10 minutes
    }),
  ],
});

// Helper to get session from request headers
export async function getSession() {
  try {
    const { headers } = await import("next/headers");
    const headersList = headers();
    const cookieHeader = headersList.get("cookie") || "";

    const response = await auth.api.getSession({
      headers: new Headers({ cookie: cookieHeader }),
    });

    return response;
  } catch {
    return null;
  }
}
