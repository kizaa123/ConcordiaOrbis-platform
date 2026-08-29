import { NextRequest, NextResponse } from "next/server";
import { getBackendOrigin } from "@/lib/googleAuthUrl";

export const dynamic = "force-dynamic";

/** Google returns here; forward the code to the API for token exchange. */
export function GET(req: NextRequest) {
  const dest = `${getBackendOrigin()}/api/auth/google/callback${req.nextUrl.search}`;
  return NextResponse.redirect(dest, 302);
}
