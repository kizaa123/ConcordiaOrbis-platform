import { NextResponse } from "next/server";
import { getBackendOrigin } from "@/lib/googleAuthUrl";

/** Send the browser to the API to start Google OAuth (avoids Next.js 404 on /api). */
export function GET() {
  return NextResponse.redirect(`${getBackendOrigin()}/api/auth/google`, 302);
}
