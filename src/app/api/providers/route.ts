import { NextResponse } from "next/server";
import { getAvailableProviders } from "@/lib/providers/registry";

export async function GET() {
  return NextResponse.json(getAvailableProviders());
}
