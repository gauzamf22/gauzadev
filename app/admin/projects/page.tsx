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
import { ArrowLeft, Plus, Pencil, Trash2, FolderKanban, ExternalLink, Github, Star, Calendar } from "lucide-react"
import Image from "next/image"

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const formatDate = (date: string | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'planning':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      case 'planning':
        return 'Planning'
      default:
        return status
    }
  }

  const ProjectCard = ({ project }: { project: any }) => (
    <Card className="glass overflow-hidden hover:border-border transition-all hover:scale-[1.02] group">
      {/* Project Image */}
      {project.image_url ? (
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {project.featured && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-yellow-500/90 text-yellow-900 border-0">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 w-full bg-muted flex items-center justify-center">
          <FolderKanban className="h-12 w-12 text-muted-foreground" />
          {project.featured && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-yellow-500/90 text-yellow-900 border-0">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardContent className="p-6 space-y-4">
        {/* Project Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-xl leading-tight">{project.title}</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Badge className={getStatusColor(project.status)}>
            {getStatusLabel(project.status)}
          </Badge>
        </div>

        {/* Project Description */}
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {/* Project Dates */}
        {(project.start_date || project.end_date) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {project.start_date && <span>{formatDate(project.start_date)}</span>}
            {project.end_date && (
              <>
                <span>-</span>
                <span>{formatDate(project.end_date)}</span>
              </>
            )}
            {!project.end_date && project.start_date && (
              <>
                <span>-</span>
                <span>Present</span>
              </>
            )}
          </div>
        )}

        {/* Project Links */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          {project.demo_url && (
            <Button variant="outline" size="sm" asChild className="flex-1">
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
          {project.github_url && (
            <Button variant="outline" size="sm" asChild className="flex-1">
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text">
              Projects Management
            </h1>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Add New Project Form */}
            <Card className="glass lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5" />
                  Add Project
                </CardTitle>
                <CardDescription>Create a new project showcase</CardDescription>
              </CardHeader>
              <CardContent>
                <form action="/api/projects/create" method="POST" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="My Awesome Project"
                      required
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Brief overview of your project..."
                      rows={2}
                      className="glass resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="long_description">Detailed Description</Label>
                    <Textarea
                      id="long_description"
                      name="long_description"
                      placeholder="Detailed information about your project..."
                      rows={4}
                      className="glass resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Project Image URL</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      type="url"
                      placeholder="https://example.com/project.jpg"
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demo_url">Demo URL</Label>
                    <Input
                      id="demo_url"
                      name="demo_url"
                      type="url"
                      placeholder="https://demo.example.com"
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      name="github_url"
                      type="url"
                      placeholder="https://github.com/user/repo"
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                    <Input
                      id="technologies"
                      name="technologies"
                      placeholder="React, TypeScript, Node.js"
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="in-progress">
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
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
                    <Checkbox id="featured" name="featured" />
                    <Label
                      htmlFor="featured"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Feature this project
                    </Label>
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Projects Grid */}
            <div className="lg:col-span-3">
              {!projects || projects.length === 0 ? (
                <Card className="glass">
                  <CardContent className="py-12">
                    <div className="text-center">
                      <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No projects added yet</p>
                      <p className="text-sm text-muted-foreground">
                        Start showcasing your work by adding your first project
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project Statistics */}
          {projects && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <Card className="glass">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{projects.length}</p>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">
                      {projects.filter(p => p.status === 'completed').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">
                      {projects.filter(p => p.status === 'in-progress').length}
                    </p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-500">
                      {projects.filter(p => p.featured).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Featured</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}