"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Bot, LineChart, Shield, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthForm } from "@/components/auth-form"
import { CardStack } from "@/components/ui/card-stack"
import { FlipWords } from "@/components/ui/flip-words"

export default function Home() {
  const [showAuthForm, setShowAuthForm] = useState(false)
  const words = ["Trading","Intelligence", "Detection", "Identification"];
  // Define the stack of cards
  const cards = [
    {
      id: 1,
      icon: <LineChart className="h-12 w-12 text-primary" />,
      content: (
        <p>
          Our AI constantly monitors Telegram groups for market signals and trading
          opportunities.
        </p>
      ),
    },
    {
      id: 2,
      icon: <Bot className="h-12 w-12 text-primary" />,
      content: (
        <p>
          Add our bot to any Telegram group to start analyzing messages for trading
          signals.
        </p>
      ),
    },
    {
      id: 3,
      icon: <Wallet className="h-12 w-12 text-primary" />,
      content: (
        <p>
          Fund your AI agent's wallet and let it execute trades automatically.
        </p>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] z-0"></div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-primary" />
            <span>CryptoSentinel</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setShowAuthForm(true)}>
              Login
            </Button>
            <Button size="sm" onClick={() => setShowAuthForm(true)}>
              Get Started
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 z-10">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              {/* Left Column: Heading and Description */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-6xl font-bold tracking-tighter text-neutral-600 dark:text-neutral-400">
                    &nbsp;AI-Powered Crypto <FlipWords words={words}/>Bot
                </div>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Automatically detect market opportunities from Telegram groups and trade with confidence using our
                    advanced AI agent.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: CardStack */}
              <div className="hidden lg:block ml-12"> {/* Added ml-12 to shift the CardStack to the right */}
                <CardStack
                  items={cards}
                  offset={10}
                  scaleFactor={0.06}
                  autoFlipInterval={3000}
                />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 z-10">
          <div className="container px-4 md:px-6 z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Our AI agent combines cutting-edge technology with crypto trading expertise
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 z-10">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Bot className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Telegram Integration</h3>
                <p className="text-center text-muted-foreground">
                  Add our bot to any Telegram group to start analyzing messages for trading signals
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm z-10">
                <Wallet className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Self-Funded Wallet</h3>
                <p className="text-center text-muted-foreground">
                  Fund your AI agent's wallet and let it execute trades automatically
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm z-10">
                <LineChart className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Smart Portfolio</h3>
                <p className="text-center text-muted-foreground">
                  Track performance and manage your AI-powered crypto portfolio in real-time
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Get started with CryptoSentinel in just a few simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Create Account</h3>
                <p className="text-center text-muted-foreground">
                  Sign up and configure your trading preferences and risk tolerance
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Fund Wallet</h3>
                <p className="text-center text-muted-foreground">
                  Add funds to your AI agent's wallet to enable automated trading
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Add Bot to Telegram</h3>
                <p className="text-center text-muted-foreground">
                  Add our Telegram bot to groups where market insights are shared
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Pricing Plans</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Choose the plan that fits your trading strategy
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col rounded-lg border shadow-sm">
                <div className="p-6">
                  <h3 className="text-2xl font-bold">Starter</h3>
                  <div className="mt-4 text-3xl font-bold">$29/mo</div>
                  <p className="mt-2 text-muted-foreground">For individual traders getting started</p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>1 Telegram group</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Basic market analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Up to $1,000 in wallet</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col p-6 pt-0">
                  <Link href="/register?plan=starter">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col rounded-lg border shadow-sm bg-primary/5 border-primary/20">
                <div className="p-6">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <div className="mt-4 text-3xl font-bold">$79/mo</div>
                  <p className="mt-2 text-muted-foreground">For serious traders seeking an edge</p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>5 Telegram groups</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Advanced sentiment analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Up to $10,000 in wallet</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Priority trade execution</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col p-6 pt-0">
                  <Link href="/register?plan=pro">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col rounded-lg border shadow-sm">
                <div className="p-6">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <div className="mt-4 text-3xl font-bold">$199/mo</div>
                  <p className="mt-2 text-muted-foreground">For professional trading operations</p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Unlimited Telegram groups</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Premium AI analysis engine</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Unlimited wallet funding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Dedicated account manager</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col p-6 pt-0">
                  <Link href="/register?plan=enterprise">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 CryptoSentinel. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
      {showAuthForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <AuthForm onClose={() => setShowAuthForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

