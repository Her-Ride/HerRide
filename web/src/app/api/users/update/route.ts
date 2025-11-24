import { NextResponse } from 'next/server'
import { currentUser, clerkClient } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'

// PATCH /api/users/update
export async function PATCH(req: Request) {
  try {
    const user = await currentUser()
    if (!user)
        return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
    const supabase = createServerSupabaseClient()
    
    const body = await req.json().catch(() => ({}));
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Whitelist allowed fields
    const allowed: Record<string, boolean> = {
      first_name: true,
      last_name: true,
      middle_initial: true,
      phone_number: true,
      share_phone: true,
      email: true,
      share_email: true,
      bio: true,
      profile_img_url: true,
      vehicle_make: true,
      vehicle_model: true,
      vehicle_year: true,
      vehicle_color: true,
      license_plate_number: true,
      seats_available: true,
    };

    const updates: Record<string, any> = {};
    for (const [k, v] of Object.entries(body)) {
      if (allowed[k]) updates[k] = v;
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Basic inline validations
    if (updates.vehicle_year) {
      const yr = Number(updates.vehicle_year);
      if (!(yr > 1000 && yr < 9999)) return NextResponse.json({ error: 'Invalid vehicle_year' }, { status: 400 });
    }
    if (updates.seats_available) {
      const seats = Number(updates.seats_available);
      if (seats < 0) return NextResponse.json({ error: 'Invalid seats_available' }, { status: 400 });
    }
    if (updates.middle_initial) {
      updates.middle_initial = String(updates.middle_initial).slice(0,1).toUpperCase();
    }

    // Update Clerk profile 
    try {
      const clerk = await clerkClient();
      const clerkNameUpdates: Record<string, any> = {};
      if (Object.prototype.hasOwnProperty.call(updates, 'first_name')) {
        clerkNameUpdates.firstName = updates.first_name;
      }
      if (Object.prototype.hasOwnProperty.call(updates, 'last_name')) {
        clerkNameUpdates.lastName = updates.last_name;
      }
      if (Object.keys(clerkNameUpdates).length > 0) {
        await clerk.users.updateUser(user.id, clerkNameUpdates);
      }

    } catch (clerkErr: any) {
      return NextResponse.json({ error: clerkErr?.message || 'Failed to update Clerk profile' }, { status: 400 });
    }
    
    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('clerk_id', user.id);

      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to update user' }, { status: 500 });
  }
}