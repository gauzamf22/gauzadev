import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { SpaceBackground } from "@/components/space-background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button" // Kita akan buat ini

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text mb-8">
            Admin Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/admin/profile">Manage Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Add or update your skills</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/admin/skills">Manage Skills</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Experiences</CardTitle>
                <CardDescription>Add your work experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/admin/experiences">Manage Experiences</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Books</CardTitle>
                <CardDescription>Upload and manage your books</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/admin/books">Manage Books</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Showcase your latest projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/admin/projects">Manage Projects</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Account settings and logout</CardDescription>
              </CardHeader>
              <CardContent>
                <LogoutButton />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}