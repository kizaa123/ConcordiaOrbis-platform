import { NextRequest, NextResponse } from "next/server";
import { getBackendOrigin } from "@/lib/googleAuthUrl";

/** Alternate Google redirect path without /api — still forward to the API callback. */
export function GET(req: NextRequest) {
  const dest = `${getBackendOrigin()}/api/auth/google/callback${req.nextUrl.search}`;
  return NextResponse.redirect(dest, 302);
}
