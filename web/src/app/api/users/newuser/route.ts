import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'

export async function POST() {
  try {
    const user = await currentUser()
    if (!user)
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

    const supabase = createServerSupabaseClient()

    const first_name = user.firstName
    const last_name = user.lastName
    const email =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses?.[0]?.emailAddress

    const { error: insertError } = await supabase
      .from('users')
      .insert({ first_name, last_name, email })

    if (insertError)
      return NextResponse.json({ error: insertError.message }, { status: 400 })

    return NextResponse.json({ status: 200 })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Failed to create user' },
      { status: 400 },
    )
  }
}