"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/frontend/components/ui/button"
import { Input } from "@/frontend/components/ui/input"
import { Label } from "@/frontend/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/frontend/components/ui/card"
import { FaGoogle } from "react-icons/fa"
import { X } from "lucide-react"
import { SpotlightCard } from "./spotlight-card"

interface AuthFormProps {
  onClose: () => void
}

export function AuthForm({ onClose }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("password123")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would validate credentials here
    // For this demo, we'll just redirect to the dashboard
    router.push("/dashboard")
  }

  return (
    <SpotlightCard className="w-full max-w-md mx-auto bg-background/95 backdrop-blur-sm">
      <CardHeader className="relative">
        <button className="absolute top-2 right-2 text-muted-foreground hover:text-foreground" onClick={onClose}>
          <X size={24} />
        </button>
        <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
        <CardDescription>
          {isLogin ? "Enter your credentials to access your account" : "Create a new account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" type="submit">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </form>
        <div className="relative mt-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={() => {}}>
          <FaGoogle className="mr-2 h-4 w-4" /> Google
        </Button>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="w-full" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </Button>
      </CardFooter>
    </SpotlightCard>
  )
}

