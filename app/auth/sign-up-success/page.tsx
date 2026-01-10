import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SpaceBackground } from "@/components/space-background"
import { Mail, Rocket } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <SpaceBackground />

      <Card className="glass w-full max-w-md relative z-10">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="relative">
              <Rocket className="w-12 h-12 text-primary animate-glow" />
              <Mail className="w-6 h-6 text-accent absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <CardTitle className="text-2xl font-heading gradient-text">Check Your Email</CardTitle>
          <CardDescription>We've sent you a confirmation email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Please check your email and click the confirmation link to activate your account before signing in.
          </p>
          <Button className="w-full" asChild>
            <Link href="/auth/login">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
