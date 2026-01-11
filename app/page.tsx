import { Navbar } from "@/components/navbar"
import { SpaceBackground } from "@/components/space-background"
import { Planet } from "@/components/planet"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Rocket, Code, Palette, BookOpen, ExternalLink, Download } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import React from "react"
import { TypingText } from "@/components/typing-text"

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").limit(1).single()
  const { data: skills } = await supabase.from("skills").select("*").order("level", { ascending: false })
  const { data: experiences } = await supabase.from("experiences").select("*").order("order_index", { ascending: true })
  const { data: books } = await supabase.from("books").select("*").order("created_at", { ascending: false })
  const { data: projects } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <Navbar />

      {/* Hero Section */}
      <ScrollReveal>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold animate-fade-in">
                <span className="gradient-text">{profile?.full_name || "Welcome !"}</span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 animate-fade-in text-balance">
                <TypingText text={profile?.tagline || "Exploring Code Beyond The Universe"} speed={50} />
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="lg" className="animate-glow group" asChild>
                  <a href="#projects" className="flex items-center">
                    Explore Projects
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="glass bg-transparent" asChild>
                  <a href="https://wa.me/62895397306279" target="_blank" rel="noopener noreferrer">
                    Contact Me
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center animate-float">
              <Planet size={350} />
            </div>
          </div>
        </div>
      </section>

      </ScrollReveal>

      {/* Home Section */}
      <ScrollReveal>
        <section id="home" className="relative py-20 md:py-32">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="font-heading text-4xl md:text-5xl font-bold gradient-text">Who Am I</h2>
              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed text-pretty">
                {profile?.bio ||
                  "A passionate Computer Science student and developer exploring the infinite possibilities of technology. I craft digital experiences that push boundaries and inspire innovation."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {[
                  { icon: Code, title: "Web Development", desc: "Building modern, responsive web applications" },
                  { icon: Rocket, title: "Software Engineering", desc: "Creating scalable software solutions" },
                  { icon: Palette, title: "UI/UX Design", desc: "Designing beautiful user experiences" },
                ].map((item, index) => (
                  <Card key={index} className="glass group hover:scale-105 transition-all cursor-pointer">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:animate-glow">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-heading text-xl font-bold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Profile & Skills Section */}
      <ScrollReveal>
        <section
          id="profile"
          className="relative py-20 md:py-32 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"
        >
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-center gradient-text mb-16">
              Profile & Skills
            </h2>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <Card className="glass p-8 space-y-6 animate-float">
                <div className="relative w-48 h-48 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent animate-rotate-slow blur-xl opacity-50" />
                  <img
                    src={profile?.profile_image_url || "/images/gauza.jpeg"}
                    alt="Profile"
                    className="relative w-full h-full rounded-full object-cover border-4 border-primary/30"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-heading text-2xl font-bold">{profile?.full_name || "Muhammad Gauza Faliha"}</h3>
                  <p className="text-muted-foreground">
                    {profile?.tagline ||
                      "Computer Science Student at Gadjah Mada University I Accelerated Program Graduate l Research and Technology Enthusiast l Software Engineer Enthusiast l Junior Front End Developer & Full Stack Developer."}
                  </p>
                </div>
              </Card>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-2xl font-bold">Tech Stack</h3>
                  <Link href="/admin/skills">
                    <Button variant="outline" size="sm" className="glass">
                      Manage Skills
                    </Button>
                  </Link>
                </div>

                {skills && skills.length > 0 ? (
                  <div className="space-y-4">
                    {skills.slice(0, 8).map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{skill.name}</span>
                            {skill.category && (
                              <Badge variant="secondary" className="text-xs">
                                {skill.category}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground font-medium">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out animate-glow"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    {skills.length > 8 && (
                      <div className="text-center pt-4">
                        <Link href="/admin/skills">
                          <Button variant="ghost" size="sm" className="text-primary">
                            View all {skills.length} skills →
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">No skills data available yet.</p>
                    <Link href="/admin/skills">
                      <Button variant="outline" size="sm" className="glass">
                        Add Your First Skill
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Experience Section */}
      <ScrollReveal>
        <section id="experience" className="relative py-20 md:py-32">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-center gradient-text mb-16">
              Journey Timeline
            </h2>

            <div className="max-w-4xl mx-auto relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

              <div className="space-y-12">
                {experiences && experiences.length > 0 ? (
                  experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-20 group">
                      <div className="absolute left-0 top-0 w-16 h-16">
                        <Planet size={64} className="group-hover:scale-110 transition-transform" />
                      </div>

                      <Card className="glass p-6 group-hover:scale-105 transition-all">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="font-heading text-xl font-bold">{exp.title}</h3>
                            <span className="text-sm text-primary font-medium">{exp.year}</span>
                          </div>
                          <p className="text-accent font-medium">{exp.role}</p>
                          <p className="text-muted-foreground">{exp.description}</p>
                        </div>
                      </Card>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No experiences available yet.</p>
                    <Link href="/admin">
                      <Button variant="outline" className="glass">
                        Add Your Experience
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Books Section */}
      <ScrollReveal>
        <section
          id="books"
          className="relative py-20 md:py-32 bg-gradient-to-b from-transparent via-secondary/5 to-transparent"
        >
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-center gradient-text mb-16">
              Publications & Books
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {books && books.length > 0 ? (
                books.map((book) => (
                  <Card key={book.id} className="glass overflow-hidden group hover:scale-105 transition-all">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={book.cover_image_url || "/placeholder.svg?height=400&width=300&query=book+cover"}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-heading text-xl font-bold line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{book.description}</p>
                      <div className="flex gap-2">
                        {book.external_link && (
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                            <a href={book.external_link} target="_blank" rel="noopener noreferrer">
                              <BookOpen className="w-4 h-4 mr-2" />
                              View
                            </a>
                          </Button>
                        )}
                        {book.pdf_url && (
                          <Button size="sm" className="flex-1" asChild>
                            <a href={book.pdf_url} download>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground mb-4">No books available yet.</p>
                  <Link href="/admin">
                    <Button variant="outline" className="glass">
                      Add Your Book
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Projects Section */}
      <ScrollReveal>
        <section id="projects" className="relative py-20 md:py-32">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-center gradient-text mb-16">
              Latest Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <Card
                    key={project.id}
                    className="glass overflow-hidden group hover:scale-105 transition-all cursor-pointer"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Planet size={100} className="absolute top-4 right-4 opacity-50" />
                      <img
                        src={project.image_url || "/placeholder.svg?height=300&width=400&query=web+project"}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-heading text-xl font-bold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      <Button size="sm" className="w-full group/btn" asChild>
                        <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                          Visit Website
                          <ExternalLink className="w-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground mb-4">No projects available yet.</p>
                  <Link href="/admin">
                    <Button variant="outline" className="glass">
                      Add Your First Project
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="glass bg-transparent" asChild>
                <Link href="/admin">
                  Manage Projects
                  <ChevronRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer className="relative py-12 border-t border-border/50">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Rocket className="w-6 h-6 text-primary animate-glow" />
              <span className="font-heading text-xl font-bold gradient-text">GAUZA DEV</span>
            </div>
            <p className="text-sm text-muted-foreground">Built with Next.js, Tailwind CSS, and Supabase</p>
            <p className="text-sm text-muted-foreground">© 2026 All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
