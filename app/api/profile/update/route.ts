import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract form data
    const full_name = formData.get('full_name') as string
    const tagline = formData.get('tagline') as string
    const bio = formData.get('bio') as string
    const profile_image_url = formData.get('profile_image_url') as string

    // Update profile (sesuai schema table profiles Anda)
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name,
        tagline,
        bio,
        profile_image_url
      })
      .eq('id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}