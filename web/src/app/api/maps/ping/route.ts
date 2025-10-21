import { NextResponse } from "next/server"; 
import { GOOGLE_MAPS_API_KEY } from "@/lib/google";

export async function GET(){
    const hasKey = !!GOOGLE_MAPS_API_KEY;
    return NextResponse.json({ ok:true, hasKey });
}