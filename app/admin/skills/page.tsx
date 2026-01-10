import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { SpaceBackground } from "@/components/space-background"
import { SkillsClient } from "./skills-client"
import { Toaster } from "sonner"

export default async function SkillsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's skills
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <SkillsClient initialSkills={skills || []} userId={user.id} />
        </div>
      </div>
    </div>
  )
}