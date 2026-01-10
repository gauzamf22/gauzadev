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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, BookOpen, Star, Calendar } from "lucide-react"
import Image from "next/image"

export default async function BooksPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user's books
  const { data: books } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const toReadBooks = books?.filter(book => book.status === 'to-read') || []
  const readingBooks = books?.filter(book => book.status === 'reading') || []
  const completedBooks = books?.filter(book => book.status === 'completed') || []

  const formatDate = (date: string | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    })
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    )
  }

  const BookCard = ({ book }: { book: any }) => (
    <div className="glass p-4 rounded-lg border border-border/50 hover:border-border transition-all hover:scale-[1.02]">
      <div className="flex gap-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          {book.cover_url ? (
            <div className="w-24 h-32 relative rounded-md overflow-hidden bg-muted">
              <Image
                src={book.cover_url}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-32 rounded-md bg-muted flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg leading-tight">{book.title}</h3>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {book.rating && (
            <div className="flex items-center gap-2">
              {renderStars(book.rating)}
            </div>
          )}

          {book.isbn && (
            <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
          )}

          {(book.started_date || book.completed_date) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {book.started_date && <span>Started: {formatDate(book.started_date)}</span>}
              {book.completed_date && <span>• Completed: {formatDate(book.completed_date)}</span>}
            </div>
          )}

          {book.review && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {book.review}
            </p>
          )}
        </div>
      </div>
    </div>
  )

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
              Books Management
            </h1>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Book
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add New Book Form */}
            <Card className="glass lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Add Book
                </CardTitle>
                <CardDescription>Add a book to your reading list</CardDescription>
              </CardHeader>
              <CardContent>
                <form action="/api/books/create" method="POST" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Book Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="The Great Gatsby"
                      required
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      name="author"
                      placeholder="F. Scott Fitzgerald"
                      required
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN (Optional)</Label>
                    <Input
                      id="isbn"
                      name="isbn"
                      placeholder="978-3-16-148410-0"
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover_url">Cover Image URL</Label>
                    <Input
                      id="cover_url"
                      name="cover_url"
                      type="url"
                      placeholder="https://example.com/cover.jpg"
                      className="glass"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="to-read">
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to-read">To Read</SelectItem>
                        <SelectItem value="reading">Currently Reading</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Select name="rating">
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">⭐ 1 Star</SelectItem>
                        <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="started_date">Started Date</Label>
                      <Input
                        id="started_date"
                        name="started_date"
                        type="date"
                        className="glass"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="completed_date">Completed Date</Label>
                      <Input
                        id="completed_date"
                        name="completed_date"
                        type="date"
                        className="glass"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review">Review</Label>
                    <Textarea
                      id="review"
                      name="review"
                      placeholder="Write your thoughts about the book..."
                      rows={3}
                      className="glass resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add Book
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Books List */}
            <div className="lg:col-span-2">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Your Reading List</CardTitle>
                  <CardDescription>
                    Track and manage your books ({books?.length || 0} total)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">
                        All ({books?.length || 0})
                      </TabsTrigger>
                      <TabsTrigger value="to-read">
                        To Read ({toReadBooks.length})
                      </TabsTrigger>
                      <TabsTrigger value="reading">
                        Reading ({readingBooks.length})
                      </TabsTrigger>
                      <TabsTrigger value="completed">
                        Completed ({completedBooks.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4 mt-4">
                      {!books || books.length === 0 ? (
                        <div className="text-center py-12">
                          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground mb-4">No books added yet</p>
                          <p className="text-sm text-muted-foreground">
                            Start building your reading list
                          </p>
                        </div>
                      ) : (
                        books.map((book) => <BookCard key={book.id} book={book} />)
                      )}
                    </TabsContent>

                    <TabsContent value="to-read" className="space-y-4 mt-4">
                      {toReadBooks.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No books in your to-read list</p>
                        </div>
                      ) : (
                        toReadBooks.map((book) => <BookCard key={book.id} book={book} />)
                      )}
                    </TabsContent>

                    <TabsContent value="reading" className="space-y-4 mt-4">
                      {readingBooks.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No books currently reading</p>
                        </div>
                      ) : (
                        readingBooks.map((book) => <BookCard key={book.id} book={book} />)
                      )}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-4 mt-4">
                      {completedBooks.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No completed books yet</p>
                        </div>
                      ) : (
                        completedBooks.map((book) => <BookCard key={book.id} book={book} />)
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}