"use client"

export function Planet({ size = 300, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 via-secondary/40 to-accent/40 blur-2xl animate-pulse" />
      <div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-primary via-secondary to-accent animate-rotate-slow"
        style={{
          boxShadow: "0 0 60px rgba(100, 200, 255, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  )
}
