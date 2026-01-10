import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { SpaceBackground } from "@/components/space-background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, Briefcase, MapPin, Calendar } from "lucide-react"

export default async function ExperiencesPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's experiences
  const { data: experiences } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', user.id)
    .order('start_date', { ascending: false })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text">
              Experience Management
            </h1>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Experience
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add New Experience Form */}
            <Card className="glass lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Add Experience
                </CardTitle>
                <CardDescription>Add a new work experience</CardDescription>
              </CardHeader>
              <CardContent>
                <form action="/api/experiences/create" method="POST" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Senior Developer"
                      required
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Tech Company Inc."
                      required
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="San Francisco, CA"
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Select name="employment_type" required>
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        name="start_date"
                        type="month"
                        required
                        className="glass"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        name="end_date"
                        type="month"
                        className="glass"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="is_current" name="is_current" />
                    <Label
                      htmlFor="is_current"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I currently work here
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your responsibilities and achievements..."
                      rows={4}
                      className="glass resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add Experience
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Experiences Timeline */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Work Experience Timeline</CardTitle>
                  <CardDescription>
                    Your professional journey ({experiences?.length || 0} positions)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!experiences || experiences.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No experiences added yet</p>
                      <p className="text-sm text-muted-foreground">
                        Add your first work experience using the form on the left
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 relative">
                      {/* Timeline line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

                      {experiences.map((exp, index) => (
                        <div key={exp.id} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute left-6 top-6 w-3 h-3 rounded-full bg-primary border-4 border-background hidden md:block -translate-x-[5px]" />
                          
                          <div className="md:ml-12 glass p-6 rounded-lg border border-border/50 hover:border-border transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-xl">{exp.title}</h3>
                                  {exp.is_current && (
                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                      Current
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex flex-col gap-2 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Briefcase className="h-4 w-4" />
                                    <span className="font-medium">{exp.company}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {exp.employment_type}
                                    </Badge>
                                  </div>

                                  {exp.location && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <MapPin className="h-4 w-4" />
                                      <span>{exp.location}</span>
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                    </span>
                                  </div>
                                </div>

                                {exp.description && (
                                  <p className="text-muted-foreground text-sm leading-relaxed">
                                    {exp.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}