import { NextResponse } from "next/server";
import { getBackendOrigin } from "@/lib/googleAuthUrl";

export const dynamic = "force-dynamic";

/** Same-origin start — Google never returns to a missing Next /api page. */
export function GET() {
  return NextResponse.redirect(`${getBackendOrigin()}/api/auth/google`, 302);
}
