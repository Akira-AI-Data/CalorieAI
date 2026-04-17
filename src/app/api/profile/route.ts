import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'

type ProfileInput = {
  full_name?: string
  date_of_birth?: string
  gender?: string
  location?: string | null
  latitude?: number | null
  longitude?: number | null
  height_cm?: number | null
  weight_kg?: number | null
  age?: number | null
  activity_level?: string
  daily_calories?: number
  daily_protein?: number
  daily_carbs?: number
  daily_fat?: number
  daily_water?: number
  family_profiles?: unknown
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ profile: data })
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: ProfileInput
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const required = ['full_name', 'date_of_birth', 'gender', 'height_cm', 'weight_kg', 'activity_level']
  const missing = required.filter((k) => !body[k as keyof ProfileInput])
  if (missing.length) {
    return NextResponse.json({ error: `missing fields: ${missing.join(', ')}` }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({ user_id: session.user.id, ...body }, { onConflict: 'user_id' })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ profile: data })
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: ProfileInput
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .update(body)
    .eq('user_id', session.user.id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ profile: data })
}
