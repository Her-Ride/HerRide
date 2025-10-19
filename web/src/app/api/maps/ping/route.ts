import { NextResponse } from "next/server"; 

export async function GET(){
    const hasKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    return NextResponse.json({ ok:true, hasKey });
}