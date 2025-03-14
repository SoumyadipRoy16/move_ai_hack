"use client"

import Link from "next/link"
import { Bot, Check, Copy, LineChart, MessageSquare, Plus, Settings } from "lucide-react"
import { useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Lenis from "@studio-freight/lenis"

export default function BotPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      gestureOrientation: "vertical",
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number): void {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target?.tagName === "A" &&
        (target as HTMLAnchorElement).getAttribute("href")?.startsWith("#")
      ) {
        event.preventDefault();
        const sectionId: string | null = (
          target as HTMLAnchorElement
        ).getAttribute("href");
        const section: HTMLElement | null = document.querySelector(
          sectionId as string
        );
        if (section) {
          lenis.scrollTo(section, { offset: -10 });
        }
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);
  return (
    <div className="flex min-h-screen dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] z-0"></div>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link href="/" className="flex items-center gap-2">
              <LineChart className="h-6 w-6 text-primary" />
              <span>CryptoSentinel</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/wallet" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Wallet
            </Link>
            <Link
              href="/bot"
              className="text-sm font-medium text-primary hover:text-primary/80 border-b-2 border-primary"
            >
              Telegram Bot
            </Link>
            <Link href="/settings" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 z-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Telegram Bot</h1>
              <p className="text-muted-foreground">Set up and manage your AI trading bot on Telegram</p>
            </div>
            <div className="flex items-center gap-2">
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Add New Group
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bot Username</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">@CryptoSentinelBot</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Copy className="h-3 w-3" />
                  <span>Click to copy</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Out of 5 allowed in your plan</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
                <Check className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-emerald-500">Active</div>
                <p className="text-xs text-muted-foreground">Last active: 2 minutes ago</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="groups" className="space-y-4">
            <TabsList>
              <TabsTrigger value="groups">Monitored Groups</TabsTrigger>
              <TabsTrigger value="setup">Bot Setup</TabsTrigger>
              <TabsTrigger value="settings">Bot Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="groups" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Telegram Groups</CardTitle>
                  <CardDescription>Groups your AI agent is currently monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Crypto Insiders" />
                            <AvatarFallback>CI</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Crypto Insiders</div>
                            <div className="text-xs text-muted-foreground">12,458 members</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full">
                            Active
                          </div>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <div className="font-medium text-foreground text-xs mb-1">Recent Analysis:</div>
                        High quality signals with 78% accuracy. Detected 5 profitable trades in the last week.
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="ETH Traders" />
                            <AvatarFallback>ET</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">ETH Traders</div>
                            <div className="text-xs text-muted-foreground">8,921 members</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full">
                            Active
                          </div>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <div className="font-medium text-foreground text-xs mb-1">Recent Analysis:</div>
                        Focused on Ethereum ecosystem. Good source for ETH-related news and developments.
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Alpha Hunters" />
                            <AvatarFallback>AH</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Alpha Hunters</div>
                            <div className="text-xs text-muted-foreground">5,672 members</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full">
                            Active
                          </div>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <div className="font-medium text-foreground text-xs mb-1">Recent Analysis:</div>
                        Frequent discussion of new tokens and market opportunities. High signal-to-noise ratio.
                      </div>
                    </div>
                    <div className="flex items-center justify-center p-4 border border-dashed rounded-lg">
                      <Button variant="outline" className="gap-1">
                        <Plus className="h-4 w-4" />
                        Add New Group
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="setup" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Setup Instructions</CardTitle>
                  <CardDescription>Follow these steps to set up your Telegram bot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        1
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Open Telegram and search for @CryptoSentinelBot</div>
                        <div className="text-sm text-muted-foreground">Click on the bot to start a conversation</div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        2
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Start the bot by clicking the Start button</div>
                        <div className="text-sm text-muted-foreground">
                          This will activate your bot and link it to your account
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        3
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Add the bot to your Telegram groups</div>
                        <div className="text-sm text-muted-foreground">
                          Open the group, click on the group name, then "Add members" and search for @CryptoSentinelBot
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        4
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Give the bot admin privileges</div>
                        <div className="text-sm text-muted-foreground">
                          The bot needs to be able to read messages to analyze them for trading signals
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        5
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Return to this dashboard and refresh</div>
                        <div className="text-sm text-muted-foreground">
                          Your groups should now appear in the "Monitored Groups" tab
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-1">
                    <Bot className="h-4 w-4" />
                    Open Telegram
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Settings</CardTitle>
                  <CardDescription>Configure how your AI agent analyzes and responds to messages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Bot Name</div>
                    <Input defaultValue="CryptoSentinel" />
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Analysis Sensitivity</div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="w-full">
                        Low
                      </Button>
                      <Button variant="default" className="w-full">
                        Medium
                      </Button>
                      <Button variant="outline" className="w-full">
                        High
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Higher sensitivity may generate more signals but with potentially lower accuracy
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Trading Behavior</div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="w-full">
                        Conservative
                      </Button>
                      <Button variant="default" className="w-full">
                        Balanced
                      </Button>
                      <Button variant="outline" className="w-full">
                        Aggressive
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Determines how quickly the AI will act on detected signals
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Notification Settings</div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="trade-notifications"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="trade-notifications" className="text-sm">
                        Trade notifications
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="signal-notifications"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="signal-notifications" className="text-sm">
                        Signal detection notifications
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="performance-notifications"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="performance-notifications" className="text-sm">
                        Weekly performance reports
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

