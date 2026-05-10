import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/home/:path*",
    "/doubt-snap/:path*",
    "/battle/:path*",
    "/vault/:path*",
    "/focus/:path*",
    "/radar/:path*",
    "/explore/:path*",
    "/profile/:path*",
    "/auth/:path*",
    "/api/:path*",
  ],
};
