import Link from "next/link"
import { ArrowUpRight, Bot, ChevronDown, ChevronUp, DollarSign, LineChart, Plus, Settings, Wallet } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
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
            <Link
              href="/dashboard"
              className="text-sm font-medium text-primary hover:text-primary/80 border-b-2 border-primary"
            >
              Dashboard
            </Link>
            <Link href="/wallet" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Wallet
            </Link>
            <Link href="/bot" className="text-sm font-medium text-muted-foreground hover:text-foreground">
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
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Monitor your AI agent's performance and portfolio</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-1">
                <Wallet className="h-4 w-4" />
                Fund Wallet
              </Button>
              <Button className="gap-1">
                <Bot className="h-4 w-4" />
                Add to Telegram
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">+2 new positions today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-500">+$892.40</div>
                <p className="text-xs text-muted-foreground">+15.3% all time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Telegram Groups</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Monitoring 3 active groups</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="portfolio" className="space-y-4">
            <TabsList>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="portfolio" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Portfolio</CardTitle>
                  <CardDescription>Your AI agent is currently holding these assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_100px] gap-4 font-medium text-sm text-muted-foreground">
                      <div>Asset</div>
                      <div className="text-right">Amount</div>
                      <div className="text-right">Value</div>
                      <div className="text-right">Change</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_100px] gap-4 items-center py-3 border-b">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="ETH" />
                          <AvatarFallback>ETH</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Ethereum</div>
                          <div className="text-xs text-muted-foreground">ETH</div>
                        </div>
                      </div>
                      <div className="text-right">1.45 ETH</div>
                      <div className="text-right">$2,784.35</div>
                      <div className="text-right text-emerald-500 flex items-center justify-end gap-1">
                        <ChevronUp className="h-4 w-4" />
                        8.2%
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_100px] gap-4 items-center py-3 border-b">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="SOL" />
                          <AvatarFallback>SOL</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Solana</div>
                          <div className="text-xs text-muted-foreground">SOL</div>
                        </div>
                      </div>
                      <div className="text-right">24.5 SOL</div>
                      <div className="text-right">$892.75</div>
                      <div className="text-right text-emerald-500 flex items-center justify-end gap-1">
                        <ChevronUp className="h-4 w-4" />
                        12.4%
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_100px] gap-4 items-center py-3 border-b">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="LINK" />
                          <AvatarFallback>LINK</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Chainlink</div>
                          <div className="text-xs text-muted-foreground">LINK</div>
                        </div>
                      </div>
                      <div className="text-right">45.0 LINK</div>
                      <div className="text-right">$554.79</div>
                      <div className="text-right text-red-500 flex items-center justify-end gap-1">
                        <ChevronDown className="h-4 w-4" />
                        3.2%
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_100px] gap-4 items-center py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <div className="font-medium">Add new asset</div>
                      </div>
                      <div className="text-right"></div>
                      <div className="text-right"></div>
                      <div className="text-right"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Allocation</CardTitle>
                  <CardDescription>Current distribution of your assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                        <div>Ethereum (ETH)</div>
                      </div>
                      <div>65.8%</div>
                    </div>
                    <Progress value={65.8} className="h-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                        <div>Solana (SOL)</div>
                      </div>
                      <div>21.1%</div>
                    </div>
                    <Progress value={21.1} className="h-2 bg-muted [&>*]:bg-blue-500" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-green-500"></div>
                        <div>Chainlink (LINK)</div>
                      </div>
                      <div>13.1%</div>
                    </div>
                    <Progress value={13.1} className="h-2 bg-muted [&>*]:bg-green-500" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your AI agent's recent trading activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <ArrowUpRight className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Bought Solana (SOL)</div>
                            <div className="text-sm text-muted-foreground">2 hours ago</div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            AI detected positive sentiment in Crypto Insiders group
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">+5.2 SOL</div>
                          <div className="text-sm text-muted-foreground">$189.28</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <ArrowUpRight className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Bought Ethereum (ETH)</div>
                            <div className="text-sm text-muted-foreground">5 hours ago</div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            AI detected major announcement in ETH Traders group
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">+0.25 ETH</div>
                          <div className="text-sm text-muted-foreground">$480.75</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                          <ArrowUpRight className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Sold Avalanche (AVAX)</div>
                            <div className="text-sm text-muted-foreground">Yesterday</div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            AI detected negative sentiment across multiple groups
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">-12.5 AVAX</div>
                          <div className="text-sm text-muted-foreground">$320.50</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Market Insights</CardTitle>
                  <CardDescription>Latest analysis from your AI agent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <div className="font-medium">Ethereum (ETH) Analysis</div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Multiple Telegram groups are discussing a potential ETH upgrade announcement. Sentiment is
                        highly positive with 87% confidence.
                      </p>
                      <div className="text-sm font-medium text-primary">Recommendation: Increase position</div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <div className="font-medium">Solana (SOL) Analysis</div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Detected insider discussion about a major partnership announcement in the next 48 hours.
                        Sentiment analysis shows 92% confidence.
                      </p>
                      <div className="text-sm font-medium text-primary">Recommendation: Buy position</div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="h-5 w-5 text-primary" />
                        <div className="font-medium">Cardano (ADA) Analysis</div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Mixed signals detected across groups. Some mention of development delays, but also positive
                        sentiment about upcoming features.
                      </p>
                      <div className="text-sm font-medium text-yellow-500">Recommendation: Monitor closely</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Insights
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

