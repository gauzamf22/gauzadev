"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Award, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function SkillsClient({ initialSkills, userId }: { initialSkills: any[], userId: string }) {
  const [skills, setSkills] = useState(initialSkills)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    category: ""
  })
  const router = useRouter()
  const supabase = createClient()

  const revalidateHome = async () => {
    // Revalidate home page cache ⬅️ TAMBAHKAN HELPER FUNCTION INI
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: '/' }),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([
          {
            user_id: userId,
            name: formData.name,
            level: parseInt(formData.level),
            category: formData.category
          }
        ])
        .select()

      if (error) throw error

      setSkills([...skills, data[0]])
      setFormData({ name: "", level: "", category: "" })
      
      toast.success("Skill added successfully!")
      
      // Revalidate home page ⬅️ TAMBAHKAN INI
      await revalidateHome()
      router.refresh()
    } catch (error) {
      console.error('Error adding skill:', error)
      toast.error("Failed to add skill. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSkills(skills.filter(skill => skill.id !== id))
      toast.success("Skill deleted successfully!")
      
      // Revalidate home page ⬅️ TAMBAHKAN INI
      await revalidateHome()
      router.refresh()
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast.error("Failed to delete skill.")
    }
  }

  const getLevelColor = (level: number) => {
    if (level >= 90) return 'border-green-500 text-green-500'
    if (level >= 70) return 'border-blue-500 text-blue-500'
    if (level >= 50) return 'border-yellow-500 text-yellow-500'
    return 'border-gray-500 text-gray-500'
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
        Skills Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add New Skill Form */}
        <Card className="glass lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Add New Skill
            </CardTitle>
            <CardDescription>Add a new skill to your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="React.js"
                  required
                  className="glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger className="glass">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Skill Level (0-100)</Label>
                <Input
                  id="level"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  placeholder="85"
                  required
                  className="glass"
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Skill
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Skills List - sama seperti sebelumnya */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Your Skills</CardTitle>
              <CardDescription>
                Manage and showcase your skills ({skills?.length || 0} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!skills || skills.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No skills added yet</p>
                  <p className="text-sm text-muted-foreground">
                    Add your first skill using the form on the left
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="glass p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{skill.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {skill.category}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getLevelColor(skill.level)}`}
                            >
                              Level {skill.level}%
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Proficiency</span>
                              <span className="font-medium">{skill.level}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(skill.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills by Category - sama seperti sebelumnya */}
          {skills && skills.length > 0 && (
            <Card className="glass">
              <CardHeader>
                <CardTitle>Skills by Category</CardTitle>
                <CardDescription>Visual breakdown of your skillset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    skills.reduce((acc, skill) => {
                      const category = skill.category || 'Other';
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(skill);
                      return acc;
                    }, {} as Record<string, typeof skills>)
                  ).map(([category, categorySkills]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-muted-foreground">
                          {category}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill) => (
                          <Badge key={skill.id} variant="secondary">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}