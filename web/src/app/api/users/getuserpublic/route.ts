import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const clerk_id = body?.clerkId || body?.clerk_id;
    if (!clerk_id) {
      return NextResponse.json({ error: 'Missing clerkId' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('user_public')
      .select('*')
      .eq('clerk_id', clerk_id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Failed to fetch user' }, { status: 400 });
    }

    return NextResponse.json({ user: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch user' }, { status: 500 });
  }
}
