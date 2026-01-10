"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft, Save, User, Upload, Loader2 } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { toast } from "sonner"

export function ProfileClient({ profile, userId, userEmail }: { profile: any, userId: string, userEmail: string }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    tagline: profile?.tagline || "",
    bio: profile?.bio || ""
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          tagline: formData.tagline,
          bio: formData.bio
        })
        .eq('id', userId)

      if (error) throw error

      toast.success("Profile updated successfully!")
      
      // Revalidate home page cache ⬅️ TAMBAHKAN INI
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: '/' }),
      })
      
      // Refresh current page
      router.refresh()
      
      // Redirect ke admin dashboard setelah 1 detik
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    // ... rest of the component (sama seperti sebelumnya)
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text">
        Profile Management
      </h1>

      {/* Avatar Upload Card */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Profile Picture
          </CardTitle>
          <CardDescription>Upload or update your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            userId={userId}
            currentImageUrl={profile?.profile_image_url}
            bucket="avatars"
            path="profile"
          />
        </CardContent>
      </Card>

      {/* Profile Information Card */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal details and bio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  disabled
                  className="glass bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Full Stack Developer | UI/UX Enthusiast"
                className="glass"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
                className="glass resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}