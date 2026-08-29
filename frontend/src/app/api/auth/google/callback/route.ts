import { NextRequest, NextResponse } from "next/server";
import { getBackendOrigin } from "@/lib/googleAuthUrl";

/** Google often redirects here on the app origin — forward the code to the API. */
export function GET(req: NextRequest) {
  const dest = `${getBackendOrigin()}/api/auth/google/callback${req.nextUrl.search}`;
  return NextResponse.redirect(dest, 302);
}
