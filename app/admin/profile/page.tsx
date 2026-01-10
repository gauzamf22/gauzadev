import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { SpaceBackground } from "@/components/space-background"
import { Toaster } from "sonner"
import { ProfileClient } from "./profile-client"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch existing profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ProfileClient 
            profile={profile} 
            userId={user.id} 
            userEmail={user.email || ""} 
          />
        </div>
      </div>
    </div>
  )
}