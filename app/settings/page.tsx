"use client"

import Link from "next/link"
import { Bell, CreditCard, LineChart, Lock, Settings } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedGradientBorder } from "@/components/animated-gradient-border"

export default function SettingsPage() {
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
          <nav className="hidden md:flex gap-6 z-10">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/wallet" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Wallet
            </Link>
            <Link href="/bot" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Telegram Bot
            </Link>
            <Link
              href="/settings"
              className="text-sm font-medium text-primary hover:text-primary/80 border-b-2 border-primary"
            >
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-4 z-10">
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="account" className="space-y-4 z-10">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-4 z-10">
            <AnimatedGradientBorder>
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                    </div>
                    <div className="grid gap-4 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input id="first-name" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input id="last-name" defaultValue="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue="johndoe" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
              </AnimatedGradientBorder>
              <AnimatedGradientBorder>
                <Card>
                  <CardHeader>
                    <CardTitle>Trading Preferences</CardTitle>
                    <CardDescription>Configure your AI agent's trading behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
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
                        Determines the types of trades your AI agent will make
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-allocation">Maximum Allocation Per Trade</Label>
                      <div className="grid grid-cols-4 gap-2">
                        <Button variant="outline" className="w-full">
                          5%
                        </Button>
                        <Button variant="default" className="w-full">
                          10%
                        </Button>
                        <Button variant="outline" className="w-full">
                          15%
                        </Button>
                        <Button variant="outline" className="w-full">
                          20%
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Maximum percentage of your wallet that can be allocated to a single trade
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trade-duration">Trade Duration</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="w-full">
                          Short-term
                        </Button>
                        <Button variant="default" className="w-full">
                          Medium-term
                        </Button>
                        <Button variant="outline" className="w-full">
                          Long-term
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">Preferred holding period for trades</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </AnimatedGradientBorder>
            </TabsContent>
            <TabsContent value="security" className="space-y-4">
            <AnimatedGradientBorder>
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>
              </AnimatedGradientBorder>
              <AnimatedGradientBorder>
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-sm text-muted-foreground">
                            Protect your account with an additional security layer
                          </div>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage API access to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Read-Only API Key</div>
                      <div className="text-sm text-muted-foreground">
                        For external portfolio trackers and analytics tools
                      </div>
                    </div>
                    <Button variant="outline">Generate</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              <AnimatedGradientBorder>
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Trade Notifications</div>
                            <div className="text-sm text-muted-foreground">
                              Get notified when your AI agent makes a trade
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch id="email-trades" />
                            <Label htmlFor="email-trades">Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="push-trades" defaultChecked />
                            <Label htmlFor="push-trades">Push</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="sms-trades" />
                            <Label htmlFor="sms-trades">SMS</Label>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Signal Detections</div>
                            <div className="text-sm text-muted-foreground">
                              Get notified when your AI agent detects a trading signal
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch id="email-signals" defaultChecked />
                            <Label htmlFor="email-signals">Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="push-signals" defaultChecked />
                            <Label htmlFor="push-signals">Push</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="sms-signals" />
                            <Label htmlFor="sms-signals">SMS</Label>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Performance Reports</div>
                            <div className="text-sm text-muted-foreground">
                              Receive regular reports on your AI agent's performance
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch id="email-reports" defaultChecked />
                            <Label htmlFor="email-reports">Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="push-reports" />
                            <Label htmlFor="push-reports">Push</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="sms-reports" />
                            <Label htmlFor="sms-reports">SMS</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </AnimatedGradientBorder>
            </TabsContent>
            <TabsContent value="billing" className="space-y-4">
            <AnimatedGradientBorder>
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Plan</CardTitle>
                  <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Pro Plan</div>
                        <div className="text-sm text-muted-foreground">$79/month</div>
                      </div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Current Plan</div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">Next billing date: March 28, 2025</div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        Change Plan
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-500">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </AnimatedGradientBorder>
              <AnimatedGradientBorder>
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Visa ending in 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 04/2026</div>
                        </div>
                      </div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Default</div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

