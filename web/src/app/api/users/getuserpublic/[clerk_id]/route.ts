import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'

export async function GET(_req: Request, { params }: { params: { clerk_id: string } }) {
    try {
        const { clerk_id } = params
        if (!clerk_id) 
            return NextResponse.json({ error: 'Missing clerk_id' }, { status: 400 })

        const supabase = createServerSupabaseClient()

        const { data, error } = await supabase
            .from('user_public')
            .select('*')
            .eq('clerk_id', clerk_id)
            .single()

        if (!data) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        if (error) {
            return NextResponse.json({ error: error?.message || 'Failed to fetch user' }, { status: 400 })
        }

        return NextResponse.json({ user: data })
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'Failed to fetch user' }, { status: 500 })
    }
}
