"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface ImageUploadProps {
  userId: string
  currentImageUrl?: string | null
  bucket?: string
  path?: string
}

export function ImageUpload({ 
  userId, 
  currentImageUrl, 
  bucket = "avatars",
  path = "profile"
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(currentImageUrl)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    try {
      setUploading(true)

      // Create unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `${path}/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      // Update profile in database - USING profile_image_url field
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      setImageUrl(publicUrl)
      setPreview(null)
      
      // Refresh the page to show updated image
      router.refresh()
      
      alert('Profile picture updated successfully!')
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) return

    try {
      setUploading(true)

      // Update profile to remove image - USING profile_image_url field
      const { error } = await supabase
        .from('profiles')
        .update({ profile_image_url: null })
        .eq('id', userId)

      if (error) throw error

      setImageUrl(null)
      setPreview(null)
      router.refresh()
      
      alert('Profile picture removed successfully!')
    } catch (error) {
      console.error('Error removing image:', error)
      alert('Error removing image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-6 flex-col sm:flex-row">
        {/* Image Preview */}
        <div className="relative mx-auto sm:mx-0">
          {preview || imageUrl ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
              <Image
                src={preview || imageUrl || ''}
                alt="Profile"
                fill
                className="object-cover"
              />
              {!uploading && (
                <button
                  onClick={removeImage}
                  className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold mb-1">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              Upload a photo to personalize your profile. Max size 5MB.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {imageUrl ? 'Change Photo' : 'Upload Photo'}
                </>
              )}
            </Button>

            {imageUrl && !uploading && (
              <Button
                type="button"
                variant="ghost"
                onClick={removeImage}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Recommended: Square image, at least 400x400px
          </p>
        </div>
      </div>
    </div>
  )
}