import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'

export async function GET() {
    try {
        const user = await currentUser()
        if (!user)
            return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

        const supabase = createServerSupabaseClient()

        const { data, error } = await supabase
            .from('user_public')
            .select('*')
            .eq('clerk_id', user.id)
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({ user: data })
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'Failed to fetch user' }, { status: 500 })
    }
}
